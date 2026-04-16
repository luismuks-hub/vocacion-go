/**
 * VocaTest — app.js
 * Orquestador principal. Maneja el estado global y el flujo entre pantallas.
 * Depende de: data.js, engine.js, storage.js, ui.js
 */

const VocaApp = (() => {

  /* ============================================================
     ESTADO GLOBAL DE LA APLICACIÓN
  ============================================================ */
  const estado = {
    // Pantalla actual (1-9)
    pantallaActual: 1,

    // Datos del evaluado (Pantalla 3)
    usuario: {
      nombre: '',
      apellido: '',
      edad: null,
      grado: '',
      genero: '',
      region: '',
      institucion: ''
    },

    // Evaluación en curso (Pantalla 4)
    evaluacion: {
      items: [],          // preguntas mezcladas
      indiceActual: 0,    // pregunta que se muestra ahora
      respuestas: {},     // { 'IT-001': 4, 'IT-002': 3, ... }
      iniciadaEn: null,   // timestamp de inicio
      completada: false
    },

    // Resultado procesado (Pantalla 6+)
    resultado: null
  };

  /* ============================================================
     CONSTANTES DE NAVEGACIÓN
  ============================================================ */
  const PANTALLAS = {
    LANDING:        1,
    CONSENTIMIENTO: 2,
    REGISTRO:       3,
    EVALUACION:     4,
    PROCESANDO:     5,
    RESULTADOS:     6,
    CARRERAS:       7,
    COMPARTIR:      8,
    ADMIN:          9
  };

  /* ============================================================
     INICIALIZACIÓN
  ============================================================ */
  function init() {
    // Restaurar sesión si hay una guardada
    const sesion = DB.obtenerSesion();
    if (sesion && sesion.pantallaActual) {
      _restaurarSesion(sesion);
    }

    // Mostrar pantalla inicial
    VocaUI.renderPantalla(estado.pantallaActual, estado);

    // Registrar listeners globales
    _registrarListeners();

    console.log('VocaApp iniciado v' + VERSION);
  }

  /* ============================================================
     NAVEGACIÓN ENTRE PANTALLAS
  ============================================================ */
  function irA(numeroPantalla) {
    const anterior = estado.pantallaActual;
    estado.pantallaActual = numeroPantalla;

    // Guardar sesión en cada cambio de pantalla
    _guardarSesionActual();

    // Acciones especiales al entrar a ciertas pantallas
    switch (numeroPantalla) {
      case PANTALLAS.EVALUACION:
        // Siempre arrancar desde pregunta 1 con estado limpio
        // al navegar desde P3 (Registro) hacia P4
        _iniciarEvaluacion();
        break;

      case PANTALLAS.PROCESANDO:
        _procesarResultados();
        break;

      case PANTALLAS.ADMIN:
        _cargarDatosAdmin();
        break;
    }

    VocaUI.renderPantalla(numeroPantalla, estado);
    VocaUI.scrollTop();
  }

  function volver() {
    const mapa = {
      2: 1, 3: 2, 4: 3,
      6: 5, 7: 6, 8: 6, 9: 1
    };
    const destino = mapa[estado.pantallaActual] || 1;
    irA(destino);
  }

  /* ============================================================
     FLUJO: CONSENTIMIENTO (Pantalla 2)
  ============================================================ */
  function verificarConsentimiento(checks) {
    const todosMarcados = Object.values(checks).every(v => v === true);
    VocaUI.toggleBotonConsentimiento(todosMarcados);
    return todosMarcados;
  }

  /* ============================================================
     FLUJO: REGISTRO (Pantalla 3)
  ============================================================ */
  function actualizarUsuario(campo, valor) {
    estado.usuario[campo] = valor;
    const valido = _validarUsuario();
    VocaUI.toggleBotonRegistro(valido);
    return valido;
  }

  function _validarUsuario() {
    const u = estado.usuario;
    const edad = parseInt(u.edad);
    return (
      u.nombre.trim().length > 0 &&
      u.apellido.trim().length > 0 &&
      !isNaN(edad) && edad >= 15 && edad <= 25 &&
      u.grado.length > 0 &&
      u.genero.length > 0 &&
      u.region.length > 0 &&
      u.institucion.length > 0
    );
  }

  /* ============================================================
     FLUJO: EVALUACIÓN (Pantalla 4)
  ============================================================ */
  function _iniciarEvaluacion() {
    const config = DB.obtenerConfig();
    estado.evaluacion = {
      items: config.ordenAleatorio
        ? VocaEngine.mezclarItems()
        : VocaData.getItems(),
      indiceActual: 0,
      respuestas: {},
      iniciadaEn: Date.now(),
      completada: false
    };
  }

  function registrarRespuesta(valorLikert) {
    const item = estado.evaluacion.items[estado.evaluacion.indiceActual];
    if (!item) return;

    estado.evaluacion.respuestas[item.id] = valorLikert;
    _guardarSesionActual();

    // Actualizar UI con la selección
    VocaUI.actualizarSeleccion(valorLikert, item.id);

    // Avance automático si está activado en configuración
    const config = DB.obtenerConfig();
    if (config.avanceAutomatico) {
      setTimeout(() => siguientePregunta(), 500);
    }
  }

  function siguientePregunta() {
    const ev = estado.evaluacion;
    const itemActual = ev.items[ev.indiceActual];

    // No avanzar si no hay respuesta
    if (!ev.respuestas[itemActual?.id]) return;

    if (ev.indiceActual < ev.items.length - 1) {
      ev.indiceActual++;
      VocaUI.renderPregunta(
        ev.items[ev.indiceActual],
        ev.indiceActual,
        ev.items.length,
        ev.respuestas,
        ev.items[ev.indiceActual - 1]?.dim
      );
    } else {
      // Última pregunta respondida → ir a procesando
      ev.completada = true;
      irA(PANTALLAS.PROCESANDO);
    }
  }

  function preguntaAnterior() {
    const config = DB.obtenerConfig();
    if (!config.permitirRetroceder) return;

    const ev = estado.evaluacion;
    if (ev.indiceActual > 0) {
      ev.indiceActual--;
      VocaUI.renderPregunta(
        ev.items[ev.indiceActual],
        ev.indiceActual,
        ev.items.length,
        ev.respuestas,
        null
      );
    }
  }

  function getPreguntaActual() {
    return estado.evaluacion.items[estado.evaluacion.indiceActual] || null;
  }

  function tieneRespuestaActual() {
    const item = getPreguntaActual();
    return item ? !!estado.evaluacion.respuestas[item.id] : false;
  }

  /* ============================================================
     FLUJO: PROCESANDO (Pantalla 5)
  ============================================================ */
  function _procesarResultados() {
    // Resultado ya calculado en esta sesión
    if (estado.resultado) return;

    const duracionSeg = Math.round((Date.now() - estado.evaluacion.iniciadaEn) / 1000);

    // Calcular resultado con el engine
    const resultado = VocaEngine.procesarEvaluacion(estado.evaluacion.respuestas);
    estado.resultado = resultado;

    // Guardar evaluación completa en storage
    const evaluacionCompleta = {
      usuario: { ...estado.usuario },
      respuestas: { ...estado.evaluacion.respuestas },
      resultado,
      duracionSegundos: duracionSeg,
      completada: true
    };

    const guardada = DB.guardarEvaluacion(evaluacionCompleta);
    estado.evaluacion.idGuardado = guardada.id;

    // Limpiar sesión activa (ya está guardada como completa)
    DB.limpiarSesion();
  }

  /* ============================================================
     FLUJO: COMPARTIR (Pantalla 8)
  ============================================================ */
  function generarEnlaceCompartir() {
    const id = estado.evaluacion.idGuardado;
    if (!id) return null;
    // En Fase 1: enlace local con hash
    return `${window.location.origin}${window.location.pathname}#resultado/${id}`;
  }

  function copiarEnlace() {
    const enlace = generarEnlaceCompartir();
    if (!enlace) return;
    navigator.clipboard?.writeText(enlace)
      .then(() => VocaUI.showToast('✓ Enlace copiado al portapapeles'))
      .catch(() => VocaUI.showToast('No se pudo copiar automáticamente'));
  }

  function simularDescarga(tipo) {
    const msgs = {
      pdf:    '📄 Generando PDF... (disponible en Fase 2)',
      imagen: '🖼️ Guardando imagen... (disponible en Fase 2)',
      email:  '📧 Abriendo correo...',
      whatsapp: '💬 Abriendo WhatsApp...'
    };
    VocaUI.showToast(msgs[tipo] || 'Procesando...');
  }

  /* ============================================================
     FLUJO: ADMIN (Pantalla 9)
  ============================================================ */
  function _cargarDatosAdmin() {
    const evaluaciones = DB.listarEvaluaciones();
    const stats = DB.obtenerEstadisticas();
    VocaUI.renderAdmin(evaluaciones, stats);
  }

  function filtrarEvaluaciones(texto, categoria) {
    let lista = DB.listarEvaluaciones();

    if (texto) {
      const q = texto.toLowerCase();
      lista = lista.filter(e =>
        `${e.usuario?.nombre} ${e.usuario?.apellido}`.toLowerCase().includes(q) ||
        e.usuario?.region?.toLowerCase().includes(q)
      );
    }

    if (categoria && categoria !== 'todas') {
      lista = lista.filter(e => e.resultado?.categoria === categoria);
    }

    VocaUI.renderListaEvaluaciones(lista);
  }

  function eliminarEvaluacion(id) {
    if (!confirm('¿Eliminar esta evaluación?')) return;
    DB.eliminarEvaluacion(id);
    _cargarDatosAdmin();
    VocaUI.showToast('Evaluación eliminada');
  }

  function nuevaEvaluacion() {
    // Resetear estado completo
    estado.usuario    = { nombre:'', apellido:'', edad:null, grado:'', genero:'', region:'', institucion:'' };
    estado.evaluacion = { items:[], indiceActual:0, respuestas:{}, iniciadaEn:null, completada:false };
    estado.resultado  = null;
    DB.limpiarSesion();

    // Limpiar DOM de formularios para que no queden datos visibles
    VocaUI.limpiarFormularios();

    irA(PANTALLAS.LANDING);
  }

  /* ============================================================
     SESIÓN PERSISTENTE
  ============================================================ */
  function _guardarSesionActual() {
    DB.guardarSesion({
      pantallaActual: estado.pantallaActual,
      usuario: estado.usuario,
      evaluacion: {
        indiceActual: estado.evaluacion.indiceActual,
        respuestas: estado.evaluacion.respuestas,
        iniciadaEn: estado.evaluacion.iniciadaEn,
        completada: estado.evaluacion.completada
      }
    });
  }

  function _restaurarSesion(sesion) {
    // Restaurar datos del usuario si existen
    if (sesion.usuario) estado.usuario = sesion.usuario;

    // Solo restaurar evaluación si estaba genuinamente en curso:
    // - tiene respuestas guardadas
    // - no estaba completada
    // - el índice es mayor a 0 (había avanzado)
    // Esto evita que una evaluación anterior "contamine" la nueva
    const ev = sesion.evaluacion;
    if (ev && !ev.completada && ev.indiceActual > 0 &&
        ev.respuestas && Object.keys(ev.respuestas).length > 0) {
      const items = VocaEngine.mezclarItems();
      estado.evaluacion = {
        items,
        indiceActual: ev.indiceActual,
        respuestas:   ev.respuestas,
        iniciadaEn:   ev.iniciadaEn,
        completada:   false
      };
      // Solo volver a P4 si venía de allí con progreso real
      if (sesion.pantallaActual === 4) {
        estado.pantallaActual = 4;
      }
    }
  }

  /* ============================================================
     LISTENERS GLOBALES
  ============================================================ */
  function _registrarListeners() {
    // Detectar navegación con hash (para links compartidos)
    window.addEventListener('hashchange', _manejarHash);
    if (window.location.hash) _manejarHash();
  }

  function _manejarHash() {
    const hash = window.location.hash;
    const match = hash.match(/#resultado\/(.+)/);
    if (match) {
      const evaluacion = DB.obtenerEvaluacion(match[1]);
      if (evaluacion) {
        estado.resultado = evaluacion.resultado;
        estado.usuario = evaluacion.usuario;
        irA(PANTALLAS.RESULTADOS);
      }
    }
  }

  /* ============================================================
     GETTERS DE ESTADO (para que ui.js acceda sin mutar)
  ============================================================ */
  function getEstado()    { return { ...estado }; }
  function getUsuario()   { return { ...estado.usuario }; }
  function getResultado() { return estado.resultado; }
  function getEvaluacion(){ return { ...estado.evaluacion }; }

  /* ============================================================
     API PÚBLICA
  ============================================================ */
  const VERSION = '1.0.0';

  return {
    init,
    irA,
    volver,
    PANTALLAS,

    // Consentimiento
    verificarConsentimiento,

    // Registro
    actualizarUsuario,

    // Evaluación
    registrarRespuesta,
    siguientePregunta,
    preguntaAnterior,
    getPreguntaActual,
    tieneRespuestaActual,

    // Compartir
    generarEnlaceCompartir,
    copiarEnlace,
    simularDescarga,

    // Admin
    filtrarEvaluaciones,
    eliminarEvaluacion,
    nuevaEvaluacion,

    // Getters
    getEstado,
    getUsuario,
    getResultado,
    getEvaluacion,

    VERSION
  };

})();
