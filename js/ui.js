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

  function _renderCarrerasResumen(carreras) {
    const container = document.getElementById('carreras-resumen');
    if (!container) return;

    container.innerHTML = '';
    carreras.slice(0, 3).forEach((c, idx) => {
      const cardId = `carrera-card-p6-${idx}`;
      const detailId = `carrera-detail-p6-${idx}`;

      // Colores por categoría
      const catColor = {
        UNIVERSITARIA:'#A855F7', UNIVERSITARIA_SOCIAL:'#A855F7',
        UNIVERSITARIA_CIENCIAS:'#00C8FF', UNIVERSITARIA_TECNICA:'#A855F7',
        TECNICA:'#22C55E', FUERZAS_ARMADAS:'#FF6B00', POLICIAL:'#FF0099'
      }[c.categoria] || '#A855F7';

      container.innerHTML += `
        <div id="${cardId}" class="carrera-item-expandible">
          <!-- Cabecera siempre visible -->
          <div class="carrera-item-hdr" onclick="toggleCarreraP6('${detailId}', '${cardId}')">
            <div class="carrera-ico" style="background:rgba(139,0,255,0.15);border:1px solid rgba(139,0,255,0.3)">${c.icono}</div>
            <div class="carrera-info">
              <div class="carrera-name">${c.nombre}</div>
              <div class="carrera-inst">${(c.instituciones||[]).slice(0,3).join(' · ')}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0">
              <span style="font-size:12px;color:var(--lime);font-weight:900;font-family:var(--font-display)">${c.afinidad}%</span>
              <span style="font-size:10px;color:var(--text-3)">${c.duracion}</span>
              <span class="expand-arrow" id="arr-${detailId}" style="font-size:11px;color:var(--text-3);transition:transform .2s">▼</span>
            </div>
          </div>

          <!-- Detalle expandible -->
          <div id="${detailId}" class="carrera-detalle" style="display:none">
            <div style="height:1px;background:var(--border);margin:8px 0"></div>

            <!-- Barra de afinidad -->
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-2);margin-bottom:4px">
                <span>Afinidad con tu perfil</span>
                <span style="color:${catColor};font-weight:900">${c.afinidad}%</span>
              </div>
              <div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
                <div style="height:5px;width:${c.afinidad}%;background:${catColor};border-radius:3px"></div>
              </div>
            </div>

            ${c.descripcion ? `
            <p style="font-size:12px;color:var(--text-2);line-height:1.6;margin-bottom:10px">${c.descripcion}</p>` : ''}

            <!-- Campo laboral -->
            ${c.campoLaboral?.length ? `
            <div class="det-bloque" style="border-left:3px solid var(--blue)">
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">🏢 Campo laboral</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${c.campoLaboral.map(cl=>`<span class="campo-tag">${cl}</span>`).join('')}
              </div>
            </div>` : ''}

            <!-- Especializaciones -->
            ${c.especializaciones?.length ? `
            <div class="det-bloque" style="border-left:3px solid var(--purple-mid)">
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">🎯 Especializaciones</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${c.especializaciones.map(e=>`<span class="campo-tag" style="background:var(--purple-bg);color:var(--purple-mid)">${e}</span>`).join('')}
              </div>
            </div>` : ''}

            <!-- Sueldo -->
            ${c.sueldoJunior ? `
            <div class="det-bloque" style="border-left:3px solid #44FF88">
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">💰 Sueldo referencial</div>
              <div style="font-size:12px;color:var(--text-2);line-height:1.8">
                <span style="color:var(--text-3)">Junior:</span> <span style="color:#44FF88;font-weight:700">${c.sueldoJunior}</span><br>
                <span style="color:var(--text-3)">Senior:</span> <span style="color:var(--lime);font-weight:700">${c.sueldoSenior||''}</span>
              </div>
            </div>` : ''}

            <!-- Instituciones -->
            ${c.instituciones?.length ? `
            <div class="det-bloque" style="border-left:3px solid var(--orange)">
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">🎓 Instituciones en Perú</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${c.instituciones.map(i=>`<span class="inst-pill">${i}</span>`).join('')}
              </div>
            </div>` : ''}

            <!-- Costos -->
            ${c.costoNacional ? `
            <div class="det-bloque" style="border-left:3px solid var(--pink)">
              <div style="font-size:10px;font-weight:900;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">💳 Costos</div>
              <div style="font-size:11px;color:var(--text-2);line-height:1.8">
                <span style="color:var(--pink);font-weight:700">Nacional:</span> ${c.costoNacional}<br>
                <span style="color:var(--pink);font-weight:700">Privada:</span> ${c.costoPrivada||''}
              </div>
            </div>` : ''}

            <button onclick="VocaApp.irA(7)" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;border:none;border-radius:var(--radius);font-family:var(--font-display);font-size:13px;font-weight:900;cursor:pointer">
              Ver todas las carreras ›
            </button>
          </div>
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
    const cont = document.getElementById('adm-bars-chart');
    if (!cont) return;
    const semanas = _agruparPorSemana(evaluaciones, 6);
    const max = Math.max(...semanas.map(s => s.count), 1);
    const H = 110, barW = 28, gap = 12, padL = 28, padB = 22;
    const totalW = semanas.length * (barW + gap) - gap + padL + 16;

    const ns = 'http://www.w3.org/2000/svg';
    let old = cont.querySelector('svg');
    if (old) old.remove();

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${totalW} ${H + padB}`);
    svg.setAttribute('width', '100%');

    // Líneas de referencia
    [0, 0.5, 1].forEach(frac => {
      const y = H - frac * H;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', padL); line.setAttribute('x2', totalW - 8);
      line.setAttribute('y1', y);    line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(255,255,255,0.08)'); line.setAttribute('stroke-width','1');
      svg.appendChild(line);
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', padL - 4); t.setAttribute('y', y + 4);
      t.setAttribute('text-anchor','end'); t.setAttribute('fill','rgba(255,255,255,0.35)');
      t.setAttribute('font-size','8'); t.setAttribute('font-family','Nunito,sans-serif');
      t.textContent = Math.round(frac * max);
      svg.appendChild(t);
    });

    semanas.forEach((s, i) => {
      const x = padL + i * (barW + gap);
      const bH = max > 0 ? Math.max(2, (s.count / max) * H) : 2;
      const by = H - bH;

      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', x); rect.setAttribute('y', by);
      rect.setAttribute('width', barW); rect.setAttribute('height', bH);
      rect.setAttribute('rx', '4'); rect.setAttribute('fill', '#8B00FF');
      svg.appendChild(rect);

      const val = document.createElementNS(ns, 'text');
      val.setAttribute('x', x + barW/2); val.setAttribute('y', by - 4);
      val.setAttribute('text-anchor','middle'); val.setAttribute('fill','#C8FF00');
      val.setAttribute('font-size','9'); val.setAttribute('font-weight','700');
      val.setAttribute('font-family','Nunito,sans-serif');
      val.textContent = s.count;
      svg.appendChild(val);

      const lbl = document.createElementNS(ns, 'text');
      lbl.setAttribute('x', x + barW/2); lbl.setAttribute('y', H + 14);
      lbl.setAttribute('text-anchor','middle'); lbl.setAttribute('fill','rgba(255,255,255,0.4)');
      lbl.setAttribute('font-size','8'); lbl.setAttribute('font-family','Nunito,sans-serif');
      lbl.textContent = s.label;
      svg.appendChild(lbl);
    });

    cont.innerHTML = '';
    cont.appendChild(svg);
  }

  function _renderGraficaDonut(porCategoria) {
    const cont = document.getElementById('adm-donut');
    if (!cont) return;

    const cats = Object.entries(porCategoria).map(([cat, count]) => {
      const etq = VocaData.getEtiquetaCategoria(cat);
      return { label: etq.label, count, color: etq.color };
    }).filter(c => c.count > 0);

    const total = cats.reduce((s, c) => s + c.count, 0);

    // Leyenda
    const legend = document.getElementById('adm-legend');
    if (legend) {
      legend.innerHTML = cats.map(c => `
        <div class="leg-item">
          <div class="leg-dot" style="background:${c.color}"></div>
          <span style="flex:1;font-size:11px">${c.label}</span>
          <span class="leg-pct">${c.count}</span>
        </div>`).join('');
    }

    // Total en centro del donut
    _setText('adm-total-donut', total);

    if (!total) { cont.innerHTML = ''; return; }

    // SVG donut
    const ns = 'http://www.w3.org/2000/svg';
    const SZ = 100, CX = 50, CY = 50, R = 40, r = 28;

    let old = cont.querySelector('svg');
    if (old) old.remove();

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${SZ} ${SZ}`);
    svg.setAttribute('width', '100%');

    let startAngle = -Math.PI / 2;
    cats.forEach(cat => {
      const frac = cat.count / total;
      const endAngle = startAngle + frac * Math.PI * 2;

      const x1 = CX + R * Math.cos(startAngle), y1 = CY + R * Math.sin(startAngle);
      const x2 = CX + R * Math.cos(endAngle),   y2 = CY + R * Math.sin(endAngle);
      const xi1 = CX + r * Math.cos(endAngle),   yi1 = CY + r * Math.sin(endAngle);
      const xi2 = CX + r * Math.cos(startAngle), yi2 = CY + r * Math.sin(startAngle);
      const large = frac > 0.5 ? 1 : 0;

      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d',
        `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi1.toFixed(2)},${yi1.toFixed(2)} A${r},${r} 0 ${large},0 ${xi2.toFixed(2)},${yi2.toFixed(2)} Z`
      );
      path.setAttribute('fill', cat.color);
      const title = document.createElementNS(ns, 'title');
      title.textContent = `${cat.label}: ${cat.count}`;
      path.appendChild(title);
      svg.appendChild(path);

      startAngle = endAngle;
    });

    cont.innerHTML = '';
    cont.appendChild(svg);
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
