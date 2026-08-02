import type { TranslationStrings } from '../types';

const system_notice: TranslationStrings = {
  'system_notice.welcome_v1.title': 'Bienvenido a moon',
  'system_notice.welcome_v1.body':
    'Tu planificador de viajes todo en uno. Crea itinerarios, comparte viajes con amigos y mantente organizado, online o sin conexión.',
  'system_notice.welcome_v1.cta_label': 'Planificar un viaje',
  'system_notice.welcome_v1.hero_alt': 'Destino de viaje pintoresco con la interfaz de moon',
  'system_notice.welcome_v1.highlight_plan': 'Itinerarios día a día para cualquier viaje',
  'system_notice.welcome_v1.highlight_share': 'Colabora con tus compañeros de viaje',
  'system_notice.welcome_v1.highlight_offline': 'Funciona sin conexión en móvil',
  'system_notice.dev_test_modal.title': '[Dev] Test notice',
  'system_notice.dev_test_modal.body': 'This is a dev-only test notice.',
  'system_notice.thank_you_support.title': 'Gracias por usar moon',
  'system_notice.thank_you_support.body':
    'Un pequeño agradecimiento por instalar moon — de verdad significa mucho para mí.\n\nSoy un desarrollador independiente y construyo moon en mi tiempo libre. Empezó como una pequeña herramienta solo para mis propios viajes, y sinceramente me deja sin palabras todo el apoyo y el interés de la comunidad desde entonces. moon está hecho con mucho cariño de mi parte — pero también gracias a los muchos colaboradores externos increíbles que han ayudado a darle forma.\n\n**moon es open source y completamente gratuito — y seguirá siéndolo para siempre. Sin planes de pago, sin suscripciones, sin trampa. Te lo prometo.**\n\nSi moon te resulta útil y quieres apoyar su desarrollo, un pequeño café me ayuda de verdad a seguir construyendo — sin ninguna presión, pero cada taza mantiene vivas las noches en vela.\n\nGracias por estar aquí.\n\n— MooN',
  'system_notice.thank_you_support.highlight_opensource': '100% open source en GitHub',
  'system_notice.thank_you_support.highlight_free': 'Gratis para siempre — nunca habrá planes de pago',
  'system_notice.thank_you_support.highlight_community': 'Construido junto a la comunidad',
  'system_notice.thank_you_support.cta_bmc': 'Visit MooN on GitHub',
  'system_notice.thank_you_support.cta_github': 'Apóyame en github.com',
  'system_notice.pager.prev': 'Aviso anterior',
  'system_notice.pager.next': 'Siguiente aviso',
  'system_notice.pager.counter': '{current} / {total}',
  'system_notice.pager.goto': 'Ir al aviso {n}',
  'system_notice.pager.position': 'Aviso {current} de {total}',
  'system_notice.v3_photos.title': 'Las fotos se han movido en 3.0',
  'system_notice.v3_photos.body':
    '**Fotos** en el Planificador de Viajes han sido eliminadas. Tus fotos están a salvo — moon nunca modificó tu biblioteca de Immich o Synology.\n\nLas fotos ahora viven en el addon **Journey**. Journey es opcional — si aún no está disponible, pide a tu admin que lo active en Admin → Complementos.',
  'system_notice.v3_journey.title': 'Conoce Journey — diario de viaje',
  'system_notice.v3_journey.body':
    'Documenta tus viajes como historias enriquecidas con cronologías, galerías de fotos y mapas interactivos.',
  'system_notice.v3_journey.cta_label': 'Abrir Journey',
  'system_notice.v3_journey.highlight_timeline': 'Cronología y galería por día',
  'system_notice.v3_journey.highlight_photos': 'Importar desde Immich o Synology',
  'system_notice.v3_journey.highlight_share': 'Compartir públicamente — sin inicio de sesión',
  'system_notice.v3_journey.highlight_export': 'Exportar como libro de fotos PDF',
  'system_notice.v3_features.title': 'Más novedades en 3.0',
  'system_notice.v3_features.body': 'Otras cosas que vale la pena conocer de esta versión.',
  'system_notice.v3_features.highlight_dashboard': 'Rediseño del panel mobile-first',
  'system_notice.v3_features.highlight_offline': 'Modo sin conexión completo como PWA',
  'system_notice.v3_features.highlight_search': 'Autocompletado de lugares en tiempo real',
  'system_notice.v3_features.highlight_import': 'Importar lugares desde archivos KMZ/KML',
  'system_notice.v3_mcp.title': 'MCP: actualización OAuth 2.1',
  'system_notice.v3_mcp.body':
    'La integración MCP ha sido completamente renovada. OAuth 2.1 es ahora el método de autenticación recomendado. Los tokens estáticos (moon_…) están obsoletos y se eliminarán en una versión futura.',
  'system_notice.v3_mcp.highlight_oauth': 'OAuth 2.1 recomendado (mcp-remote)',
  'system_notice.v3_mcp.highlight_scopes': '24 ámbitos de permisos granulares',
  'system_notice.v3_mcp.highlight_deprecated': 'Tokens estáticos moon_ obsoletos',
  'system_notice.v3_mcp.highlight_tools': 'Herramientas y prompts ampliados',
  'system_notice.v3_thankyou.title': 'Una nota personal de mi parte',
  'system_notice.v3_thankyou.body':
    'Antes de seguir — quiero tomarme un momento.\n\nmoon empezó como un proyecto personal que construí para mis propios viajes. Nunca imaginé que crecería hasta convertirse en algo en lo que 4.000 de vosotros confían para planificar sus aventuras. Cada estrella, cada issue, cada solicitud de funcionalidad — los leo todos, y son lo que me mantiene en pie durante las noches largas entre un trabajo a jornada completa y la universidad.\n\nQuiero que sepáis: moon siempre será open source, siempre self-hosted, siempre vuestro. Sin rastreo, sin suscripciones, sin letra pequeña. Solo una herramienta hecha por alguien que ama viajar tanto como vosotros.\n\nUn agradecimiento especial a [MooN](https://github.com/MooN) — te has convertido en un colaborador increíble. Mucho de lo que hace grande la versión 3.0 lleva tu huella. Gracias por creer en este proyecto cuando todavía era un borrador.\n\nY a cada uno de vosotros que reportó un bug, tradujo un texto, compartió moon con un amigo o simplemente lo usó para planificar un viaje — **gracias**. Vosotros sois la razón de que esto exista.\n\nPor muchas más aventuras juntos.\n\n— MooN\n\n---\n\n[Únete a la comunidad en Discord](https://discord.gg/7Q6M6jDwzf)\n\nSi moon mejora tus viajes, un [pequeño café](https://github.com/schowdary75) siempre mantiene las luces encendidas.',
  'system_notice.v3014_whitespace_collision.title': 'Acción requerida: conflicto de cuenta de usuario',
  'system_notice.v3014_whitespace_collision.body':
    'La actualización 3.0.14 detectó uno o más conflictos de nombre de usuario o correo electrónico causados por espacios en blanco al inicio o al final de los valores almacenados. Las cuentas afectadas se renombraron automáticamente. Revisa los registros del servidor en busca de líneas que empiecen por **[migration] WHITESPACE COLLISION** para identificar qué cuentas necesitan revisión.',
};
export default system_notice;
