/**
 * VocaTest — ui.js
 * Capa de presentación. Solo manipula el DOM.
 * No contiene lógica de negocio ni accede a storage.
 * Depende de: data.js (para etiquetas), app.js (para acciones)
 */

const VocaUI = (() => {

  /* ============================================================
     RENDERIZADO PRINCIPAL — switch de pantallas
  ============================================================ */
  function renderPantalla(numero, estado) {
    const app = document.getElementById('app');
    if (!app) return;

    // Actualizar indicador de pantalla
    const ind = document.getElementById('screen-indicator');
    if (ind) ind.textContent = `Pantalla ${numero} / 9`;

    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Activar la pantalla objetivo
    const pantalla = document.getElementById(`s${numero}`);
    if (pantalla) {
      pantalla.classList.add('active');
    }

    // Acciones post-render por pantalla
    switch (numero) {
      case 4: _postRenderEvaluacion(estado); break;
      case 5: _postRenderProcesando();       break;
      case 6: _postRenderResultados(estado); break;
      case 8: _postRenderCompartir(estado);  break;
      case 9: /* renderAdmin se llama desde app.js */ break;
    }
  }

  /* ============================================================
     PANTALLA 4 — EVALUACIÓN
  ============================================================ */
  function renderPregunta(item, indice, total, respuestas, dimAnterior) {
    if (!item) return;

    const dim = VocaData.getDimension(item.dim);

    // Número y texto de pregunta
    _setText('q-num',  `Pregunta ${indice + 1}`);
    _setText('q-text', item.texto);

    // Badge de dimensión
    const badge = document.getElementById('dim-badge');
    if (badge && dim) {
      badge.style.background = dim.colorFondo;
      badge.style.color      = dim.colorTexto;
      _setText('dim-ico',  dim.icono);
      _setText('dim-name', dim.nombreCorto);
    }

    // Barra de progreso
    const pct = Math.max(2, Math.round(((indice + 1) / total) * 100));
    _setStyle('prog-fill', 'width', `${pct}%`);
    _setText('prog-txt', `Pregunta ${indice + 1} de ${total}`);

    // Reconstruir el bloque Likert desde cero para esta pregunta.
    // Esto evita que el navegador mantenga el estado visual del radio
    // anterior aunque se haga checked=false por código.
    const respPrevia = respuestas[item.id] || null;
    _reconstruirLikert(item.id, respPrevia);

    // Estado del botón siguiente
    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
      btnNext.classList.toggle('ready', !!respPrevia);
      btnNext.classList.remove('pulse');
    }

    // Mensaje de selección
    actualizarMensajeSeleccion(respPrevia);

    // Botón anterior
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) btnPrev.style.opacity = indice === 0 ? '0.35' : '1';

    // Tip rotativo
    _setText('tip-text', _getTip(indice));

    // Dots de progreso
    _renderDots(indice, total);
  }

  // Reconstruye el HTML del bloque Likert completamente.
  // Al reemplazar el innerHTML los inputs son nuevos — sin estado previo.
  function _reconstruirLikert(itemId, valorMarcado) {
    const contenedor = document.getElementById('likert-opts');
    if (!contenedor) return;

    const etiquetas = ['', 'Totalmente en desacuerdo', 'En desacuerdo',
                       'Indiferente', 'De acuerdo', 'Totalmente de acuerdo'];

    contenedor.innerHTML = [1, 2, 3, 4, 5].map(v => {
      const checked = valorMarcado === v ? 'checked' : '';
      return `
        <label class="l-opt" data-v="${v}">
          <input type="radio" name="resp" value="${v}" ${checked}
                 onchange="VocaApp.registrarRespuesta(${v})"
                 aria-label="${etiquetas[v]}">
          <div class="l-circle">${v}</div>
          <div class="l-dot"></div>
        </label>`;
    }).join('');
  }

  function actualizarSeleccion(valor, itemId) {
    actualizarMensajeSeleccion(valor);

    const btnNext = document.getElementById('btn-next');
    if (!btnNext) return;

    const yaEstabaReady = btnNext.classList.contains('ready');
    btnNext.classList.add('ready');

    // Pulsar el botón para llamar la atención del usuario
    if (!yaEstabaReady) {
      btnNext.classList.remove('pulse');
      void btnNext.offsetWidth; // reflow para reiniciar animación
      btnNext.classList.add('pulse');
      setTimeout(() => btnNext.classList.remove('pulse'), 500);
    }
  }

  function actualizarMensajeSeleccion(valor) {
    const msg = document.getElementById('sel-msg');
    if (!msg) return;

    if (valor) {
      const escala = VocaData.getEscala();
      const etiqueta = escala.find(e => e.valor === valor)?.etiqueta || '';
      msg.textContent = `✓ Seleccionaste: ${etiqueta}`;
      msg.className = 'sel-msg ok';
    } else {
      msg.textContent = 'Selecciona una opción para continuar';
      msg.className = 'sel-msg';
    }
  }

  function _postRenderEvaluacion(estado) {
    const ev = estado.evaluacion;
    if (!ev.items || !ev.items.length) return;

    // renderPregunta reconstruye el Likert desde cero — no hace falta limpiar antes
    renderPregunta(
      ev.items[ev.indiceActual],
      ev.indiceActual,
      ev.items.length,
      ev.respuestas,
      null
    );
  }

  function _renderDots(indiceActual, total) {
    const row = document.getElementById('dots-row');
    if (!row) return;

    row.innerHTML = '';
    const visible = Math.min(total, 12);

    for (let i = 0; i < visible; i++) {
      const d = document.createElement('div');
      d.className = 'dot-q' +
        (i < indiceActual ? ' done' : '') +
        (i === indiceActual ? ' cur' : '');
      row.appendChild(d);
    }
  }

  function _getTip(indice) {
    const tips = [
      'No hay respuestas correctas ni incorrectas. Responde con sinceridad.',
      'Piensa en cómo eres realmente, no en cómo quisieras ser.',
      'Si dudas, elige lo que sientes en tu día a día.',
      '¡Vas bien! Cada respuesta nos ayuda a conocerte mejor.',
      'Recuerda: esto es sobre TI. No hay respuesta buena o mala.',
      '¡A más de la mitad! Sigue así.',
      'Ya falta poco. Tómate tu tiempo.',
    ];
    return tips[indice % tips.length];
  }

  /* ============================================================
     PANTALLA 5 — PROCESANDO
  ============================================================ */
  function _postRenderProcesando() {
    // Reiniciar animación cada vez que se entra a esta pantalla
    const fill = document.getElementById('ov-fill');
    const lbl  = document.getElementById('ov-pct');
    const ready = document.getElementById('ready5');
    const stepsList = document.getElementById('steps5');

    if (fill)  fill.style.width = '0%';
    if (lbl)   lbl.textContent = '0%';
    if (ready) ready.style.display = 'none';
    if (stepsList) stepsList.style.display = 'flex';

    _setText('p5-title', 'Analizando tu perfil...');
    _setText('p5-sub',   'Estamos procesando tus 56 respuestas para encontrar tu vocación ideal. ¡Ya casi!');

    // Resetear steps
    for (let i = 0; i <= 5; i++) {
      const el = document.getElementById(`ss${i}`);
      if (el) el.classList.remove('s-done', 's-active');
    }

    // Iniciar animación de pasos
    setTimeout(() => _animarPasos(0), 600);
  }

  function _animarPasos(idx) {
    const pasos = [
      { id: 'ss0', pct: 16,  msg: 'Revisando tus 56 respuestas...' },
      { id: 'ss1', pct: 33,  msg: 'Sumando puntajes por dimensión...' },
      { id: 'ss2', pct: 50,  msg: 'Normalizando a escala 0-100...' },
      { id: 'ss3', pct: 67,  msg: 'Evaluando reglas de clasificación...' },
      { id: 'ss4', pct: 83,  msg: 'Identificando carreras para ti...' },
      { id: 'ss5', pct: 100, msg: '¡Armando tu perfil vocacional!' },
    ];

    if (idx >= pasos.length) {
      _mostrarResultadoListo();
      return;
    }

    // Marcar paso anterior como done
    if (idx > 0) {
      const prev = document.getElementById(pasos[idx - 1].id);
      if (prev) { prev.classList.remove('s-active'); prev.classList.add('s-done'); }
    }

    // Activar paso actual
    const el = document.getElementById(pasos[idx].id);
    if (el) el.classList.add('s-active');

    _setText('fun-msg5', pasos[idx].msg);
    _animarPorcentaje(pasos[idx].pct, 700, () => {
      setTimeout(() => _animarPasos(idx + 1), 400);
    });
  }

  function _animarPorcentaje(target, duracion, cb) {
    const fill = document.getElementById('ov-fill');
    const lbl  = document.getElementById('ov-pct');
    if (!fill || !lbl) { if (cb) cb(); return; }

    const start = parseInt(fill.style.width) || 0;
    const t0 = performance.now();

    function tick(now) {
      const p = Math.min((now - t0) / duracion, 1);
      const val = Math.round(start + (target - start) * p);
      fill.style.width = val + '%';
      lbl.textContent  = val + '%';
      if (p < 1) requestAnimationFrame(tick);
      else if (cb) cb();
    }
    requestAnimationFrame(tick);
  }

  function _mostrarResultadoListo() {
    // Marcar último paso
    const ss5 = document.getElementById('ss5');
    if (ss5) { ss5.classList.remove('s-active'); ss5.classList.add('s-done'); }

    _setText('p5-title', '¡Análisis completado!');
    _setText('p5-sub',   'Hemos procesado tus respuestas y construido tu perfil vocacional personalizado.');
    _setText('fun-msg5', '🎉 ¡Tu perfil vocacional está listo!');

    const stepsList = document.getElementById('steps5');
    if (stepsList) stepsList.style.display = 'none';

    const ovBar = document.querySelector('#s5 .ov-bar');
    if (ovBar) ovBar.style.display = 'none';

    const ready = document.getElementById('ready5');
    if (ready) ready.style.display = 'flex';
  }

  /* ============================================================
     PANTALLA 6 — RESULTADOS
  ============================================================ */
  function _postRenderResultados(estado) {
    const r = estado.resultado;
    if (!r) return;

    const u = estado.usuario;

    // Saludo personalizado
    _setText('p6-saludo', `¡Hola, ${u.nombre}! Aquí están tus resultados`);

    // Categoría recomendada
    const catEl = document.getElementById('result-cat');
    if (catEl) {
      catEl.style.background = r.categoriaFondo;
      catEl.style.color = r.categoriaColor;
      catEl.innerHTML = `${r.categoriaIcono} ${r.categoriaLabel}`;
    }

    // Confianza
    _setText('conf-label', r.confianza);

    // Mensaje del resultado
    _setText('p6-mensaje', r.mensaje);

    // Radar chart
    _renderRadar(r.puntajesNorm);

    // Tarjetas de dimensiones
    _renderDimsCards(r.nivelesDims);

    // Carreras recomendadas
    _renderCarrerasResumen(r.carrerasRecomendadas);
  }

  function _renderCarrerasResumen(subcategorias) {
    var container = document.getElementById('carreras-resumen');
    if (!container) return;
    if (!subcategorias || !subcategorias.length) {
      container.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:12px">No hay carreras disponibles.</p>';
      return;
    }
    var CAT_COLOR = {
      'UNIVERSITARIA':'#A855F7','UNIVERSITARIA_SOCIAL':'#A855F7',
      'UNIVERSITARIA_CIENCIAS':'#00C8FF','UNIVERSITARIA_TECNICA':'#A855F7',
      'TECNICA':'#22C55E','FUERZAS_ARMADAS':'#F59E0B','POLICIAL':'#EC4899',
      'MULTIPLE':'#6B7280','INDETERMINADO':'#6B7280','DEFAULT':'#6B7280'
    };
    var html = '';
    subcategorias.forEach(function(sc, idx) {
      var color = CAT_COLOR[sc.categoria] || '#A855F7';
      var detailId = 'sc-detail-p6-' + idx;
      var isFirst = idx === 0;
      var carrerasHtml = (sc.carreras || []).map(function(c) {
        return '<span style="font-size:11px;padding:3px 9px;background:rgba(255,255,255,0.06);color:var(--text-2);border-radius:6px;border:1px solid var(--border)">' + c + '</span>';
      }).join('');
      var sueldoHtml = sc.sueldoJunior
        ? '<div style="font-size:11px;color:var(--text-2);margin-bottom:8px">Junior: <span style="color:#44FF88;font-weight:700">' + sc.sueldoJunior + '</span></div>'
        : '';
      html += '<div style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:8px">';
      html += '<div onclick="toggleSubcatP6(\'' + detailId + '\',this)" style="display:flex;align-items:center;gap:8px;padding:10px 13px;background:rgba(255,255,255,0.04);cursor:pointer">';
      html += '<span style="font-size:18px">' + (sc.icono||'') + '</span>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-family:var(--font-display);font-size:13px;font-weight:900;color:' + color + '">' + (sc.subcategoria||'') + '</div>';
      html += '<div style="font-size:10px;color:var(--text-3)">' + (sc.carreras||[]).length + ' carrera(s) \xb7 Afinidad ' + sc.afinidad + '%</div>';
      html += '</div>';
      html += '<span style="font-family:var(--font-display);font-size:12px;font-weight:900;color:var(--lime)">' + sc.afinidad + '%</span>';
      html += '<span class="subcat-caret" style="font-size:10px;color:var(--text-3);margin-left:4px">' + (isFirst ? '\u25b2' : '\u25bc') + '</span>';
      html += '</div>';
      html += '<div id="' + detailId + '" style="display:' + (isFirst ? 'block' : 'none') + ';padding:10px 13px;border-top:1px solid rgba(255,255,255,0.06);background:var(--bg-card2)">';
      html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">' + carrerasHtml + '</div>';
      html += sueldoHtml;
      html += '<button onclick="VocaApp.irA(7)" style="width:100%;padding:9px;background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;border:none;border-radius:var(--radius);font-family:var(--font-display);font-size:12px;font-weight:900;cursor:pointer">Ver detalle \u203a</button>';
      html += '</div></div>';
    });
    container.innerHTML = html;
  }

  function _renderRadar(puntajesNorm) {
    const canvas = document.getElementById('radar6');
    if (!canvas || typeof Chart === 'undefined') return;

    // Destruir chart previo si existe
    const prevChart = Chart.getChart(canvas);
    if (prevChart) prevChart.destroy();

    const dims = VocaData.getDimensiones();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    const labelColor = isDark ? '#9CA3AF' : '#6B7280';

    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: dims.map(d => d.icono + ' ' + d.nombreCorto),
        datasets: [{
          label: 'Tu perfil',
          data: dims.map(d => puntajesNorm[d.id] || 0),
          backgroundColor: 'rgba(124,58,237,0.15)',
          borderColor: '#7C3AED',
          borderWidth: 2,
          pointBackgroundColor: dims.map(d => d.color),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 1100, easing: 'easeInOutQuart' },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { stepSize: 20, display: false },
            grid: { color: gridColor, lineWidth: 0.8 },
            angleLines: { color: gridColor, lineWidth: 0.8 },
            pointLabels: {
              font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
              color: labelColor
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` Puntaje: ${ctx.raw} / 100` }
          }
        }
      }
    });
  }

  function _renderDimsCards(nivelesDims) {
    const container = document.getElementById('dims6');
    if (!container) return;

    container.innerHTML = '';
    Object.entries(nivelesDims).forEach(([dimId, data]) => {
      container.innerHTML += `
        <div class="dim-card">
          <div class="dim-card-top">
            <span class="dim-card-name">${data.iconoDim} ${data.nombreCorto}</span>
            <span class="dim-card-score" style="color:${data.colorDim}">${data.puntaje}</span>
          </div>
          <div class="dim-bar-track">
            <div class="dim-bar-fill" style="width:${data.puntaje}%;background:${data.colorDim}"></div>
          </div>
          <div class="dim-level" style="color:${data.color}">${data.nivel}</div>
        </div>`;
    });
  }

  function _renderCarrerasResumen(carreras) {
    const container = document.getElementById('carreras-resumen');
    if (!container) return;

    container.innerHTML = '';
    carreras.slice(0, 3).forEach(c => {
      container.innerHTML += `
        <div class="carrera-item" onclick="VocaApp.irA(7)">
          <div class="carrera-ico" style="background:#EDE9FE">${c.icono}</div>
          <div class="carrera-info">
            <div class="carrera-name">${c.nombre}</div>
            <div class="carrera-inst">${c.instituciones.slice(0, 4).join(' · ')}</div>
          </div>
          <div class="carrera-dur">${c.duracion} ›</div>
        </div>`;
    });
  }

  /* ============================================================
     PANTALLA 8 — COMPARTIR
  ============================================================ */
  function _postRenderCompartir(estado) {
    const r = estado.resultado;
    const u = estado.usuario;
    if (!r || !u) return;

    // Nombre en el reporte
    _setText('report-name', `${u.nombre} ${u.apellido}`);
    _setText('report-conf-text', `Nivel de confianza: ${r.confianza} · ${u.region}`);

    // Mini-barras del reporte
    const container = document.getElementById('rdims8');
    if (container) {
      container.innerHTML = '';
      VocaData.getDimensiones().forEach(dim => {
        const puntaje = r.puntajesNorm[dim.id] || 0;
        const h = Math.round((puntaje / 100) * 42);
        container.innerHTML += `
          <div class="rdim">
            <div class="rdim-bar-wrap">
              <div class="rdim-bar" style="height:${h}px;background:${dim.color}"></div>
            </div>
            <div class="rdim-score" style="color:${dim.color}">${puntaje}</div>
            <div class="rdim-name">${dim.nombreCorto}</div>
          </div>`;
      });
    }

    // Fecha
    _setText('rdate8', 'Evaluado el ' + new Date().toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    }));

    // Enlace
    const enlace = VocaApp.generarEnlaceCompartir();
    _setText('link-url-text', enlace || 'vocatest.local/resultado');
  }

  /* ============================================================
     PANTALLA 9 — ADMIN
  ============================================================ */
  function renderAdmin(evaluaciones, stats) {
    _renderMetricas(stats);
    _renderGraficaBarras(evaluaciones);
    _renderGraficaDonut(stats.porCategoria);
    renderListaEvaluaciones(evaluaciones);
  }

  function _renderMetricas(stats) {
    _setText('adm-total',       stats.total);
    _setText('adm-tiempo',      stats.tiempoPromedioMin + "'");
    _setText('adm-completitud', stats.tasaCompletitud + '%');
    _setText('adm-regiones',    stats.regionesActivas);
  }

  function _renderGraficaBarras(evaluaciones) {
    const canvas = document.getElementById('adm-bars-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const prevChart = Chart.getChart(canvas);
    if (prevChart) prevChart.destroy();

    // Agrupar por semana (últimas 6)
    const semanas = _agruparPorSemana(evaluaciones, 6);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: semanas.map(s => s.label),
        datasets: [{
          data: semanas.map(s => s.count),
          backgroundColor: '#7C3AED',
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function _renderGraficaDonut(porCategoria) {
    const canvas = document.getElementById('adm-donut');
    if (!canvas || typeof Chart === 'undefined') return;

    const prevChart = Chart.getChart(canvas);
    if (prevChart) prevChart.destroy();

    const etiquetas = VocaData.getEtiquetaCategoria;
    const cats = Object.entries(porCategoria).map(([cat, count]) => ({
      label: VocaData.getEtiquetaCategoria(cat).label,
      count,
      color: VocaData.getEtiquetaCategoria(cat).color
    }));

    // Leyenda
    const legend = document.getElementById('adm-legend');
    if (legend) {
      legend.innerHTML = cats.map(c => `
        <div class="leg-item">
          <div class="leg-dot" style="background:${c.color}"></div>
          ${c.label}
          <span class="leg-pct">${c.count}</span>
        </div>`).join('');
    }

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: cats.map(c => c.label),
        datasets: [{
          data: cats.map(c => c.count),
          backgroundColor: cats.map(c => c.color),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '72%',
        animation: { duration: 900 },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
        }
      }
    });
  }

  function renderListaEvaluaciones(evaluaciones) {
    const container = document.getElementById('eval-list9');
    if (!container) return;

    if (!evaluaciones.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-ico">📋</div><p>No hay evaluaciones registradas aún.</p></div>';
      return;
    }

    container.innerHTML = evaluaciones.map(ev => {
      const nombre = `${ev.usuario?.nombre || ''} ${ev.usuario?.apellido || ''}`.trim() || 'Sin nombre';
      const ini = nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
      const cat = ev.resultado?.categoria || 'INDETERMINADO';
      const etq = VocaData.getEtiquetaCategoria(cat);
      const meta = `${ev.usuario?.edad || '?'} años · ${ev.usuario?.region || 'Sin región'}`;
      const fecha = new Date(ev.fechaCreacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });

      return `
        <div class="eval-item2">
          <div class="eval-av" style="background:${etq.color}">${ini}</div>
          <div class="eval-inf">
            <div class="eval-name2">${nombre}</div>
            <div class="eval-meta2">${meta} · ${fecha}</div>
          </div>
          <span class="eval-badge2" style="background:${etq.fondo};color:${etq.color}">${etq.label}</span>
          <button onclick="VocaApp.eliminarEvaluacion('${ev.id}')" class="btn-del" title="Eliminar">✕</button>
        </div>`;
    }).join('');
  }

  /* ============================================================
     LIMPIEZA DE FORMULARIOS — para nueva evaluación
  ============================================================ */
  function limpiarFormularios() {
    // P2 — desmarcar checkboxes de consentimiento
    ['c1','c2','c3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    toggleBotonConsentimiento(false);

    // P3 — limpiar campos de registro
    ['f-nombre','f-apellido','f-edad'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['f-grado','f-region','f-inst'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    document.querySelectorAll('input[name="gen"]').forEach(r => r.checked = false);
    toggleBotonRegistro(false);

    // P4 — reconstruir Likert vacío y resetear estado visual
    _reconstruirLikert(null, null);
    const btnNext = document.getElementById('btn-next');
    if (btnNext) btnNext.classList.remove('ready', 'pulse');
    const selMsg = document.getElementById('sel-msg');
    if (selMsg) {
      selMsg.textContent = 'Selecciona una opción para continuar';
      selMsg.className = 'sel-msg';
    }
    const dotsRow = document.getElementById('dots-row');
    if (dotsRow) dotsRow.innerHTML = '';
  }

  /* ============================================================
     FORMULARIOS — toggles de botones
  ============================================================ */
  function toggleBotonConsentimiento(habilitado) {
    const btn = document.getElementById('btn-consent');
    if (btn) btn.classList.toggle('disabled', !habilitado);
  }

  function toggleBotonRegistro(habilitado) {
    const btn = document.getElementById('btn-reg');
    if (btn) btn.classList.toggle('disabled', !habilitado);
  }

  /* ============================================================
     TOAST GLOBAL
  ============================================================ */
  function showToast(mensaje, duracion = 2500) {
    const toast = document.getElementById('toast-main');
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duracion);
  }

  /* ============================================================
     UTILIDADES
  ============================================================ */
  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function _setText(id, texto) {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  }

  function _setStyle(id, prop, valor) {
    const el = document.getElementById(id);
    if (el) el.style[prop] = valor;
  }

  function _agruparPorSemana(evaluaciones, numSemanas) {
    const ahora = new Date();
    const semanas = [];

    for (let i = numSemanas - 1; i >= 0; i--) {
      const inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - (i + 1) * 7);
      const fin = new Date(ahora);
      fin.setDate(ahora.getDate() - i * 7);

      const count = evaluaciones.filter(ev => {
        const fecha = new Date(ev.fechaCreacion);
        return fecha >= inicio && fecha < fin;
      }).length;

      semanas.push({ label: `Sem ${numSemanas - i}`, count });
    }
    return semanas;
  }

  /* ============================================================
     API PÚBLICA
  ============================================================ */
  return {
    renderPantalla,
    renderPregunta,
    actualizarSeleccion,
    actualizarMensajeSeleccion,
    renderAdmin,
    renderListaEvaluaciones,
    toggleBotonConsentimiento,
    toggleBotonRegistro,
    limpiarFormularios,
    showToast,
    scrollTop,
    VERSION: '1.0.0'
  };

})();
