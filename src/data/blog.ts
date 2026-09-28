import type { BlogPost } from '@/features/blog'
import { IMAGES } from './images'

const AUTHOR = 'Redacción Sabor Cubano'

/* Artículos de ejemplo. Los restaurantes mencionados son demo. */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-sandwich',
    slug: 'sandwich-cubano-capa-por-capa',
    title: 'El sándwich cubano, capa por capa',
    excerpt:
      'Pan, cerdo, jamón, queso, pepinillo y mostaza. Por qué el orden y la plancha importan.',
    category: 'platillos',
    cover: IMAGES.sandwichCubano,
    publishedAt: '2026-09-18',
    readingMinutes: 4,
    author: AUTHOR,
    relatedDishIds: ['sandwich-cubano', 'croquetas'],
    body: [
      {
        type: 'paragraph',
        text: 'El sándwich cubano nació del ir y venir entre La Habana y las comunidades cubanas de Florida a principios del siglo XX. Trabajadores de fábricas de tabaco lo llevaban como almuerzo: barato, completo y fácil de transportar.',
      },
      { type: 'heading', text: 'Lo que lleva' },
      {
        type: 'list',
        items: [
          'Pan cubano: corteza delgada y miga suave, hecho con manteca.',
          'Cerdo asado marinado en mojo.',
          'Jamón dulce.',
          'Queso suizo.',
          'Pepinillos en rebanadas y mostaza amarilla.',
        ],
      },
      { type: 'heading', text: 'La plancha lo es todo' },
      {
        type: 'paragraph',
        text: 'Se prensa con una plancha caliente hasta que el pan queda plano y crujiente y el queso se funde entre las capas. Si el pan no cruje, no es cubano.',
      },
      {
        type: 'quote',
        text: 'La medianoche es su versión nocturna: mismos ingredientes, pero en pan dulce de huevo.',
      },
    ],
  },
  {
    id: 'b-ropa-vieja',
    slug: 'ropa-vieja-historia',
    title: 'Ropa vieja: el guiso con nombre de leyenda',
    excerpt: 'De las Islas Canarias a la mesa cubana: la historia detrás del plato nacional.',
    category: 'platillos',
    cover: IMAGES.platoCubano,
    publishedAt: '2026-09-10',
    readingMinutes: 5,
    author: AUTHOR,
    relatedDishIds: ['ropa-vieja', 'congri', 'frijoles-negros'],
    body: [
      {
        type: 'paragraph',
        text: 'La ropa vieja llegó a Cuba con los inmigrantes canarios. Allá se preparaba con las sobras del cocido; en la isla se convirtió en un plato propio, hecho con falda de res.',
      },
      {
        type: 'paragraph',
        text: 'Cuenta la leyenda que un hombre sin dinero cocinó su ropa vieja con mucho cariño y el guiso se transformó en carne. El nombre, en realidad, describe cómo se ve: hebras de carne como tela deshilachada.',
      },
      { type: 'heading', text: 'Cómo se prepara' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Se cuece la carne con laurel hasta que se deshace.',
          'Se deshebra a mano, siguiendo la fibra.',
          'Se guisa en sofrito de cebolla, ajo, pimiento y tomate, con un chorrito de vino seco.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Se sirve con arroz blanco, frijoles negros y plátano maduro frito. Pídela así la primera vez.',
      },
    ],
  },
  {
    id: 'b-congri',
    slug: 'congri-o-moros-y-cristianos',
    title: 'Congrí o moros y cristianos: qué los diferencia',
    excerpt:
      'Dos nombres para el arroz con frijoles más famoso de Cuba, y por qué no siempre son lo mismo.',
    category: 'platillos',
    cover: IMAGES.congri,
    publishedAt: '2026-08-29',
    readingMinutes: 3,
    author: AUTHOR,
    relatedDishIds: ['congri', 'frijoles-negros'],
    body: [
      {
        type: 'paragraph',
        text: 'En ambos casos el arroz se cocina junto con los frijoles y su caldo, no por separado. Eso es lo que le da color y sabor.',
      },
      { type: 'heading', text: 'La diferencia está en el frijol' },
      {
        type: 'paragraph',
        text: 'En el oriente de Cuba, el congrí se hace con frijoles colorados. En el occidente, con frijoles negros, se le llama moros y cristianos. En muchas cartas ambos nombres se usan indistintamente.',
      },
      {
        type: 'paragraph',
        text: 'El sofrito con comino, ajo y a veces un poco de tocino es el que termina de definirlo.',
      },
    ],
  },
  {
    id: 'b-10-platillos',
    slug: '10-platillos-cubanos-que-tienes-que-probar',
    title: '10 platillos cubanos que tienes que probar',
    excerpt: 'Una lista para pedir sin dudar la próxima vez que entres a un restaurante cubano.',
    category: 'guias',
    cover: IMAGES.tablaTostones,
    publishedAt: '2026-08-15',
    readingMinutes: 6,
    author: AUTHOR,
    relatedDishIds: [
      'ropa-vieja',
      'sandwich-cubano',
      'congri',
      'tostones',
      'lechon-asado',
      'croquetas',
      'camarones-enchilados',
      'flan',
      'pastelitos-guayaba',
      'cafe-cubano',
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Si es tu primera vez, esta lista te sirve como carta de navegación. Están ordenados de lo más contundente a lo más dulce.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Ropa vieja: res deshebrada en sofrito.',
          'Lechón asado: cerdo marinado en naranja agria.',
          'Sándwich cubano: prensado y crujiente.',
          'Congrí: arroz con frijoles cocidos juntos.',
          'Tostones: plátano verde frito dos veces.',
          'Croquetas: pequeñas y muy cremosas.',
          'Camarones enchilados: salsa criolla, no picante.',
          'Flan de leche: firme y con caramelo oscuro.',
          'Pastelitos de guayaba: el antojo de media tarde.',
          'Café cubano: dulce, corto y con espumita.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Desde la ficha de cada platillo puedes ver qué restaurantes lo sirven.',
      },
    ],
  },
  {
    id: 'b-guia-merida',
    slug: 'guia-comida-cubana-en-merida',
    title: 'Guía de comida cubana en Mérida',
    excerpt: 'Dónde comer cubano en la ciudad según el momento del día y la zona.',
    category: 'guias',
    cover: IMAGES.merida,
    publishedAt: '2026-08-02',
    readingMinutes: 5,
    author: AUTHOR,
    relatedDishIds: ['cafe-cubano', 'ropa-vieja', 'sandwich-cubano'],
    body: [
      {
        type: 'paragraph',
        text: 'Mérida concentra la mayor oferta cubana de Yucatán. Esta guía usa los restaurantes demo del directorio para mostrar cómo se organiza la búsqueda por zona.',
      },
      { type: 'heading', text: 'Mañana: café y pastelitos en el norte' },
      {
        type: 'paragraph',
        text: 'Las cafeterías de ventanita abren temprano. Un cortadito con pastelito de guayaba es el desayuno rápido por excelencia.',
      },
      { type: 'heading', text: 'Mediodía: comida criolla en el Centro' },
      {
        type: 'paragraph',
        text: 'Los comedores familiares sirven menú del día con arroz, frijoles y maduros. Llega antes de las dos para encontrar mesa.',
      },
      { type: 'heading', text: 'Noche: cocina de autor y sándwiches de madrugada' },
      {
        type: 'paragraph',
        text: 'En García Ginerés hay propuestas que cruzan el mojo cubano con el recado yucateco. Para después, en Montejo, un cubano prensado hasta tarde.',
      },
    ],
  },
  {
    id: 'b-tradicional',
    slug: 'que-es-la-comida-cubana-tradicional',
    title: 'Qué es la comida cubana tradicional',
    excerpt: 'Raíces españolas, africanas y caribeñas en un mismo plato.',
    category: 'cultura',
    cover: IMAGES.congriHoja,
    publishedAt: '2026-07-20',
    readingMinutes: 4,
    author: AUTHOR,
    relatedDishIds: ['lechon-asado', 'tostones', 'frijoles-negros'],
    body: [
      {
        type: 'paragraph',
        text: 'La cocina cubana es criolla: mezcla técnicas españolas, ingredientes y sabores africanos y productos de la tierra caribeña como la yuca, el boniato y el plátano.',
      },
      { type: 'heading', text: 'La base: el sofrito' },
      {
        type: 'paragraph',
        text: 'Cebolla, ajo y pimiento cocidos lentamente en aceite. Casi todos los guisos parten de ahí.',
      },
      { type: 'heading', text: 'El sabor ácido: el mojo' },
      {
        type: 'paragraph',
        text: 'Naranja agria, ajo y comino. Se usa para marinar el cerdo y para bañar la yuca y los tostones.',
      },
      {
        type: 'paragraph',
        text: 'No es una cocina picante. El sabor viene de las especias suaves, el ácido y la cocción lenta.',
      },
    ],
  },
  {
    id: 'b-cubana-yucateca',
    slug: 'cocina-cubana-y-yucateca',
    title: 'Cocina cubana y yucateca: primas del Caribe',
    excerpt: 'Naranja agria, cerdo y plátano: lo que comparten y lo que las separa.',
    category: 'cultura',
    cover: IMAGES.cochinita,
    publishedAt: '2026-07-05',
    readingMinutes: 5,
    author: AUTHOR,
    relatedDishIds: ['lechon-asado', 'masas-de-cerdo', 'pescado-frito'],
    body: [
      {
        type: 'paragraph',
        text: 'Poco más de 200 kilómetros de mar separan el extremo occidental de Cuba de la península de Yucatán. Durante siglos hubo comercio y migración en ambas direcciones, y se nota en la mesa.',
      },
      { type: 'heading', text: 'Lo que comparten' },
      {
        type: 'list',
        items: [
          'La naranja agria para marinar el cerdo.',
          'El gusto por el cerdo asado lento: lechón en Cuba, cochinita en Yucatán.',
          'El plátano frito como acompañamiento.',
          'El pescado frito entero en la costa.',
        ],
      },
      { type: 'heading', text: 'Lo que las separa' },
      {
        type: 'paragraph',
        text: 'Yucatán usa recados con achiote y chiles como el habanero y el xcatic, con raíz maya. La cocina cubana es más suave y se apoya en el sofrito y el comino.',
      },
    ],
  },
]
