/**
 * Vocación GO — export.js v2.0
 * Exportación PDF y Excel via servidor Python local (offline).
 * El servidor genera los archivos con reportlab + openpyxl.
 * Iniciar con: iniciar.bat (Windows) o ./iniciar.sh (Mac/Linux)
 */
const VocaExport = (() => {

  // En producción (Render) usa la misma URL del sitio
  // En local usa localhost:8000
  const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api'
    : window.location.origin + '/api';

  // ── Construir payload completo para el servidor ──────────
  function _buildPayload(evaluacion) {
    const items = VocaData.getItems().map(i => ({
      id: i.id, dim: i.dim, texto: i.texto,
      holland: i.holland, kuder: i.kuder
    }));
    return {
      usuario:           evaluacion.usuario   || {},
      resultado:         evaluacion.resultado || {},
      respuestas:        evaluacion.respuestas || {},
      items,
      todasEvaluaciones: DB.listarEvaluaciones()
    };
  }

  // ── Obtener evaluación actual ────────────────────────────
  function _getEvaluacionActual() {
    const r = VocaApp.getResultado();
    const e = VocaApp.getEstado();
    if (!r) return null;

    const guardada = DB.listarEvaluaciones().find(ev =>
      ev.usuario?.nombre   === e.usuario.nombre &&
      ev.usuario?.apellido === e.usuario.apellido
    );
    return guardada || {
      usuario:       e.usuario,
      resultado:     r,
      respuestas:    e.evaluacion.respuestas,
      fechaCreacion: new Date().toISOString()
    };
  }

  // ── Llamada al servidor y descarga ──────────────────────
  async function _exportar(endpoint, nombreArchivo, evaluacion) {
    const payload = _buildPayload(evaluacion);

    const resp = await fetch(API + endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => 'Error desconocido');
      throw new Error(msg);
    }

    // Disparar descarga del archivo recibido
    const blob   = await resp.blob();
    const url    = URL.createObjectURL(blob);
    const link   = document.createElement('a');
    link.href     = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ── Nombre de archivo con nombre del evaluado ────────────
  function _nombre(u, ext) {
    const n = `${u?.nombre||'usuario'}_${u?.apellido||''}`.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'');
    return `VocacionGO_${n}.${ext}`;
  }

  // ── API pública ──────────────────────────────────────────
  async function descargarPDF() {
    const ev = _getEvaluacionActual();
    if (!ev) { VocaUI.showToast('⚠️ Completa el test primero'); return; }

    VocaUI.showToast('📄 Generando PDF...');
    try {
      await _exportar('/pdf', _nombre(ev.usuario, 'pdf'), ev);
      VocaUI.showToast('✓ PDF descargado correctamente');
    } catch (err) {
      console.error('Error PDF:', err);
      if (err.message?.includes('fetch') || err.message?.includes('Failed')) {
        VocaUI.showToast('⚠️ Inicia el servidor: doble clic en iniciar.bat');
      } else {
        VocaUI.showToast('⚠️ Error al generar PDF: ' + err.message);
      }
    }
  }

  async function descargarExcel() {
    const ev = _getEvaluacionActual();
    if (!ev) { VocaUI.showToast('⚠️ Completa el test primero'); return; }

    VocaUI.showToast('📊 Generando Excel...');
    try {
      await _exportar('/excel', _nombre(ev.usuario, 'xlsx'), ev);
      VocaUI.showToast('✓ Excel descargado correctamente');
    } catch (err) {
      console.error('Error Excel:', err);
      if (err.message?.includes('fetch') || err.message?.includes('Failed')) {
        VocaUI.showToast('⚠️ Inicia el servidor: doble clic en iniciar.bat');
      } else {
        VocaUI.showToast('⚠️ Error al generar Excel: ' + err.message);
      }
    }
  }

  async function descargarExcelAdmin() {
    const todas = DB.listarEvaluaciones();
    if (!todas.length) { VocaUI.showToast('⚠️ No hay evaluaciones guardadas'); return; }

    VocaUI.showToast(`📊 Exportando ${todas.length} evaluación(es)...`);
    try {
      // Endpoint especial /excel/todas que recibe array completo
      await _exportarTodas(todas);
      VocaUI.showToast(`✓ Excel exportado — ${todas.length} evaluación(es)`);
    } catch (err) {
      console.error('Error Excel Admin:', err);
      if (err.message?.includes('fetch') || err.message?.includes('Failed') || err.name === 'TypeError') {
        VocaUI.showToast('⚠️ Inicia el servidor: doble clic en iniciar.bat');
      } else {
        VocaUI.showToast('⚠️ Error: ' + err.message);
      }
    }
  }

  // Exportar TODAS las evaluaciones en un solo Excel
  async function _exportarTodas(todas) {
    const items = VocaData.getItems().map(i => ({
      id: i.id, dim: i.dim, texto: i.texto, holland: i.holland, kuder: i.kuder
    }));
    const payload = { todasEvaluaciones: todas, items };

    const resp = await fetch(API + '/excel/todas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => 'Error desconocido');
      throw new Error(msg);
    }

    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `VocacionGO_Todas_${todas.length}evaluaciones.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return { descargarPDF, descargarExcel, descargarExcelAdmin, VERSION: '2.0.0' };

})();
