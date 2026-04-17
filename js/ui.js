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

  function _renderRadar(puntajesNorm) {
    // Usar VocaRadar (SVG puro, sin Chart.js) para funcionar 100% offline
    const dims = VocaData.getDimensiones();
    VocaRadar.dibujar('radar6', puntajesNorm, dims);
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

  function _renderCarrerasResumen(subcategorias) {
    const container = document.getElementById('carreras-resumen');
    if (!container) return;
    if (!subcategorias || !subcategorias.length) {
      container.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center;padding:12px">No hay carreras disponibles.</p>';
      return;
    }

    const CAT_COLOR = {
      UNIVERSITARIA:'#A855F7', UNIVERSITARIA_SOCIAL:'#A855F7',
      UNIVERSITARIA_CIENCIAS:'#00C8FF', UNIVERSITARIA_TECNICA:'#A855F7',
      TECNICA:'#22C55E', FUERZAS_ARMADAS:'#F59E0B', POLICIAL:'#EC4899',
      MULTIPLE:'#6B7280', INDETERMINADO:'#6B7280', DEFAULT:'#6B7280'
    };

    container.innerHTML = subcategorias.map((sc, idx) => {
      const color = CAT_COLOR[sc.categoria] || '#A855F7';
      const detailId = `sc-detail-p6-${idx}`;
      const carrerasStr = (sc.carreras || []).join(' · ');

      return `
        <div class="subcat-block-p6" style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:8px">
          <!-- Cabecera de subcategoría -->
          <div class="subcat-hdr-p6" onclick="toggleSubcatP6('${detailId}', this)"
            style="display:flex;align-items:center;gap:8px;padding:10px 13px;
              background:rgba(${_hexToRgb(color)},0.12);cursor:pointer">
            <span style="font-size:18px">${sc.icono}</span>
            <div style="flex:1;min-width:0">
              <div style="font-family:var(--font-display);font-size:13px;font-weight:900;color:${color}">${sc.subcategoria}</div>
              <div style="font-size:10px;color:var(--text-3);margin-top:1px">${(sc.carreras||[]).length} carrera${(sc.carreras||[]).length!==1?'s':''} · Afinidad ${sc.afinidad}%</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
              <span style="font-family:var(--font-display);font-size:12px;font-weight:900;color:var(--lime)">${sc.afinidad}%</span>
              <span class="subcat-caret" style="font-size:10px;color:var(--text-3);transition:transform .2s">${idx===0?'▲':'▼'}</span>
            </div>
          </div>
          <!-- Detalle expandible -->
          <div id="${detailId}" style="display:${idx===0?'block':'none'}">
            <div style="padding:10px 13px;border-top:1px solid rgba(255,255,255,0.06);background:var(--bg-card2)">
              <!-- Carreras listadas -->
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Carreras incluidas</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
                ${(sc.carreras||[]).map(c=>`<span style="font-size:11px;padding:3px 9px;background:rgba(${_hexToRgb(color)},0.12);color:${color};border-radius:6px;border:1px solid rgba(${_hexToRgb(color)},0.25)">${c}</span>`).join('')}
              </div>
              <!-- Barra de afinidad -->
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-3);margin-bottom:3px">
                  <span>Afinidad con tu perfil</span><span style="color:${color};font-weight:900">${sc.afinidad}%</span>
                </div>
                <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
                  <div style="height:4px;width:${sc.afinidad}%;background:${color};border-radius:2px"></div>
                </div>
              </div>
              ${sc.campoLaboral?.length?`
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Campo laboral</div>
              <div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px">
                ${sc.campoLaboral.map(cl=>`<span class="campo-tag">${cl}</span>`).join('')}
              </div>`:''}
              ${sc.sueldoJunior?`
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Sueldo referencial</div>
              <div style="font-size:11px;color:var(--text-2);line-height:1.8">
                <span style="color:var(--text-3)">Junior:</span> <span style="color:#44FF88;font-weight:700">${sc.sueldoJunior}</span><br>
                <span style="color:var(--text-3)">Senior:</span> <span style="color:var(--lime);font-weight:700">${sc.sueldoSenior}</span>
              </div>`:''}
              <button onclick="VocaApp.irA(7)" style="width:100%;margin-top:10px;padding:9px;background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;border:none;border-radius:var(--radius);font-family:var(--font-display);font-size:12px;font-weight:900;cursor:pointer">
                Ver detalle completo ›
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function _hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }


