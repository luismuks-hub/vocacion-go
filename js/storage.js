/**
 * VocaTest — storage.js
 * Capa de persistencia con Repository Pattern.
 *
 * FASE 1 (actual): LocalStorageRepository — sin servidor
 * FASE 2 (futura): ApiRepository — PostgreSQL via REST API
 *
 * Para migrar a Fase 2, SOLO cambia esta línea al final:
 *   const DB = new LocalStorageRepository()
 *   → const DB = new ApiRepository('https://tu-servidor.com/api')
 *
 * El resto del sistema (app.js, engine.js, ui.js) NO cambia.
 */

/* ============================================================
   INTERFAZ BASE — Define el contrato que NUNCA cambia
   Ambas implementaciones deben respetar estos métodos.
============================================================ */
class StorageRepository {
  guardarEvaluacion(evaluacion)       { throw new Error('No implementado'); }
  obtenerEvaluacion(id)               { throw new Error('No implementado'); }
  listarEvaluaciones()                { throw new Error('No implementado'); }
  eliminarEvaluacion(id)              { throw new Error('No implementado'); }
  guardarSesion(datos)                { throw new Error('No implementado'); }
  obtenerSesion()                     { throw new Error('No implementado'); }
  limpiarSesion()                     { throw new Error('No implementado'); }
  limpiarTodo()                       { throw new Error('No implementado'); }
}

/* ============================================================
   FASE 1 — LocalStorageRepository
   Todo vive en el navegador. Sin servidor. Portable.
============================================================ */
class LocalStorageRepository extends StorageRepository {

  constructor() {
    super();
    this._keys = {
      evaluaciones: 'vocatest_evaluaciones',
      sesion:       'vocatest_sesion_actual',
      config:       'vocatest_config'
    };
  }

  // ── Evaluaciones ────────────────────────────────────────

  guardarEvaluacion(evaluacion) {
    const lista = this._leerJSON(this._keys.evaluaciones, []);
    const nueva = {
      id:            this._generarId(),
      fechaCreacion: new Date().toISOString(),
      ...evaluacion
    };
    lista.push(nueva);
    this._escribirJSON(this._keys.evaluaciones, lista);
    return nueva;
  }

  obtenerEvaluacion(id) {
    const lista = this._leerJSON(this._keys.evaluaciones, []);
    return lista.find(e => e.id === id) || null;
  }

  listarEvaluaciones() {
    const lista = this._leerJSON(this._keys.evaluaciones, []);
    return lista.sort((a, b) =>
      new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
    );
  }

  eliminarEvaluacion(id) {
    const lista = this._leerJSON(this._keys.evaluaciones, []);
    const filtrada = lista.filter(e => e.id !== id);
    this._escribirJSON(this._keys.evaluaciones, filtrada);
    return true;
  }

  // ── Sesión activa (evaluación en curso) ─────────────────

  guardarSesion(datos) {
    this._escribirJSON(this._keys.sesion, {
      ...datos,
      ultimaActualizacion: new Date().toISOString()
    });
  }

  obtenerSesion() {
    return this._leerJSON(this._keys.sesion, null);
  }

  limpiarSesion() {
    localStorage.removeItem(this._keys.sesion);
  }

  // ── Configuración ────────────────────────────────────────

  guardarConfig(config) {
    this._escribirJSON(this._keys.config, config);
  }

  obtenerConfig() {
    return this._leerJSON(this._keys.config, {
      ordenAleatorio:     false,  // Orden fijo según Excel (IT-001 a IT-056)
      avanceAutomatico:   false,   // El usuario avanza manualmente con Siguiente
      permitirRetroceder: true,
      retencionMeses:     12
    });
  }

  // ── Limpieza total ────────────────────────────────────────

  limpiarTodo() {
    Object.values(this._keys).forEach(k => localStorage.removeItem(k));
  }

  // ── Stats para el admin ───────────────────────────────────

  obtenerEstadisticas() {
    const lista = this.listarEvaluaciones();
    if (!lista.length) return this._statsVacias();

    const porCategoria = {};
    let tiempoTotal = 0;
    let conTiempo = 0;

    lista.forEach(ev => {
      const cat = ev.resultado?.categoria || 'INDETERMINADO';
      porCategoria[cat] = (porCategoria[cat] || 0) + 1;

      if (ev.duracionSegundos) {
        tiempoTotal += ev.duracionSegundos;
        conTiempo++;
      }
    });

    const regiones = [...new Set(lista.map(e => e.usuario?.region).filter(Boolean))];

    return {
      total:             lista.length,
      porCategoria,
      tiempoPromedioMin: conTiempo ? Math.round((tiempoTotal / conTiempo) / 60 * 10) / 10 : 0,
      tasaCompletitud:   Math.round((lista.filter(e => e.resultado).length / lista.length) * 100),
      regionesActivas:   regiones.length,
      regiones
    };
  }

  // ── Privados ──────────────────────────────────────────────

  _leerJSON(clave, porDefecto) {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? JSON.parse(raw) : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  _escribirJSON(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      console.error('VocaStorage: Error al escribir en localStorage', e);
    }
  }

  _generarId() {
    return 'ev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  _statsVacias() {
    return { total: 0, porCategoria: {}, tiempoPromedioMin: 0, tasaCompletitud: 0, regionesActivas: 0, regiones: [] };
  }
}

/* ============================================================
   FASE 2 — ApiRepository (esqueleto listo para implementar)
   Cuando llegue el momento, implementa los métodos
   con fetch() a tu API REST en Node.js + PostgreSQL.
   El resto del sistema NO cambia.
============================================================ */
class ApiRepository extends StorageRepository {

  constructor(baseUrl = '/api') {
    super();
    this._base = baseUrl;
  }

  async guardarEvaluacion(evaluacion) {
    return this._post('/evaluaciones', evaluacion);
  }

  async obtenerEvaluacion(id) {
    return this._get(`/evaluaciones/${id}`);
  }

  async listarEvaluaciones() {
    return this._get('/evaluaciones');
  }

  async eliminarEvaluacion(id) {
    return this._delete(`/evaluaciones/${id}`);
  }

  async guardarSesion(datos) {
    return this._post('/sesiones', datos);
  }

  async obtenerSesion() {
    return this._get('/sesiones/activa');
  }

  async limpiarSesion() {
    return this._delete('/sesiones/activa');
  }

  async limpiarTodo() {
    return this._delete('/datos');
  }

  async obtenerEstadisticas() {
    return this._get('/estadisticas');
  }

  // ── Helpers HTTP ──────────────────────────────────────────

  async _get(path) {
    const res = await fetch(this._base + path);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  }

  async _post(path, body) {
    const res = await fetch(this._base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  }

  async _delete(path) {
    const res = await fetch(this._base + path, { method: 'DELETE' });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  }
}

/* ============================================================
   CONFIGURACIÓN ACTIVA
   ─────────────────────────────────────────────────────────
   FASE 1 → FASE 2: solo cambia esta línea.
   Nada más en el sistema necesita modificarse.
============================================================ */
const DB = new LocalStorageRepository();
// const DB = new ApiRepository('https://tu-servidor.com/api');  // ← Fase 2
