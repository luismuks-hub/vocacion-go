/**
 * VocaTest — data.js
 * Fuente de verdad del sistema. Solo lectura.
 * Contiene: dimensiones, preguntas, escala, reglas y catálogo de carreras.
 * Basado en: Matriz_Vocacional_Centrum.xlsx
 */

const VocaData = (() => {

  /* ============================================================
     DIMENSIONES (6 en total)
     Fuente: Hoja 1 - Dimensiones del Excel
  ============================================================ */
  const DIMENSIONES = [
    {
      id: 'DIM-01',
      nombre: 'Intereses Académicos / Universitarios',
      nombreCorto: 'Académico',
      definicion: 'Grado de afinidad hacia actividades de investigación, análisis teórico, producción de conocimiento y formación universitaria prolongada.',
      holland: ['Investigativo', 'Convencional'],
      kuder: ['Científica', 'Literaria'],
      numItems: 10,
      peso: 1.00,
      maxPosible: 50,
      icono: '🎓',
      color: '#7C3AED',
      colorFondo: '#EDE9FE',
      colorTexto: '#5B21B6'
    },
    {
      id: 'DIM-02',
      nombre: 'Intereses Técnicos / Prácticos',
      nombreCorto: 'Técnico',
      definicion: 'Grado de afinidad hacia actividades manuales, operativas, de construcción, reparación y aplicación práctica de conocimientos.',
      holland: ['Realista'],
      kuder: ['Mecánica', 'Aire libre'],
      numItems: 10,
      peso: 1.00,
      maxPosible: 50,
      icono: '🔧',
      color: '#22C55E',
      colorFondo: '#D1FAE5',
      colorTexto: '#065F46'
    },
    {
      id: 'DIM-03',
      nombre: 'Intereses Científicos / Investigativos',
      nombreCorto: 'Científico',
      definicion: 'Grado de afinidad hacia la experimentación, el método científico, la resolución de problemas complejos y el descubrimiento.',
      holland: ['Investigativo'],
      kuder: ['Científica', 'Cálculo'],
      numItems: 10,
      peso: 1.00,
      maxPosible: 50,
      icono: '🔬',
      color: '#3B82F6',
      colorFondo: '#DBEAFE',
      colorTexto: '#1E3A8A'
    },
    {
      id: 'DIM-04',
      nombre: 'Intereses Sociales / Comunitarios',
      nombreCorto: 'Social',
      definicion: 'Grado de afinidad hacia actividades de ayuda, enseñanza, orientación, trabajo en equipo y servicio a otros.',
      holland: ['Social'],
      kuder: ['Social', 'Persuasiva'],
      numItems: 10,
      peso: 1.00,
      maxPosible: 50,
      icono: '🤝',
      color: '#EC4899',
      colorFondo: '#FCE7F3',
      colorTexto: '#9D174D'
    },
    {
      id: 'DIM-05',
      nombre: 'Tendencias de Servicio Público',
      nombreCorto: 'Serv. Público',
      definicion: 'Grado de afinidad hacia actividades de servicio al Estado, defensa, seguridad ciudadana y orden público.',
      holland: ['Social', 'Emprendedor'],
      kuder: ['Social', 'Persuasiva'],
      numItems: 8,
      peso: 1.25,
      maxPosible: 50,   // 8 items × 5 × 1.25 = 50 normalizado
      icono: '🛡️',
      color: '#F59E0B',
      colorFondo: '#FEF3C7',
      colorTexto: '#92400E'
    },
    {
      id: 'DIM-06',
      nombre: 'Disciplina y Estructura Organizacional',
      nombreCorto: 'Disciplina',
      definicion: 'Grado de afinidad hacia ambientes jerárquicos, normas estrictas, rutinas estructuradas y orden institucional.',
      holland: ['Convencional', 'Realista'],
      kuder: ['Administrativa'],
      numItems: 8,
      peso: 1.25,
      maxPosible: 50,
      icono: '📋',
      color: '#6B7280',
      colorFondo: '#F3F4F6',
      colorTexto: '#374151'
    }
  ];

  /* ============================================================
     BANCO DE ÍTEMS (56 preguntas)
     Fuente: Hoja 2 - Banco de Ítems del Excel
  ============================================================ */
  const ITEMS = [
    // --- DIM-01: Intereses Académicos (IT-001 a IT-010) ---
    { id: 'IT-001', dim: 'DIM-01', texto: 'Me interesa leer artículos científicos y académicos sobre temas diversos.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-002', dim: 'DIM-01', texto: 'Disfruto analizando datos y extrayendo conclusiones de información compleja.', holland: 'Investigativo', kuder: 'Cálculo', peso: 1 },
    { id: 'IT-003', dim: 'DIM-01', texto: 'Me gustaría dedicar varios años a estudiar una carrera universitaria a profundidad.', holland: 'Convencional', kuder: 'Literaria', peso: 1 },
    { id: 'IT-004', dim: 'DIM-01', texto: 'Prefiero entender la teoría antes de pasar a la práctica.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-005', dim: 'DIM-01', texto: 'Me motiva la idea de realizar investigaciones que aporten nuevo conocimiento.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-006', dim: 'DIM-01', texto: 'Disfruto participando en debates académicos y exposiciones.', holland: 'Social', kuder: 'Literaria', peso: 1 },
    { id: 'IT-007', dim: 'DIM-01', texto: 'Me gusta redactar ensayos, informes o textos argumentativos.', holland: 'Investigativo', kuder: 'Literaria', peso: 1 },
    { id: 'IT-008', dim: 'DIM-01', texto: 'Me atrae la idea de obtener un grado académico avanzado (maestría, doctorado).', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-009', dim: 'DIM-01', texto: 'Prefiero carreras que requieran pensamiento analítico y crítico.', holland: 'Investigativo', kuder: 'Cálculo', peso: 1 },
    { id: 'IT-010', dim: 'DIM-01', texto: 'Me interesa aprender idiomas o herramientas que amplíen mi formación profesional.', holland: 'Convencional', kuder: 'Literaria', peso: 1 },

    // --- DIM-02: Intereses Técnicos (IT-011 a IT-020) ---
    { id: 'IT-011', dim: 'DIM-02', texto: 'Disfruto armando, reparando o construyendo cosas con mis manos.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-012', dim: 'DIM-02', texto: 'Me gusta trabajar con herramientas, máquinas o equipos tecnológicos.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-013', dim: 'DIM-02', texto: 'Prefiero aprender haciendo en lugar de solo leyendo o escuchando.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-014', dim: 'DIM-02', texto: 'Me interesa una formación técnica que me permita trabajar rápidamente.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-015', dim: 'DIM-02', texto: 'Me siento cómodo/a trabajando al aire libre o en actividades físicas.', holland: 'Realista', kuder: 'Aire libre', peso: 1 },
    { id: 'IT-016', dim: 'DIM-02', texto: 'Me gusta resolver problemas prácticos del día a día.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-017', dim: 'DIM-02', texto: 'Valoro las carreras donde se produce un resultado tangible o visible.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-018', dim: 'DIM-02', texto: 'Me interesa la electricidad, electrónica, mecánica o construcción.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },
    { id: 'IT-019', dim: 'DIM-02', texto: 'Prefiero programas de estudio cortos con alta empleabilidad.', holland: 'Realista', kuder: 'Administrativa', peso: 1 },
    { id: 'IT-020', dim: 'DIM-02', texto: 'Me gustaría especializarme en un oficio técnico específico.', holland: 'Realista', kuder: 'Mecánica', peso: 1 },

    // --- DIM-03: Intereses Científicos (IT-021 a IT-030) ---
    { id: 'IT-021', dim: 'DIM-03', texto: 'Me fascina entender cómo funcionan las cosas a nivel profundo.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-022', dim: 'DIM-03', texto: 'Disfruto realizando experimentos o pruebas para comprobar hipótesis.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-023', dim: 'DIM-03', texto: 'Me gusta resolver problemas matemáticos o lógicos complejos.', holland: 'Investigativo', kuder: 'Cálculo', peso: 1 },
    { id: 'IT-024', dim: 'DIM-03', texto: 'Me interesa la biología, química, física u otras ciencias naturales.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-025', dim: 'DIM-03', texto: 'Disfruto buscando patrones o relaciones en conjuntos de datos.', holland: 'Investigativo', kuder: 'Cálculo', peso: 1 },
    { id: 'IT-026', dim: 'DIM-03', texto: 'Me motiva contribuir al avance de la ciencia o la tecnología.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-027', dim: 'DIM-03', texto: 'Prefiero tomar decisiones basadas en evidencia y datos objetivos.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-028', dim: 'DIM-03', texto: 'Me gusta programar, diseñar algoritmos o trabajar con tecnología.', holland: 'Investigativo', kuder: 'Cálculo', peso: 1 },
    { id: 'IT-029', dim: 'DIM-03', texto: 'Me interesa comprender fenómenos naturales o sociales mediante investigación.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },
    { id: 'IT-030', dim: 'DIM-03', texto: 'Disfruto leyendo sobre descubrimientos científicos y nuevas tecnologías.', holland: 'Investigativo', kuder: 'Científica', peso: 1 },

    // --- DIM-04: Intereses Sociales (IT-031 a IT-040) ---
    { id: 'IT-031', dim: 'DIM-04', texto: 'Me gusta ayudar a otras personas a resolver sus problemas.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-032', dim: 'DIM-04', texto: 'Disfruto trabajando en equipo y coordinando actividades grupales.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-033', dim: 'DIM-04', texto: 'Me interesa una carrera que me permita contribuir al bienestar de la comunidad.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-034', dim: 'DIM-04', texto: 'Me siento bien cuando enseño algo a alguien o lo oriento.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-035', dim: 'DIM-04', texto: 'Me preocupan los problemas sociales como la pobreza, la desigualdad o la violencia.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-036', dim: 'DIM-04', texto: 'Disfruto organizando eventos, actividades comunitarias o campañas sociales.', holland: 'Emprendedor', kuder: 'Persuasiva', peso: 1 },
    { id: 'IT-037', dim: 'DIM-04', texto: 'Me gusta escuchar a los demás y ofrecer apoyo emocional.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-038', dim: 'DIM-04', texto: 'Me atrae la idea de trabajar en organizaciones que promuevan el cambio social.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-039', dim: 'DIM-04', texto: 'Prefiero profesiones donde el contacto humano sea el centro del trabajo.', holland: 'Social', kuder: 'Social', peso: 1 },
    { id: 'IT-040', dim: 'DIM-04', texto: 'Me interesa la psicología, el trabajo social, la educación o la salud.', holland: 'Social', kuder: 'Social', peso: 1 },

    // --- DIM-05: Servicio Público (IT-041 a IT-048) ---
    { id: 'IT-041', dim: 'DIM-05', texto: 'Siento vocación por servir a mi país y contribuir a su seguridad.', holland: 'Social', kuder: 'Social', peso: 1.25 },
    { id: 'IT-042', dim: 'DIM-05', texto: 'Me interesa una carrera vinculada a las fuerzas armadas o policiales.', holland: 'Emprendedor', kuder: 'Persuasiva', peso: 1.25 },
    { id: 'IT-043', dim: 'DIM-05', texto: 'Valoro el patriotismo y el compromiso con la sociedad.', holland: 'Social', kuder: 'Social', peso: 1.25 },
    { id: 'IT-044', dim: 'DIM-05', texto: 'Me atrae participar en misiones de ayuda humanitaria o defensa civil.', holland: 'Social', kuder: 'Social', peso: 1.25 },
    { id: 'IT-045', dim: 'DIM-05', texto: 'Me siento motivado/a por proteger a otros y mantener el orden.', holland: 'Emprendedor', kuder: 'Persuasiva', peso: 1.25 },
    { id: 'IT-046', dim: 'DIM-05', texto: 'Me interesa la función pública y el servicio al Estado.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-047', dim: 'DIM-05', texto: 'Estoy dispuesto/a a trabajar bajo presión y en situaciones de riesgo.', holland: 'Realista', kuder: 'Aire libre', peso: 1.25 },
    { id: 'IT-048', dim: 'DIM-05', texto: 'Me motiva la idea de contribuir a la justicia y al cumplimiento de la ley.', holland: 'Social', kuder: 'Persuasiva', peso: 1.25 },

    // --- DIM-06: Disciplina y Estructura (IT-049 a IT-056) ---
    { id: 'IT-049', dim: 'DIM-06', texto: 'Me siento cómodo/a en ambientes con reglas claras y estructura definida.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-050', dim: 'DIM-06', texto: 'Valoro la puntualidad, el orden y la disciplina en el trabajo.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-051', dim: 'DIM-06', texto: 'Me adapto bien a jerarquías y cadenas de mando.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-052', dim: 'DIM-06', texto: 'Prefiero seguir procedimientos establecidos que improvisar.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-053', dim: 'DIM-06', texto: 'Me gusta planificar mis actividades con anticipación.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-054', dim: 'DIM-06', texto: 'Respeto las normas y reglamentos incluso cuando no estoy de acuerdo.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-055', dim: 'DIM-06', texto: 'Me atraen organizaciones con uniformes, protocolos y ceremonias.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 },
    { id: 'IT-056', dim: 'DIM-06', texto: 'Considero que la disciplina personal es clave para el éxito profesional.', holland: 'Convencional', kuder: 'Administrativa', peso: 1.25 }
  ];

  /* ============================================================
     ESCALA LIKERT
  ============================================================ */
  const ESCALA = [
    { valor: 1, etiqueta: 'Totalmente en desacuerdo', descripcion: 'No me identifica en absoluto', codigo: 'LIKERT_1' },
    { valor: 2, etiqueta: 'En desacuerdo',            descripcion: 'Me identifica poco',           codigo: 'LIKERT_2' },
    { valor: 3, etiqueta: 'Ni de acuerdo ni en desacuerdo', descripcion: 'Me es indiferente',      codigo: 'LIKERT_3' },
    { valor: 4, etiqueta: 'De acuerdo',               descripcion: 'Me identifica bastante',       codigo: 'LIKERT_4' },
    { valor: 5, etiqueta: 'Totalmente de acuerdo',    descripcion: 'Me identifica completamente',  codigo: 'LIKERT_5' }
  ];

  /* ============================================================
     NIVELES DE INTERPRETACIÓN
     Fuente: Hoja 3 - Escala de Puntuación del Excel
  ============================================================ */
  const NIVELES = [
    { codigo: 'LEVEL_1', etiqueta: 'Muy bajo', rangoMin: 0,  rangoMax: 20,  color: '#E24B4A', icono: '⬇', prioridad: 5 },
    { codigo: 'LEVEL_2', etiqueta: 'Bajo',     rangoMin: 21, rangoMax: 40,  color: '#F97316', icono: '↓', prioridad: 4 },
    { codigo: 'LEVEL_3', etiqueta: 'Medio',    rangoMin: 41, rangoMax: 60,  color: '#EAB308', icono: '↔', prioridad: 3 },
    { codigo: 'LEVEL_4', etiqueta: 'Alto',     rangoMin: 61, rangoMax: 80,  color: '#22C55E', icono: '↑', prioridad: 2 },
    { codigo: 'LEVEL_5', etiqueta: 'Muy alto', rangoMin: 81, rangoMax: 100, color: '#7C3AED', icono: '⬆', prioridad: 1 }
  ];

  /* ============================================================
     REGLAS DE CLASIFICACIÓN (10 reglas)
     Fuente: Hoja 4 - Reglas de Clasificación del Excel
     Se evalúan en orden de prioridad. Primera que cumple = resultado.
  ============================================================ */
  const REGLAS = [
    {
      id: 'R-001', prioridad: 1,
      categoria: 'UNIVERSITARIA', confianza: 'Alta',
      mensaje: 'Tu perfil muestra alta afinidad con la formación universitaria e investigación.',
      evaluar: (s) => s['DIM-01'] >= 70 && s['DIM-03'] >= 60 && s['DIM-02'] < 50 && s['DIM-06'] < 50
    },
    {
      id: 'R-002', prioridad: 2,
      categoria: 'TECNICA', confianza: 'Alta',
      mensaje: 'Tu perfil indica una fuerte orientación hacia la formación técnica y práctica.',
      evaluar: (s) => s['DIM-02'] >= 70 && s['DIM-01'] < 50
    },
    {
      id: 'R-003', prioridad: 3,
      categoria: 'FUERZAS_ARMADAS', confianza: 'Alta',
      mensaje: 'Tu perfil muestra vocación por el servicio público y la disciplina militar.',
      evaluar: (s) => s['DIM-05'] >= 70 && s['DIM-06'] >= 70 && s['DIM-04'] >= 50
    },
    {
      id: 'R-004', prioridad: 4,
      categoria: 'POLICIAL', confianza: 'Alta',
      mensaje: 'Tu perfil indica afinidad con la formación policial y el servicio comunitario.',
      evaluar: (s) => s['DIM-05'] >= 65 && s['DIM-04'] >= 65 && s['DIM-06'] >= 60
    },
    {
      id: 'R-005', prioridad: 5,
      categoria: 'UNIVERSITARIA_TECNICA', confianza: 'Media',
      mensaje: 'Tienes un perfil mixto con afinidad tanto académica como técnica.',
      evaluar: (s) => s['DIM-01'] >= 60 && s['DIM-02'] >= 60 && Math.abs(s['DIM-01'] - s['DIM-02']) <= 15
    },
    {
      id: 'R-006', prioridad: 6,
      categoria: 'UNIVERSITARIA_SOCIAL', confianza: 'Media',
      mensaje: 'Tu perfil indica vocación social con orientación universitaria (educación, salud, trabajo social).',
      evaluar: (s) => s['DIM-04'] >= 70 && s['DIM-05'] < 50 && s['DIM-01'] >= 50
    },
    {
      id: 'R-007', prioridad: 7,
      categoria: 'UNIVERSITARIA_CIENCIAS', confianza: 'Media',
      mensaje: 'Tu perfil indica fuerte vocación científica con orientación universitaria.',
      evaluar: (s) => s['DIM-03'] >= 70 && s['DIM-01'] >= 50 && s['DIM-02'] >= 40
    },
    {
      id: 'R-008', prioridad: 8,
      categoria: 'INDETERMINADO', confianza: 'Baja',
      mensaje: 'Tu perfil no muestra una tendencia predominante. Te recomendamos orientación vocacional personalizada.',
      evaluar: (s) => Math.max(...Object.values(s)) < 50
    },
    {
      id: 'R-009', prioridad: 9,
      categoria: 'MULTIPLE', confianza: 'Media',
      mensaje: 'Tienes afinidad similar en más de un área. Se presentarán las opciones principales.',
      evaluar: (s) => {
        const vals = Object.values(s).sort((a, b) => b - a);
        return (vals[0] - vals[1]) <= 10 && vals[0] >= 60;
      }
    },
    {
      id: 'R-010', prioridad: 10,
      categoria: 'DEFAULT', confianza: 'Básica',
      mensaje: 'Resultado basado en tu dimensión con mayor puntaje.',
      evaluar: () => true  // siempre se cumple — es el fallback
    }
  ];

  /* ============================================================
     CATÁLOGO DE CARRERAS — Campos completos
     Fuente: Hoja 5 - Catálogo Carreras del Excel + enriquecido
  ============================================================ */
  const CATALOGO = [

    // ── UNIVERSITARIA — Ciencias e Ingeniería ──
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias e Ingeniería',
      nombre: 'Ingeniería de Sistemas', icono: '💻',
      dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Diseña, desarrolla y gestiona sistemas de información, software y redes. Alta demanda en el mercado laboral peruano y latinoamericano.',
      campoLaboral: ['Empresas TI', 'Consultoría tecnológica', 'Sector público', 'Emprendimiento', 'Banca y finanzas'],
      especializaciones: ['Ciberseguridad', 'Inteligencia Artificial', 'Desarrollo Web', 'Gestión de Proyectos TI'],
      instituciones: ['UNMSM', 'UNI', 'PUCP', 'UPC', 'UNSA'],
      sueldoJunior: 'S/ 2,500 – 4,000',
      sueldoSenior: 'S/ 8,000 – 18,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 800 – 2,000 | Ciclo S/ 4,000 – 9,000'
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias e Ingeniería',
      nombre: 'Ingeniería Civil', icono: '🏗️',
      dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Planifica, diseña y supervisa obras de infraestructura: edificios, carreteras, puentes y sistemas de agua.',
      campoLaboral: ['Construcción privada', 'Obras públicas', 'Consultoría estructural', 'Minería', 'Urbanismo'],
      especializaciones: ['Estructuras', 'Geotecnia', 'Hidráulica', 'Transporte y vías'],
      instituciones: ['UNI', 'PUCP', 'UNMSM', 'UPC', 'UNSA'],
      sueldoJunior: 'S/ 2,500 – 4,500',
      sueldoSenior: 'S/ 7,000 – 15,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 800 – 2,000 | Ciclo S/ 4,500 – 9,500'
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias e Ingeniería',
      nombre: 'Ingeniería Industrial', icono: '⚙️',
      dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Optimiza procesos productivos, gestiona recursos y mejora la eficiencia en empresas de cualquier sector.',
      campoLaboral: ['Manufactura', 'Logística y cadena de suministro', 'Consultoría', 'Sector financiero', 'Agroindustria'],
      especializaciones: ['Lean Manufacturing', 'Logística', 'Calidad', 'Seguridad industrial'],
      instituciones: ['UNI', 'PUCP', 'UNMSM', 'UPC', 'USIL'],
      sueldoJunior: 'S/ 2,500 – 4,000',
      sueldoSenior: 'S/ 7,000 – 14,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 800 – 2,000 | Ciclo S/ 4,000 – 9,000'
    },

    // ── UNIVERSITARIA — Ciencias de la Salud ──
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias de la Salud',
      nombre: 'Medicina Humana', icono: '🔬',
      dims: ['DIM-01', 'DIM-03', 'DIM-04'], duracion: '7 años',
      descripcion: 'Previene, diagnostica y trata enfermedades para salvar vidas y mejorar la salud de la población.',
      campoLaboral: ['Hospitales y clínicas', 'Salud pública', 'Investigación científica', 'Docencia universitaria'],
      especializaciones: ['Cardiología', 'Pediatría', 'Cirugía', 'Neurología', 'Psiquiatría'],
      instituciones: ['UNMSM', 'UPCH (Cayetano Heredia)', 'USMP', 'UPC', 'Científica del Sur'],
      sueldoJunior: 'S/ 3,500 – 5,000',
      sueldoSenior: 'S/ 10,000 – 18,000',
      costoNacional: 'Matrícula S/ 400 – 600 | Ciclo S/ 1,000 – 2,000',
      costoPrivada: 'Matrícula S/ 1,000 – 2,500 | Ciclo S/ 6,000 – 12,000'
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias de la Salud',
      nombre: 'Psicología', icono: '🧠',
      dims: ['DIM-01', 'DIM-04'], duracion: '5 años',
      descripcion: 'Estudia el comportamiento humano y apoya la salud mental de personas, grupos y organizaciones.',
      campoLaboral: ['Clínicas y hospitales', 'Empresas (RRHH)', 'Educación', 'ONGs', 'Consulta privada'],
      especializaciones: ['Psicología clínica', 'Psicología organizacional', 'Neuropsicología', 'Psicología educativa'],
      instituciones: ['PUCP', 'UNMSM', 'USMP', 'URP', 'UPC'],
      sueldoJunior: 'S/ 1,800 – 3,000',
      sueldoSenior: 'S/ 5,000 – 10,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 600 – 1,500 | Ciclo S/ 3,500 – 7,000'
    },

    // ── UNIVERSITARIA — Ciencias Sociales ──
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias Sociales',
      nombre: 'Derecho', icono: '⚖️',
      dims: ['DIM-01', 'DIM-04'], duracion: '5 años',
      descripcion: 'Interpreta y aplica las leyes para defender derechos, resolver conflictos y contribuir a la justicia.',
      campoLaboral: ['Estudios jurídicos', 'Sector público', 'Empresa privada', 'Poder Judicial', 'ONGs'],
      especializaciones: ['Derecho corporativo', 'Derecho penal', 'Derecho laboral', 'Derecho internacional'],
      instituciones: ['PUCP', 'UNMSM', 'UNFV', 'URP', 'San Martín'],
      sueldoJunior: 'S/ 2,000 – 3,500',
      sueldoSenior: 'S/ 8,000 – 20,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 600 – 1,500 | Ciclo S/ 3,500 – 7,500'
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias Sociales',
      nombre: 'Educación', icono: '📚',
      dims: ['DIM-01', 'DIM-04'], duracion: '5 años',
      descripcion: 'Forma docentes capaces de guiar el aprendizaje y el desarrollo integral de estudiantes de todos los niveles.',
      campoLaboral: ['Colegios nacionales', 'Colegios privados', 'Institutos', 'Sector público (MINEDU)'],
      especializaciones: ['Educación Inicial', 'Educación Primaria', 'Matemáticas', 'Comunicación'],
      instituciones: ['UNMSM', 'PUCP', 'UNE (La Cantuta)', 'UNFV', 'San Agustín'],
      sueldoJunior: 'S/ 1,800 – 2,800',
      sueldoSenior: 'S/ 4,000 – 8,000',
      costoNacional: 'Matrícula S/ 50 – 100 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 400 – 1,000 | Ciclo S/ 2,500 – 5,000'
    },

    // ── UNIVERSITARIA — Ciencias Económicas ──
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias Económicas',
      nombre: 'Administración de Empresas', icono: '📊',
      dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Gestiona recursos, lidera equipos y toma decisiones estratégicas para el crecimiento de organizaciones.',
      campoLaboral: ['Banca y finanzas', 'Empresas privadas', 'Consultoría', 'Gobierno', 'Emprendimiento'],
      especializaciones: ['Marketing', 'Finanzas', 'Recursos Humanos', 'Comercio Internacional'],
      instituciones: ['UNMSM', 'UP (Pacífico)', 'UPC', 'ESAN', 'USIL'],
      sueldoJunior: 'S/ 2,000 – 3,500',
      sueldoSenior: 'S/ 6,000 – 15,000',
      costoNacional: 'Matrícula S/ 50 – 150 | Ciclo S/ 0 (gratuita)',
      costoPrivada: 'Matrícula S/ 800 – 2,500 | Ciclo S/ 5,000 – 11,000'
    },

    // ── TÉCNICA — Tecnología ──
    {
      categoria: 'TECNICA', subcategoria: 'Tecnología',
      nombre: 'Desarrollo de Software', icono: '🖥️',
      dims: ['DIM-02', 'DIM-03'], duracion: '3 años',
      descripcion: 'Crea aplicaciones, páginas web y sistemas digitales. Alta empleabilidad y posibilidad de trabajo remoto.',
      campoLaboral: ['Empresas TI', 'Freelance', 'Startups', 'Banca', 'E-commerce'],
      especializaciones: ['Frontend', 'Backend', 'Mobile', 'Base de datos', 'QA Testing'],
      instituciones: ['SENATI', 'Cibertec', 'Tecsup', 'ISIL', 'Zegel'],
      sueldoJunior: 'S/ 1,800 – 3,500',
      sueldoSenior: 'S/ 6,000 – 14,000',
      costoNacional: 'Matrícula S/ 200 – 500 | Ciclo S/ 1,500 – 2,500',
      costoPrivada: 'Matrícula S/ 500 – 1,200 | Ciclo S/ 2,500 – 4,500'
    },
    {
      categoria: 'TECNICA', subcategoria: 'Tecnología',
      nombre: 'Redes y Comunicaciones', icono: '🌐',
      dims: ['DIM-02', 'DIM-03'], duracion: '3 años',
      descripcion: 'Instala, configura y administra redes de datos e infraestructura de telecomunicaciones.',
      campoLaboral: ['Telecomunicaciones', 'Empresas TI', 'ISPs', 'Bancos', 'Instituciones públicas'],
      especializaciones: ['Cisco CCNA', 'Ciberseguridad', 'Cloud Computing', 'Fibra óptica'],
      instituciones: ['SENATI', 'Cibertec', 'Tecsup', 'IDAT'],
      sueldoJunior: 'S/ 1,500 – 2,800',
      sueldoSenior: 'S/ 5,000 – 10,000',
      costoNacional: 'Matrícula S/ 200 – 400 | Ciclo S/ 1,200 – 2,000',
      costoPrivada: 'Matrícula S/ 400 – 1,000 | Ciclo S/ 2,000 – 3,500'
    },
    {
      categoria: 'TECNICA', subcategoria: 'Industrial y Mecánica',
      nombre: 'Mecánica Automotriz', icono: '🚗',
      dims: ['DIM-02'], duracion: '3 años',
      descripcion: 'Diagnostica, repara y mantiene vehículos modernos con tecnología electrónica y mecánica avanzada.',
      campoLaboral: ['Talleres mecánicos', 'Concesionarias', 'Manufactura', 'Minería', 'Transporte'],
      especializaciones: ['Electrónica automotriz', 'Sistemas de transmisión', 'Frenos y suspensión'],
      instituciones: ['SENATI', 'Tecsup', 'SENCICO', 'CEPEA'],
      sueldoJunior: 'S/ 1,200 – 2,000',
      sueldoSenior: 'S/ 3,500 – 7,000',
      costoNacional: 'Matrícula S/ 150 – 300 | Ciclo S/ 800 – 1,500',
      costoPrivada: 'Matrícula S/ 300 – 700 | Ciclo S/ 1,500 – 2,500'
    },
    {
      categoria: 'TECNICA', subcategoria: 'Industrial y Mecánica',
      nombre: 'Electricidad Industrial', icono: '⚡',
      dims: ['DIM-02'], duracion: '2 años',
      descripcion: 'Instala y mantiene sistemas eléctricos en industrias, plantas y edificios con alta demanda laboral.',
      campoLaboral: ['Industria', 'Construcción', 'Minería', 'Generación eléctrica', 'Mantenimiento'],
      especializaciones: ['Automatización', 'PLC', 'Alta tensión', 'Energías renovables'],
      instituciones: ['SENATI', 'Tecsup', 'SENCICO', 'CFP'],
      sueldoJunior: 'S/ 1,200 – 2,000',
      sueldoSenior: 'S/ 3,500 – 7,500',
      costoNacional: 'Matrícula S/ 100 – 250 | Ciclo S/ 700 – 1,200',
      costoPrivada: 'Matrícula S/ 250 – 500 | Ciclo S/ 1,200 – 2,000'
    },
    {
      categoria: 'TECNICA', subcategoria: 'Salud Técnica',
      nombre: 'Enfermería Técnica', icono: '🏥',
      dims: ['DIM-02', 'DIM-04'], duracion: '3 años',
      descripcion: 'Brinda cuidados de salud a pacientes bajo supervisión médica en hospitales, clínicas y postas.',
      campoLaboral: ['Hospitales', 'Clínicas privadas', 'Farmacias', 'Centros de salud', 'Atención domiciliaria'],
      especializaciones: ['Enfermería pediátrica', 'Emergencias', 'Cuidados intensivos'],
      instituciones: ['Institutos tecnológicos públicos', 'SIAT', 'Privados acreditados'],
      sueldoJunior: 'S/ 1,200 – 2,000',
      sueldoSenior: 'S/ 2,500 – 4,500',
      costoNacional: 'Matrícula S/ 100 – 300 | Ciclo S/ 800 – 1,500',
      costoPrivada: 'Matrícula S/ 400 – 800 | Ciclo S/ 1,500 – 2,800'
    },

    // ── FUERZAS ARMADAS ──
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Ejército',
      nombre: 'Oficial del Ejército del Perú', icono: '🎖️',
      dims: ['DIM-05', 'DIM-06'], duracion: '4 años',
      descripcion: 'Lidera unidades militares en operaciones de defensa nacional, gestión de emergencias y misiones de paz.',
      campoLaboral: ['Defensa nacional', 'Logística militar', 'Inteligencia', 'Misiones ONU', 'Gestión de desastres'],
      especializaciones: ['Infantería', 'Artillería', 'Inteligencia militar', 'Ingeniería militar'],
      instituciones: ['Escuela Militar de Chorrillos', 'IESTPE', 'CAEN'],
      sueldoJunior: 'S/ 2,500 – 4,000',
      sueldoSenior: 'S/ 6,000 – 12,000',
      costoNacional: 'Gratuito con beca del Estado peruano',
      costoPrivada: 'N/A — institución estatal'
    },
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Marina',
      nombre: 'Oficial de la Marina de Guerra', icono: '⚓',
      dims: ['DIM-05', 'DIM-06'], duracion: '5 años',
      descripcion: 'Protege las fronteras marítimas del Perú y participa en operaciones navales, guardacostas y misiones internacionales.',
      campoLaboral: ['Defensa marítima', 'Operaciones navales', 'Guardacostas', 'Puertos', 'Misiones ONU'],
      especializaciones: ['Navegación', 'Ingeniería naval', 'Infantería de Marina', 'Inteligencia naval'],
      instituciones: ['Escuela Naval del Perú', 'CITEN'],
      sueldoJunior: 'S/ 2,500 – 4,000',
      sueldoSenior: 'S/ 6,000 – 12,000',
      costoNacional: 'Gratuito con beca del Estado peruano',
      costoPrivada: 'N/A — institución estatal'
    },
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Fuerza Aérea',
      nombre: 'Oficial de la FAP', icono: '✈️',
      dims: ['DIM-05', 'DIM-06'], duracion: '4 años',
      descripcion: 'Protege el espacio aéreo peruano y opera aeronaves militares en misiones de defensa y apoyo humanitario.',
      campoLaboral: ['Aviación militar', 'Defensa aérea', 'Logística aérea', 'Rescate y emergencias'],
      especializaciones: ['Piloto militar', 'Control aéreo', 'Mantenimiento aeronáutico', 'Inteligencia aérea'],
      instituciones: ['Escuela de Oficiales FAP', 'ESOFA', 'EMGFA'],
      sueldoJunior: 'S/ 2,500 – 4,000',
      sueldoSenior: 'S/ 6,000 – 12,000',
      costoNacional: 'Gratuito con beca del Estado peruano',
      costoPrivada: 'N/A — institución estatal'
    },

    // ── POLICIAL ──
    {
      categoria: 'POLICIAL', subcategoria: 'Oficiales PNP',
      nombre: 'Oficial de la PNP', icono: '👮',
      dims: ['DIM-04', 'DIM-05', 'DIM-06'], duracion: '5 años',
      descripcion: 'Lidera unidades policiales para garantizar la seguridad ciudadana, investigar delitos y mantener el orden público.',
      campoLaboral: ['Seguridad ciudadana', 'Investigación criminal', 'Orden público', 'Lucha contra el crimen organizado'],
      especializaciones: ['Investigación criminal', 'Orden público', 'Inteligencia policial', 'Tránsito'],
      instituciones: ['Escuela de Oficiales PNP (EO-PNP)'],
      sueldoJunior: 'S/ 2,200 – 3,500',
      sueldoSenior: 'S/ 5,000 – 10,000',
      costoNacional: 'Gratuito con beca del Estado peruano',
      costoPrivada: 'N/A — institución estatal'
    },
    {
      categoria: 'POLICIAL', subcategoria: 'Suboficiales PNP',
      nombre: 'Suboficial de la PNP', icono: '🚔',
      dims: ['DIM-04', 'DIM-05', 'DIM-06'], duracion: '3 años',
      descripcion: 'Ejecuta operaciones de patrullaje, control de tránsito y seguridad comunitaria en contacto directo con la ciudadanía.',
      campoLaboral: ['Patrullaje urbano', 'Control de tránsito', 'Seguridad comunitaria', 'Protección de instalaciones'],
      especializaciones: ['Patrullaje', 'Tránsito', 'Criminalística', 'Protección de personas'],
      instituciones: ['Escuelas Técnico Superiores PNP (ETS-PNP)'],
      sueldoJunior: 'S/ 1,800 – 2,800',
      sueldoSenior: 'S/ 3,500 – 6,000',
      costoNacional: 'Gratuito con beca del Estado peruano',
      costoPrivada: 'N/A — institución estatal'
    }
  ];

  /* ============================================================
     MAPEO: categoría → dimensión dominante (para R-010 default)
  ============================================================ */
  const MAPEO_DEFAULT = {
    'DIM-01': 'UNIVERSITARIA',
    'DIM-02': 'TECNICA',
    'DIM-03': 'UNIVERSITARIA',
    'DIM-04': 'UNIVERSITARIA_SOCIAL',
    'DIM-05': 'FUERZAS_ARMADAS',
    'DIM-06': 'FUERZAS_ARMADAS'
  };

  /* ============================================================
     ETIQUETAS DE CATEGORÍAS (para mostrar en UI)
  ============================================================ */
  const ETIQUETAS_CATEGORIA = {
    'UNIVERSITARIA':          { label: 'Carrera Universitaria',         color: '#7C3AED', fondo: '#EDE9FE', icono: '🎓' },
    'TECNICA':                { label: 'Carrera Técnica',               color: '#22C55E', fondo: '#D1FAE5', icono: '🔧' },
    'FUERZAS_ARMADAS':        { label: 'Fuerzas Armadas',               color: '#F59E0B', fondo: '#FEF3C7', icono: '🎖️' },
    'POLICIAL':               { label: 'Carrera Policial',              color: '#EC4899', fondo: '#FCE7F3', icono: '👮' },
    'UNIVERSITARIA_TECNICA':  { label: 'Universitaria / Técnica',       color: '#7C3AED', fondo: '#EDE9FE', icono: '🎓' },
    'UNIVERSITARIA_SOCIAL':   { label: 'Universitaria (área social)',   color: '#7C3AED', fondo: '#EDE9FE', icono: '🎓' },
    'UNIVERSITARIA_CIENCIAS': { label: 'Universitaria (ciencias)',      color: '#3B82F6', fondo: '#DBEAFE', icono: '🔬' },
    'MULTIPLE':               { label: 'Perfil múltiple',               color: '#6B7280', fondo: '#F3F4F6', icono: '🔀' },
    'INDETERMINADO':          { label: 'Indeterminado',                 color: '#6B7280', fondo: '#F3F4F6', icono: '❓' },
    'DEFAULT':                { label: 'Orientación general',           color: '#6B7280', fondo: '#F3F4F6', icono: '📌' }
  };

  /* ============================================================
     API PÚBLICA — solo getters, no se modifica data en runtime
  ============================================================ */
  return {
    getDimensiones:       () => [...DIMENSIONES],
    getDimension:         (id) => DIMENSIONES.find(d => d.id === id),
    getItems:             () => [...ITEMS],
    getItemsPorDimension: (dimId) => ITEMS.filter(i => i.dim === dimId),
    getEscala:            () => [...ESCALA],
    getNiveles:           () => [...NIVELES],
    getReglas:            () => [...REGLAS].sort((a, b) => a.prioridad - b.prioridad),
    getCatalogo:          () => [...CATALOGO],
    getCatalogoPorCategoria: (cat) => CATALOGO.filter(c => c.categoria === cat),
    getMapeoDefault:      () => ({ ...MAPEO_DEFAULT }),
    getEtiquetaCategoria: (cat) => ETIQUETAS_CATEGORIA[cat] || ETIQUETAS_CATEGORIA['DEFAULT'],
    getTotalItems:        () => ITEMS.length,
    VERSION: '1.0.0'
  };

})();
