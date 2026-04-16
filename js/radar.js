/**
 * Vocación GO — radar.js
 * Radar chart en SVG puro. Sin librerías externas.
 * Reemplaza Chart.js para funcionar 100% offline.
 */
const VocaRadar = (() => {

  function dibujar(canvasId, puntajesNorm, dims) {
    const contenedor = document.getElementById(canvasId);
    if (!contenedor) return;

    // Reemplazar el canvas por un SVG en el mismo lugar
    const parent = contenedor.parentNode;
    const svgId  = canvasId + '_svg';
    let svg = document.getElementById(svgId);
    if (svg) svg.remove();

    const SIZE   = 280;   // tamaño del SVG
    const CX     = 140;   // centro X
    const CY     = 148;   // centro Y (un poco más abajo para etiquetas arriba)
    const R      = 95;    // radio máximo
    const N      = dims.length;
    const LEVELS = [20, 40, 60, 80, 100];

    // Colores por dimensión
    const DIM_COLORS = {
      'DIM-01': '#A855F7',
      'DIM-02': '#22C55E',
      'DIM-03': '#00C8FF',
      'DIM-04': '#FF0099',
      'DIM-05': '#FF6B00',
      'DIM-06': '#9CA3AF',
    };

    // Ángulo de cada eje (empezar desde arriba = -90°)
    function angulo(i) {
      return (Math.PI * 2 * i / N) - Math.PI / 2;
    }

    // Punto en el radar para un valor (0-100) en el eje i
    function punto(i, valor) {
      const a = angulo(i);
      const r = R * (valor / 100);
      return {
        x: CX + r * Math.cos(a),
        y: CY + r * Math.sin(a)
      };
    }

    // Construir SVG — más grande para que quepan las etiquetas
    const ns = 'http://www.w3.org/2000/svg';
    svg = document.createElementNS(ns, 'svg');
    svg.id = svgId;
    svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('overflow', 'visible');  // permitir etiquetas fuera del box
    svg.style.display = 'block';
    svg.style.overflow = 'visible';

    // ── Ejes desde el centro ──
    for (let i = 0; i < N; i++) {
      const p = punto(i, 100);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', CX); line.setAttribute('y1', CY);
      line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
      line.setAttribute('stroke', 'rgba(255,255,255,0.15)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }

    // ── Anillos de escala ──
    LEVELS.forEach(nivel => {
      const pts = [];
      for (let i = 0; i < N; i++) {
        const p = punto(i, nivel);
        pts.push(`${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      }
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', pts.join(' ') + 'Z');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(255,255,255,0.18)');
      path.setAttribute('stroke-width', '0.8');
      path.setAttribute('stroke-dasharray', '4,3');
      svg.appendChild(path);

      // Etiqueta de nivel
      const labelP = punto(0, nivel);
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', labelP.x + 3);
      txt.setAttribute('y', labelP.y - 2);
      txt.setAttribute('fill', 'rgba(255,255,255,0.45)');
      txt.setAttribute('font-size', '8');
      txt.setAttribute('font-family', 'Nunito, sans-serif');
      txt.setAttribute('font-weight', '700');
      txt.textContent = nivel;
      svg.appendChild(txt);
    });

    // ── Área del perfil ──
    const areaPts = [];
    dims.forEach((dim, i) => {
      const val = puntajesNorm[dim.id] || 0;
      const p = punto(i, val);
      areaPts.push(`${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    });
    const area = document.createElementNS(ns, 'path');
    area.setAttribute('d', areaPts.join(' ') + 'Z');
    area.setAttribute('fill', 'rgba(139,0,255,0.28)');
    area.setAttribute('stroke', '#C8FF00');
    area.setAttribute('stroke-width', '2.5');
    area.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(area);

    // ── Puntos en cada vértice ──
    dims.forEach((dim, i) => {
      const val = puntajesNorm[dim.id] || 0;
      const p = punto(i, val);
      const color = DIM_COLORS[dim.id] || '#A855F7';

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', p.x.toFixed(1));
      circle.setAttribute('cy', p.y.toFixed(1));
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#0D0D1A');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);

      // Tooltip al hover
      const title = document.createElementNS(ns, 'title');
      title.textContent = `${dim.nombreCorto}: ${val}/100`;
      circle.appendChild(title);
    });

    // ── Etiquetas de dimensión — con ajuste fino por posición ──
    dims.forEach((dim, i) => {
      const a = angulo(i);
      const OFFSET = R + 22;
      const lx = CX + OFFSET * Math.cos(a);
      const ly = CY + OFFSET * Math.sin(a);

      // Ancla precisa según ángulo
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      let anchor = 'middle';
      if (cosA > 0.3)       anchor = 'start';
      else if (cosA < -0.3) anchor = 'end';

      // Ajuste vertical fino según posición
      let dyExtra = 0;
      if (sinA > 0.5)        dyExtra = 4;   // abajo
      else if (sinA < -0.5)  dyExtra = -4;  // arriba

      // Separar icono y texto en dos elementos para mejor control
      const g = document.createElementNS(ns, 'g');

      // Fondo semitransparente para legibilidad
      const bg = document.createElementNS(ns, 'rect');
      const label = dim.nombreCorto;
      const approxW = label.length * 6.5 + 20;
      const bgX = anchor === 'start'  ? lx - 2 :
                  anchor === 'end'    ? lx - approxW + 2 :
                                       lx - approxW/2;
      bg.setAttribute('x', bgX.toFixed(1));
      bg.setAttribute('y', (ly + dyExtra - 10).toFixed(1));
      bg.setAttribute('width', approxW.toFixed(1));
      bg.setAttribute('height', '14');
      bg.setAttribute('rx', '3');
      bg.setAttribute('fill', 'rgba(13,13,26,0.75)');
      g.appendChild(bg);

      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', lx.toFixed(1));
      txt.setAttribute('y', (ly + dyExtra).toFixed(1));
      txt.setAttribute('text-anchor', anchor);
      txt.setAttribute('dominant-baseline', 'central');
      txt.setAttribute('fill', '#D0D0E8');
      txt.setAttribute('font-size', '10');
      txt.setAttribute('font-family', 'Nunito, sans-serif');
      txt.setAttribute('font-weight', '800');
      txt.textContent = dim.icono + ' ' + dim.nombreCorto;
      g.appendChild(txt);

      svg.appendChild(g);
    });

    // Reemplazar canvas con SVG
    contenedor.style.display = 'none';
    parent.insertBefore(svg, contenedor.nextSibling);
  }

  return { dibujar };
})();
