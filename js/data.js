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
     CATÁLOGO DE CARRERAS
     Fuente: Hoja 5 - Catálogo Carreras del Excel
     Estructura: por SUBCATEGORÍA, con array de carreras individuales.
     Cada carrera tiene: icono, nombre, descripcion, campoLaboral[],
     especializaciones[], instituciones[].
     Para modificar datos de una carrera, editar directamente aquí.
  ============================================================ */
  const CATALOGO = [

    // ══════════════════════════════════════════════════════════
    //  UNIVERSITARIA
    // ══════════════════════════════════════════════════════════
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias e Ingeniería',
      icono: '⚙️', dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Formación universitaria en ingeniería y ciencias exactas. Alta demanda en el mercado laboral peruano.',
      carreras: [
        {
          nombre: 'Ingeniería de Sistemas',
          icono: '💻',
          descripcion: 'Diseña y desarrolla sistemas de información, software y redes para optimizar procesos organizacionales.',
          campoLaboral: ['Empresas de TI', 'Consultoría tecnológica', 'Banca y finanzas', 'Startups', 'Sector público'],
          especializaciones: ['Ciberseguridad', 'Inteligencia Artificial', 'Desarrollo Web', 'Cloud Computing', 'DevOps'],
          instituciones: ['UNI', 'PUCP', 'UPC', 'UNMSM', 'USIL']
        },
        {
          nombre: 'Ingeniería Civil',
          icono: '🏗️',
          descripcion: 'Planifica, diseña y supervisa la construcción de infraestructura vial, edificaciones y obras hidráulicas.',
          campoLaboral: ['Construcción', 'Minería', 'Sector público', 'Consultoría', 'Inmobiliarias'],
          especializaciones: ['Estructuras', 'Geotecnia', 'Hidráulica', 'Vías y transportes', 'Gestión de proyectos'],
          instituciones: ['UNI', 'PUCP', 'UNSA', 'UNMSM', 'UPC']
        },
        {
          nombre: 'Ingeniería Industrial',
          icono: '🏭',
          descripcion: 'Optimiza procesos productivos y de gestión para mejorar la eficiencia y competitividad de las organizaciones.',
          campoLaboral: ['Manufactura', 'Logística', 'Consultoría', 'Retail', 'Minería'],
          especializaciones: ['Gestión de operaciones', 'Lean Manufacturing', 'Supply Chain', 'Calidad', 'Seguridad industrial'],
          instituciones: ['UNI', 'PUCP', 'UPC', 'UNMSM', 'USIL']
        },
        {
          nombre: 'Ingeniería Ambiental',
          icono: '🌿',
          descripcion: 'Gestiona el impacto ambiental de actividades humanas y promueve el desarrollo sostenible.',
          campoLaboral: ['Minería', 'Industria', 'Sector público', 'ONGs ambientales', 'Consultoría'],
          especializaciones: ['Gestión ambiental', 'Recursos hídricos', 'Energías renovables', 'Residuos sólidos'],
          instituciones: ['UNMSM', 'UPC', 'PUCP', 'UNALM', 'UNFV']
        },
        {
          nombre: 'Ingeniería Mecatrónica',
          icono: '🤖',
          descripcion: 'Integra mecánica, electrónica e informática para diseñar sistemas automáticos y robots industriales.',
          campoLaboral: ['Industria', 'Minería', 'Manufactura', 'Tecnología', 'Investigación'],
          especializaciones: ['Robótica', 'Automatización industrial', 'Sistemas embebidos', 'IoT'],
          instituciones: ['UNI', 'PUCP', 'UPC', 'UTEC', 'San Ignacio de Loyola']
        }
      ]
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias de la Salud',
      icono: '🔬', dims: ['DIM-01', 'DIM-03', 'DIM-04'], duracion: '5-7 años',
      descripcion: 'Carreras orientadas a la prevención, diagnóstico y tratamiento de enfermedades con alta vocación de servicio.',
      carreras: [
        {
          nombre: 'Medicina Humana',
          icono: '🩺',
          descripcion: 'Previene, diagnostica y trata enfermedades en personas, trabajando en equipos multidisciplinarios de salud.',
          campoLaboral: ['Hospitales', 'Clínicas privadas', 'Centros de salud', 'Investigación médica', 'Salud pública'],
          especializaciones: ['Cardiología', 'Pediatría', 'Cirugía', 'Medicina interna', 'Salud pública'],
          instituciones: ['UNMSM', 'UPCH (Cayetano Heredia)', 'USMP', 'URP', 'UPC']
        },
        {
          nombre: 'Enfermería',
          icono: '💉',
          descripcion: 'Brinda cuidados integrales al paciente, apoyando al equipo médico en diagnóstico, tratamiento y recuperación.',
          campoLaboral: ['Hospitales', 'Clínicas', 'Centros de salud', 'Domicilio', 'Salud ocupacional'],
          especializaciones: ['Cuidados intensivos', 'Pediatría', 'Salud mental', 'Enfermería quirúrgica'],
          instituciones: ['UNMSM', 'UPCH', 'USMP', 'URP', 'Institutos superiores']
        },
        {
          nombre: 'Psicología',
          icono: '🧠',
          descripcion: 'Estudia el comportamiento humano para apoyar la salud mental, el desarrollo personal y el bienestar social.',
          campoLaboral: ['Clínicas y hospitales', 'Empresas (RR.HH.)', 'Educación', 'Consultoría', 'ONGs'],
          especializaciones: ['Psicología clínica', 'Psicología organizacional', 'Neuropsicología', 'Psicología educativa'],
          instituciones: ['PUCP', 'UNMSM', 'USMP', 'URP', 'UPC']
        },
        {
          nombre: 'Odontología',
          icono: '🦷',
          descripcion: 'Previene, diagnostica y trata enfermedades de la cavidad oral, contribuyendo a la salud integral del paciente.',
          campoLaboral: ['Consultorios privados', 'Hospitales', 'Clínicas dentales', 'Salud pública', 'Docencia'],
          especializaciones: ['Ortodoncia', 'Endodoncia', 'Cirugía maxilofacial', 'Odontopediatría'],
          instituciones: ['UNMSM', 'UPCH', 'USMP', 'URP', 'UIGV']
        },
        {
          nombre: 'Nutrición',
          icono: '🥗',
          descripcion: 'Promueve hábitos alimentarios saludables y diseña planes nutricionales para prevenir enfermedades.',
          campoLaboral: ['Hospitales', 'Clínicas', 'Deportes', 'Industria alimentaria', 'Consultoría privada'],
          especializaciones: ['Nutrición clínica', 'Nutrición deportiva', 'Salud pública', 'Industria de alimentos'],
          instituciones: ['UNMSM', 'UPCH', 'UPC', 'USMP', 'URP']
        }
      ]
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias Sociales',
      icono: '⚖️', dims: ['DIM-01', 'DIM-04'], duracion: '5 años',
      descripcion: 'Carreras centradas en el estudio de la sociedad, el derecho, la educación y la comunicación.',
      carreras: [
        {
          nombre: 'Derecho',
          icono: '⚖️',
          descripcion: 'Estudia el ordenamiento jurídico para defender derechos, asesorar legalmente y administrar justicia.',
          campoLaboral: ['Estudio de abogados', 'Sector público', 'Empresas privadas', 'Poder Judicial', 'ONGs'],
          especializaciones: ['Derecho corporativo', 'Derecho penal', 'Derecho laboral', 'Derecho tributario', 'Derecho internacional'],
          instituciones: ['PUCP', 'UNMSM', 'USMP', 'URP', 'San Martín de Porres']
        },
        {
          nombre: 'Educación',
          icono: '📚',
          descripcion: 'Forma profesionales para el diseño y aplicación de procesos de enseñanza-aprendizaje en todos los niveles.',
          campoLaboral: ['Colegios públicos', 'Colegios privados', 'Universidades', 'Institutos', 'ONGs educativas'],
          especializaciones: ['Educación inicial', 'Educación primaria', 'Educación secundaria', 'Gestión educativa'],
          instituciones: ['PUCP', 'UNMSM', 'UNFV', 'UNE (La Cantuta)', 'San Agustín']
        },
        {
          nombre: 'Comunicaciones',
          icono: '📡',
          descripcion: 'Gestiona la producción y difusión de contenidos en medios de comunicación, publicidad y relaciones públicas.',
          campoLaboral: ['Medios de comunicación', 'Agencias de publicidad', 'Empresas', 'ONGs', 'Sector público'],
          especializaciones: ['Periodismo', 'Publicidad', 'Relaciones públicas', 'Producción audiovisual', 'Comunicación digital'],
          instituciones: ['PUCP', 'UNMSM', 'USMP', 'UPC', 'San Martín de Porres']
        },
        {
          nombre: 'Trabajo Social',
          icono: '🤝',
          descripcion: 'Promueve el bienestar de personas y comunidades vulnerables mediante intervención social y gestión de recursos.',
          campoLaboral: ['ONGs', 'Sector público', 'Hospitales', 'Empresas (RR.HH.)', 'Municipalidades'],
          especializaciones: ['Desarrollo comunitario', 'Salud social', 'Familia y niñez', 'Gestión social'],
          instituciones: ['UNMSM', 'PUCP', 'UNFV', 'San Marcos', 'Institutos superiores']
        }
      ]
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Ciencias Económicas',
      icono: '📊', dims: ['DIM-01', 'DIM-03'], duracion: '5 años',
      descripcion: 'Formación en gestión empresarial, finanzas, economía y comercio para el sector público y privado.',
      carreras: [
        {
          nombre: 'Administración de Empresas',
          icono: '🏢',
          descripcion: 'Planifica, organiza y dirige recursos humanos, financieros y operativos para alcanzar los objetivos empresariales.',
          campoLaboral: ['Empresas privadas', 'Sector público', 'Consultoría', 'Emprendimiento', 'Banca'],
          especializaciones: ['Marketing', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Comercio exterior'],
          instituciones: ['UNMSM', 'UP (Pacífico)', 'ESAN', 'UPC', 'USIL']
        },
        {
          nombre: 'Economía',
          icono: '📈',
          descripcion: 'Analiza el comportamiento de mercados, políticas económicas y el uso eficiente de recursos en una sociedad.',
          campoLaboral: ['Banca central', 'Ministerios', 'Empresas financieras', 'Consultoría', 'Organismos internacionales'],
          especializaciones: ['Economía financiera', 'Economía pública', 'Econometría', 'Economía internacional'],
          instituciones: ['UNMSM', 'PUCP', 'UP (Pacífico)', 'UPC', 'ESAN']
        },
        {
          nombre: 'Contabilidad',
          icono: '🧾',
          descripcion: 'Registra, analiza e interpreta la información financiera de las organizaciones para la toma de decisiones.',
          campoLaboral: ['Empresas privadas', 'Firmas auditoras', 'Sector público', 'Bancos', 'Emprendimiento'],
          especializaciones: ['Auditoría', 'Tributación', 'Contabilidad de costos', 'Finanzas corporativas'],
          instituciones: ['UNMSM', 'UPC', 'USMP', 'San Martín de Porres', 'URP']
        },
        {
          nombre: 'Negocios Internacionales',
          icono: '🌍',
          descripcion: 'Gestiona operaciones de comercio exterior, inversión extranjera y relaciones comerciales entre países.',
          campoLaboral: ['Comercio exterior', 'Empresas exportadoras', 'Aduanas', 'Banca internacional', 'Consultoría'],
          especializaciones: ['Logística internacional', 'Comercio exterior', 'Gestión aduanera', 'Marketing internacional'],
          instituciones: ['UNMSM', 'UPC', 'USIL', 'San Martín de Porres', 'ESAN']
        }
      ]
    },
    {
      categoria: 'UNIVERSITARIA', subcategoria: 'Humanidades y Artes',
      icono: '🎨', dims: ['DIM-01', 'DIM-04'], duracion: '5 años',
      descripcion: 'Carreras creativas y humanísticas orientadas a la cultura, el diseño, la filosofía y la expresión artística.',
      carreras: [
        {
          nombre: 'Arquitectura',
          icono: '🏛️',
          descripcion: 'Diseña espacios habitables que integran funcionalidad, estética y sostenibilidad para mejorar la calidad de vida.',
          campoLaboral: ['Estudios de arquitectura', 'Inmobiliarias', 'Sector público', 'Diseño de interiores', 'Docencia'],
          especializaciones: ['Arquitectura sostenible', 'Urbanismo', 'Diseño de interiores', 'Gestión de proyectos'],
          instituciones: ['PUCP', 'UPC', 'UPN', 'UNMSM', 'Ricardo Palma']
        },
        {
          nombre: 'Diseño Gráfico',
          icono: '🎨',
          descripcion: 'Crea y comunica mensajes visuales mediante el manejo creativo de imágenes, tipografía y medios digitales.',
          campoLaboral: ['Agencias de publicidad', 'Empresas tecnológicas', 'Medios de comunicación', 'Freelance', 'ONGs'],
          especializaciones: ['Diseño UX/UI', 'Branding', 'Motion Graphics', 'Ilustración digital', 'Fotografía'],
          instituciones: ['PUCP', 'UPC', 'ISIL', 'Toulouse Lautrec', 'Corriente Alterna']
        },
        {
          nombre: 'Literatura',
          icono: '📖',
          descripcion: 'Estudia y analiza las obras literarias para desarrollar pensamiento crítico, escritura creativa y comunicación.',
          campoLaboral: ['Editoriales', 'Medios de comunicación', 'Docencia', 'Cultura', 'ONGs culturales'],
          especializaciones: ['Literatura hispanoamericana', 'Lingüística', 'Edición', 'Creación literaria', 'Traducción'],
          instituciones: ['PUCP', 'UNMSM', 'UNFV', 'Ricardo Palma', 'San Marcos']
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    //  TÉCNICA
    // ══════════════════════════════════════════════════════════
    {
      categoria: 'TECNICA', subcategoria: 'Tecnología',
      icono: '🖥️', dims: ['DIM-02', 'DIM-03'], duracion: '2-3 años',
      descripcion: 'Formación técnica en desarrollo de software, redes y seguridad informática. Alta empleabilidad.',
      carreras: [
        {
          nombre: 'Desarrollo de Software',
          icono: '💾',
          descripcion: 'Crea y mantiene aplicaciones web, móviles y de escritorio usando lenguajes de programación modernos.',
          campoLaboral: ['Empresas de software', 'Startups', 'Freelance', 'Banca', 'Retail digital'],
          especializaciones: ['Frontend', 'Backend', 'Mobile (Android/iOS)', 'Full Stack', 'QA Testing'],
          instituciones: ['Cibertec', 'ISIL', 'Tecsup', 'Zegel', 'SENATI']
        },
        {
          nombre: 'Redes y Comunicaciones',
          icono: '🌐',
          descripcion: 'Instala, configura y administra infraestructura de redes, servidores y sistemas de telecomunicaciones.',
          campoLaboral: ['ISPs', 'Empresas de telecomunicaciones', 'Sector bancario', 'Hospitales', 'Sector público'],
          especializaciones: ['Cisco CCNA', 'Administración de servidores', 'Seguridad de redes', 'VoIP'],
          instituciones: ['Cibertec', 'SENATI', 'Tecsup', 'ISIL', 'IDAT']
        },
        {
          nombre: 'Ciberseguridad',
          icono: '🛡️',
          descripcion: 'Protege sistemas informáticos y datos de ataques, vulnerabilidades y amenazas digitales.',
          campoLaboral: ['Bancos', 'Empresas de TI', 'Gobierno', 'Consultoría de seguridad', 'Startups'],
          especializaciones: ['Ethical hacking', 'Análisis forense digital', 'Seguridad en la nube', 'Criptografía'],
          instituciones: ['Cibertec', 'ISIL', 'Tecsup', 'Zegel', 'IDAT']
        },
        {
          nombre: 'Soporte Técnico',
          icono: '🔧',
          descripcion: 'Brinda asistencia técnica en hardware, software y redes para usuarios y organizaciones.',
          campoLaboral: ['Empresas de TI', 'Sector público', 'Hospitales', 'Educación', 'Retail'],
          especializaciones: ['Help Desk', 'Administración Windows/Linux', 'Virtualización', 'Cloud básico'],
          instituciones: ['SENATI', 'Cibertec', 'IDAT', 'Zegel', 'Institutos públicos']
        }
      ]
    },
    {
      categoria: 'TECNICA', subcategoria: 'Industrial y Mecánica',
      icono: '🔩', dims: ['DIM-02'], duracion: '2-3 años',
      descripcion: 'Formación práctica en mecánica, electricidad y mantenimiento industrial. Alta demanda en minería y manufactura.',
      carreras: [
        {
          nombre: 'Mecánica Automotriz',
          icono: '🚗',
          descripcion: 'Diagnostica y repara vehículos de combustión y eléctricos, aplicando tecnología de diagnóstico electrónico.',
          campoLaboral: ['Concesionarias', 'Talleres automotrices', 'Empresas de transporte', 'Minería', 'Sector público'],
          especializaciones: ['Electrónica automotriz', 'Vehículos eléctricos', 'Diagnóstico computarizado', 'Pintura automotriz'],
          instituciones: ['SENATI', 'Tecsup', 'CFP', 'CETPRO', 'Institutos técnicos regionales']
        },
        {
          nombre: 'Electricidad Industrial',
          icono: '⚡',
          descripcion: 'Instala, mantiene y repara sistemas eléctricos industriales, tableros de control y equipos de alta tensión.',
          campoLaboral: ['Industria', 'Minería', 'Construcción', 'Sector público', 'Plantas industriales'],
          especializaciones: ['Alta tensión', 'PLC y automatización', 'Energías renovables', 'Instalaciones eléctricas'],
          instituciones: ['SENATI', 'Tecsup', 'SENCICO', 'CFP', 'Institutos públicos']
        },
        {
          nombre: 'Mantenimiento Industrial',
          icono: '🏗️',
          descripcion: 'Garantiza el funcionamiento óptimo de maquinaria y equipos industriales mediante mantenimiento preventivo y correctivo.',
          campoLaboral: ['Manufactura', 'Minería', 'Industria pesquera', 'Plásticos', 'Alimentos'],
          especializaciones: ['Mantenimiento predictivo', 'Neumática', 'Hidráulica', 'Soldadura industrial'],
          instituciones: ['SENATI', 'Tecsup', 'CFP', 'SENCICO', 'Institutos técnicos']
        }
      ]
    },
    {
      categoria: 'TECNICA', subcategoria: 'Salud Técnica',
      icono: '🏥', dims: ['DIM-02', 'DIM-04'], duracion: '3 años',
      descripcion: 'Formación técnica en salud para apoyar a profesionales médicos en hospitales, clínicas y farmacias.',
      carreras: [
        {
          nombre: 'Enfermería Técnica',
          icono: '🩹',
          descripcion: 'Asiste al enfermero y médico en el cuidado del paciente, aplicando procedimientos de salud básicos.',
          campoLaboral: ['Hospitales', 'Clínicas', 'Centros de salud', 'Hogares de ancianos', 'Atención domiciliaria'],
          especializaciones: ['Cuidados del paciente', 'Urgencias y emergencias', 'Salud materno-infantil'],
          instituciones: ['Institutos tecnológicos públicos', 'SIAT', 'ESSALUD', 'Institutos privados acreditados']
        },
        {
          nombre: 'Laboratorio Clínico',
          icono: '🧪',
          descripcion: 'Realiza análisis de muestras biológicas para apoyar el diagnóstico médico en laboratorios clínicos.',
          campoLaboral: ['Hospitales', 'Clínicas', 'Laboratorios privados', 'Centros de diagnóstico', 'Bancos de sangre'],
          especializaciones: ['Hematología', 'Microbiología', 'Bioquímica clínica', 'Banco de sangre'],
          instituciones: ['Institutos tecnológicos públicos', 'SIAT', 'Institutos privados acreditados']
        },
        {
          nombre: 'Farmacia',
          icono: '💊',
          descripcion: 'Dispensa, almacena y asesora sobre medicamentos garantizando el uso seguro y eficaz de los fármacos.',
          campoLaboral: ['Farmacias y boticas', 'Hospitales', 'Clínicas', 'Laboratorios farmacéuticos', 'Droguerías'],
          especializaciones: ['Farmacia hospitalaria', 'Atención farmacéutica', 'Control de calidad'],
          instituciones: ['Institutos tecnológicos', 'SIAT', 'Farma escuelas privadas']
        },
        {
          nombre: 'Prótesis Dental',
          icono: '🦷',
          descripcion: 'Fabrica y repara prótesis dentales y aparatos de ortodoncia según indicaciones del odontólogo.',
          campoLaboral: ['Laboratorios dentales', 'Consultorios odontológicos', 'Clínicas dentales', 'Sector privado'],
          especializaciones: ['Prótesis fija', 'Prótesis removible', 'Ortodoncia técnica', 'Implantología técnica'],
          instituciones: ['Institutos tecnológicos privados', 'SIAT', 'UIGV técnica']
        }
      ]
    },
    {
      categoria: 'TECNICA', subcategoria: 'Administración y Comercio',
      icono: '📋', dims: ['DIM-02'], duracion: '2-3 años',
      descripcion: 'Formación técnica en gestión empresarial, contabilidad y marketing digital.',
      carreras: [
        {
          nombre: 'Contabilidad Técnica',
          icono: '📒',
          descripcion: 'Registra y procesa información contable y tributaria para la toma de decisiones en empresas.',
          campoLaboral: ['Empresas privadas', 'Estudios contables', 'Sector público', 'Comercio', 'Industria'],
          especializaciones: ['Contabilidad digital', 'Tributación', 'Planillas', 'Costos empresariales'],
          instituciones: ['ISIL', 'Cibertec', 'IPP', 'Zegel', 'SISE']
        },
        {
          nombre: 'Administración Bancaria',
          icono: '🏦',
          descripcion: 'Opera y gestiona servicios financieros en instituciones bancarias y entidades de crédito.',
          campoLaboral: ['Bancos', 'Cajas municipales', 'Cooperativas', 'Financieras', 'Microfinanzas'],
          especializaciones: ['Atención al cliente bancario', 'Créditos y cobranzas', 'Seguros', 'Banca digital'],
          instituciones: ['ISIL', 'Cibertec', 'Zegel', 'IPP', 'SISE']
        },
        {
          nombre: 'Marketing Digital',
          icono: '📱',
          descripcion: 'Diseña y ejecuta estrategias de marketing en canales digitales para incrementar ventas y posicionamiento de marca.',
          campoLaboral: ['Agencias digitales', 'Empresas de retail', 'Startups', 'E-commerce', 'Freelance'],
          especializaciones: ['Community management', 'SEO/SEM', 'Email marketing', 'Analítica web', 'E-commerce'],
          instituciones: ['ISIL', 'Cibertec', 'IPP', 'Zegel', 'SISE']
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    //  FUERZAS ARMADAS
    // ══════════════════════════════════════════════════════════
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Ejército',
      icono: '🎖️', dims: ['DIM-05', 'DIM-06'], duracion: '3-5 años',
      descripcion: 'Formación como Oficial o Suboficial del Ejército del Perú para la defensa nacional.',
      carreras: [
        {
          nombre: 'Oficial del Ejército del Perú',
          icono: '⭐',
          descripcion: 'Lidera unidades militares terrestres en operaciones de defensa nacional, emergencias y misiones internacionales.',
          campoLaboral: ['Defensa nacional', 'Inteligencia militar', 'Logística militar', 'Misiones ONU', 'Gestión de desastres'],
          especializaciones: ['Infantería', 'Artillería', 'Inteligencia', 'Ingeniería militar', 'Comunicaciones'],
          instituciones: ['Escuela Militar de Chorrillos', 'CAEN']
        },
        {
          nombre: 'Suboficial del Ejército del Perú',
          icono: '🎗️',
          descripcion: 'Ejecuta misiones operativas y de apoyo en unidades del Ejército bajo mando de oficiales.',
          campoLaboral: ['Operaciones militares', 'Logística', 'Sanidad militar', 'Comunicaciones', 'Policía Militar'],
          especializaciones: ['Infantería', 'Transmisiones', 'Sanidad', 'Intendencia', 'Artillería'],
          instituciones: ['IESTPE - Escuela de Suboficiales']
        }
      ]
    },
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Marina',
      icono: '⚓', dims: ['DIM-05', 'DIM-06'], duracion: '3-5 años',
      descripcion: 'Formación como Oficial o Suboficial de la Marina de Guerra del Perú.',
      carreras: [
        {
          nombre: 'Oficial de la Marina de Guerra',
          icono: '🚢',
          descripcion: 'Comanda embarcaciones y dirige operaciones navales para la defensa marítima y fluvial del Perú.',
          campoLaboral: ['Defensa marítima', 'Operaciones navales', 'Guardacostas', 'Puertos', 'Misiones ONU'],
          especializaciones: ['Navegación', 'Ingeniería naval', 'Infantería de Marina', 'Inteligencia naval'],
          instituciones: ['Escuela Naval del Perú']
        },
        {
          nombre: 'Suboficial de la Marina de Guerra',
          icono: '⚓',
          descripcion: 'Apoya operaciones navales y de guardacostas en funciones técnicas y operativas.',
          campoLaboral: ['Operaciones navales', 'Mantenimiento naval', 'Guardacostas', 'Logística', 'Comunicaciones'],
          especializaciones: ['Mecánica naval', 'Electricidad', 'Comunicaciones', 'Sanidad', 'Artillería naval'],
          instituciones: ['CITEN - Centro de Instrucción Técnica Naval']
        }
      ]
    },
    {
      categoria: 'FUERZAS_ARMADAS', subcategoria: 'Fuerza Aérea',
      icono: '✈️', dims: ['DIM-05', 'DIM-06'], duracion: '3-5 años',
      descripcion: 'Formación como Oficial o Suboficial de la Fuerza Aérea del Perú.',
      carreras: [
        {
          nombre: 'Oficial de la FAP',
          icono: '🛩️',
          descripcion: 'Pilotea aeronaves militares y lidera operaciones aéreas de defensa, reconocimiento y apoyo humanitario.',
          campoLaboral: ['Aviación militar', 'Defensa aérea', 'Logística aérea', 'Rescate y emergencias', 'Misiones ONU'],
          especializaciones: ['Piloto militar', 'Control aéreo', 'Inteligencia aérea', 'Ingeniería aeronáutica'],
          instituciones: ['Escuela de Oficiales FAP']
        },
        {
          nombre: 'Suboficial de la FAP',
          icono: '🔧',
          descripcion: 'Mantiene y opera equipos aeronáuticos, sistemas de armamento y apoyo a las operaciones aéreas.',
          campoLaboral: ['Mantenimiento aeronáutico', 'Control de tráfico aéreo', 'Logística aérea', 'Comunicaciones'],
          especializaciones: ['Mantenimiento aeronáutico', 'Electrónica', 'Armamento', 'Meteorología'],
          instituciones: ['ESOFA - Escuela de Suboficiales FAP']
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    //  POLICIAL
    // ══════════════════════════════════════════════════════════
    {
      categoria: 'POLICIAL', subcategoria: 'Oficiales PNP',
      icono: '👮', dims: ['DIM-04', 'DIM-05', 'DIM-06'], duracion: '5 años',
      descripcion: 'Formación como Oficial de la Policía Nacional del Perú para liderar unidades policiales.',
      carreras: [
        {
          nombre: 'Oficial de la Policía Nacional del Perú',
          icono: '🚔',
          descripcion: 'Lidera unidades policiales para garantizar la seguridad ciudadana, investigar delitos y mantener el orden público.',
          campoLaboral: ['Seguridad ciudadana', 'Investigación criminal', 'Orden público', 'Inteligencia policial', 'Tránsito'],
          especializaciones: ['Investigación criminal', 'Orden público', 'Inteligencia policial', 'Tránsito', 'Antidrogas'],
          instituciones: ['Escuela de Oficiales PNP (EO-PNP)']
        }
      ]
    },
    {
      categoria: 'POLICIAL', subcategoria: 'Suboficiales PNP',
      icono: '🚓', dims: ['DIM-04', 'DIM-05', 'DIM-06'], duracion: '3 años',
      descripcion: 'Formación como Suboficial de la Policía Nacional del Perú para operaciones de patrullaje y seguridad.',
      carreras: [
        {
          nombre: 'Suboficial de la Policía Nacional del Perú',
          icono: '🛡️',
          descripcion: 'Ejecuta operaciones de patrullaje, control de tránsito y seguridad comunitaria en contacto directo con la ciudadanía.',
          campoLaboral: ['Patrullaje urbano', 'Control de tránsito', 'Seguridad comunitaria', 'Protección de instalaciones'],
          especializaciones: ['Patrullaje', 'Tránsito', 'Criminalística', 'Protección de personas', 'Serenazgo'],
          instituciones: ['Escuelas Técnico Superiores PNP (ETS-PNP)']
        }
      ]
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
     SUBCATEGORÍAS VÁLIDAS POR CATEGORÍA RESULTANTE
     Fuente: definición del cliente en base al Excel
     Controla qué subcategorías del catálogo se muestran
     para cada resultado de las reglas R-001 a R-010
  ============================================================ */
  const SUBCATS_POR_CATEGORIA = {
    'UNIVERSITARIA': [
      'Ciencias e Ingeniería', 'Ciencias de la Salud',
      'Ciencias Sociales', 'Ciencias Económicas', 'Humanidades y Artes'
    ],
    'TECNICA': [
      'Tecnología', 'Industrial y Mecánica',
      'Salud Técnica', 'Administración y Comercio'
    ],
    'FUERZAS_ARMADAS': [
      'Ejército', 'Marina', 'Fuerza Aérea'
    ],
    'POLICIAL': [
      'Oficiales PNP', 'Suboficiales PNP'
    ],
    'UNIVERSITARIA_TECNICA': [
      'Ciencias e Ingeniería', 'Ciencias de la Salud',
      'Ciencias Sociales', 'Ciencias Económicas', 'Humanidades y Artes',
      'Tecnología', 'Industrial y Mecánica',
      'Salud Técnica', 'Administración y Comercio'
    ],
    'UNIVERSITARIA_SOCIAL': [
      'Ciencias Sociales', 'Ciencias Económicas', 'Humanidades y Artes'
    ],
    'UNIVERSITARIA_CIENCIAS': [
      'Ciencias e Ingeniería', 'Ciencias de la Salud'
    ],
    // Para MÚLTIPLE, INDETERMINADO y DEFAULT → todas las subcategorías
    'MULTIPLE':      null,
    'INDETERMINADO': null,
    'DEFAULT':       null
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
    getSubcatsPorCategoria: (cat) => SUBCATS_POR_CATEGORIA[cat] || null,
    getCatalogoPorSubcats: (subcats) => {
      if (!subcats) return [...CATALOGO];
      return CATALOGO.filter(c => subcats.includes(c.subcategoria));
    },
    getEtiquetaCategoria: (cat) => ETIQUETAS_CATEGORIA[cat] || ETIQUETAS_CATEGORIA['DEFAULT'],
    getTotalItems:        () => ITEMS.length,
    VERSION: '1.0.0'
  };

})();
