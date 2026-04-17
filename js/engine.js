/**
 * VocaTest — engine.js
 * Motor de cálculo y clasificación vocacional.
 * Funciones puras: no toca el DOM ni el storage.
 * Depende de: data.js (VocaData)
 */

const VocaEngine = (() => {

  /* ============================================================
     PASO 1: Calcular puntaje bruto por dimensión
     Input:  respuestas = { 'IT-001': 4, 'IT-002': 3, ... }
     Output: { 'DIM-01': 38, 'DIM-02': 22, ... }
  ============================================================ */
  function calcularPuntajeBruto(respuestas) {
    const dimensiones = VocaData.getDimensiones();
    const puntajes = {};

    dimensiones.forEach(dim => {
      const itemsDim = VocaData.getItemsPorDimension(dim.id);
      let suma = 0;
      itemsDim.forEach(item => {
        const valor = respuestas[item.id] || 0;
        suma += valor;
      });
      puntajes[dim.id] = suma;
    });

    return puntajes;
  }

  /* ============================================================
     PASO 2: Normalizar a escala 0-100
     Fórmula: puntajeBruto × peso × (100 / maxPosible)
     maxPosible para DIM-01..04: 10 items × 5 = 50
     maxPosible para DIM-05..06: 8 items × 5 × 1.25 = 50 (normalizado)
     Input:  puntajesBrutos = { 'DIM-01': 38, ... }
     Output: { 'DIM-01': 76, 'DIM-02': 44, ... }
  ============================================================ */
  function normalizarPuntajes(puntajesBrutos) {
    const dimensiones = VocaData.getDimensiones();
    const puntajesNorm = {};

    dimensiones.forEach(dim => {
      const bruto = puntajesBrutos[dim.id] || 0;
      // maxPosible real: numItems × 5 (antes de aplicar peso)
      // El peso compensa el menor número de ítems para que el máximo
      // alcanzable sea siempre 100. Por eso se divide entre numItems*5
      // ANTES de multiplicar por peso: (bruto / (numItems×5)) × 100
      // Esto garantiza que responder todo 5 = 100, todo 1 = 20, todo 3 = 60
      const maxReal = dim.numItems * 5;
      const normalizado = (bruto / maxReal) * 100;
      puntajesNorm[dim.id] = Math.round(Math.min(100, Math.max(0, normalizado)));
    });

    return puntajesNorm;
  }

  /* ============================================================
     PASO 3: Clasificar perfil según reglas R-001..R-010
     Input:  puntajesNorm = { 'DIM-01': 76, ... }
     Output: { regla, categoria, confianza, mensaje }
  ============================================================ */
  function clasificarPerfil(puntajesNorm) {
    const reglas = VocaData.getReglas(); // ya ordenadas por prioridad

    for (const regla of reglas) {
      if (regla.evaluar(puntajesNorm)) {

        // R-010 DEFAULT: asignar categoría de dimensión dominante
        if (regla.id === 'R-010') {
          const dimDominante = getDimensionDominante(puntajesNorm);
          const mapeo = VocaData.getMapeoDefault();
          const categoria = mapeo[dimDominante] || 'INDETERMINADO';
          return {
            regla: regla.id,
            categoria,
            confianza: 'Básica',
            mensaje: regla.mensaje,
            dimDominante
          };
        }

        return {
          regla: regla.id,
          categoria: regla.categoria,
          confianza: regla.confianza,
          mensaje: regla.mensaje,
          dimDominante: getDimensionDominante(puntajesNorm)
        };
      }
    }

    // Fallback de seguridad (nunca debería llegar aquí por R-010)
    return {
      regla: 'R-010',
      categoria: 'INDETERMINADO',
      confianza: 'Baja',
      mensaje: 'No se pudo determinar un perfil claro.',
      dimDominante: null
    };
  }

  /* ============================================================
     PASO 4: Obtener detalle de nivel por dimensión
     Input:  puntajesNorm = { 'DIM-01': 76, ... }
     Output: { 'DIM-01': { puntaje: 76, nivel: 'Alto', color: '#22C55E', ... } }
  ============================================================ */
  function obtenerNivelesPorDimension(puntajesNorm) {
    const niveles = VocaData.getNiveles();
    const dimensiones = VocaData.getDimensiones();
    const resultado = {};

    dimensiones.forEach(dim => {
      const puntaje = puntajesNorm[dim.id] || 0;
      const nivel = niveles.find(n => puntaje >= n.rangoMin && puntaje <= n.rangoMax)
                    || niveles[niveles.length - 1];
      resultado[dim.id] = {
        puntaje,
        nivel: nivel.etiqueta,
        codigo: nivel.codigo,
        color: nivel.color,
        icono: nivel.icono,
        prioridad: nivel.prioridad,
        // Info de la dimensión
        nombre: dim.nombre,
        nombreCorto: dim.nombreCorto,
        colorDim: dim.color,
        colorFondo: dim.colorFondo,
        iconoDim: dim.icono
      };
    });

    return resultado;
  }

  /* ============================================================
     PASO 5: Obtener carreras recomendadas según categoría
     Input:  categoria = 'UNIVERSITARIA', puntajesNorm, limite
     Output: array de carreras ordenadas por afinidad calculada
  ============================================================ */
  function obtenerCarrerasRecomendadas(categoria, puntajesNorm, limite = 10) {
    // Obtener subcategorías válidas para esta categoría resultante
    const subcats = VocaData.getSubcatsPorCategoria(categoria);

    // Filtrar el catálogo según las subcategorías válidas
    let subcategorias = VocaData.getCatalogoPorSubcats(subcats);

    // Calcular afinidad de cada subcategoría según sus dims relevantes
    subcategorias = subcategorias.map(subcat => {
      const puntajesDims = subcat.dims.map(d => puntajesNorm[d] || 0);
      const afinidad = Math.round(
        puntajesDims.reduce((a, b) => a + b, 0) / puntajesDims.length
      );
      return { ...subcat, afinidad };
    });

    // Ordenar por afinidad descendente
    return subcategorias
      .sort((a, b) => b.afinidad - a.afinidad)
      .slice(0, limite);
  }

  /* ============================================================
     FUNCIÓN PRINCIPAL: Procesar evaluación completa
     Input:  respuestas = { 'IT-001': 4, 'IT-002': 3, ... }
     Output: objeto completo con todo el perfil vocacional
  ============================================================ */
  function procesarEvaluacion(respuestas) {
    // Validar que se respondieron todas las preguntas
    const totalItems = VocaData.getTotalItems();
    const totalRespondidas = Object.keys(respuestas).length;

    if (totalRespondidas < totalItems) {
      console.warn(`VocaEngine: Se esperaban ${totalItems} respuestas, se recibieron ${totalRespondidas}`);
    }

    // Pipeline de cálculo
    const puntajesBrutos   = calcularPuntajeBruto(respuestas);
    const puntajesNorm     = normalizarPuntajes(puntajesBrutos);
    const clasificacion    = clasificarPerfil(puntajesNorm);
    const nivelesDims      = obtenerNivelesPorDimension(puntajesNorm);
    const carrerasRec      = obtenerCarrerasRecomendadas(clasificacion.categoria, puntajesNorm);
    const etiqueta         = VocaData.getEtiquetaCategoria(clasificacion.categoria);

    return {
      // Metadata
      fechaProcesamiento: new Date().toISOString(),
      totalRespondidas,

      // Puntajes
      puntajesBrutos,
      puntajesNorm,

      // Clasificación
      reglaAplicada:  clasificacion.regla,
      categoria:      clasificacion.categoria,
      categoriaLabel: etiqueta.label,
      categoriaColor: etiqueta.color,
      categoriaFondo: etiqueta.fondo,
      categoriaIcono: etiqueta.icono,
      confianza:      clasificacion.confianza,
      mensaje:        clasificacion.mensaje,
      dimDominante:   clasificacion.dimDominante,

      // Detalle por dimensión
      nivelesDims,

      // Carreras recomendadas
      carrerasRecomendadas: carrerasRec
    };
  }

  /* ============================================================
     HELPERS INTERNOS
  ============================================================ */

  // Retorna el ID de la dimensión con mayor puntaje
  function getDimensionDominante(puntajesNorm) {
    return Object.entries(puntajesNorm)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
  }

  // Retorna nivel interpretativo para un puntaje dado
  function getNivelParaPuntaje(puntaje) {
    const niveles = VocaData.getNiveles();
    return niveles.find(n => puntaje >= n.rangoMin && puntaje <= n.rangoMax)
           || niveles[niveles.length - 1];
  }

  // Ordenar respuestas aleatoriamente (para el test)
  function mezclarItems() {
    const items = VocaData.getItems();
    const mezclados = [...items];
    for (let i = mezclados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }
    return mezclados;
  }

  /* ============================================================
     API PÚBLICA
  ============================================================ */
  return {
    procesarEvaluacion,
    calcularPuntajeBruto,
    normalizarPuntajes,
    clasificarPerfil,
    obtenerNivelesPorDimension,
    obtenerCarrerasRecomendadas,
    getNivelParaPuntaje,
    mezclarItems,
    VERSION: '1.0.0'
  };

})();
