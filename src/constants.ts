import { Recommendation, User, Notification, PlanType, Client, InternalChat } from "./types";

export const USERS: User[] = [
  {
    id: "u1",
    name: "Carlos Rodríguez",
    email: "carlos@smartcrm.com",
    role: "Admin",
    plan: "Macro",
    salesCount: 45,
    closedRevenue: 12500000,
    points: 4500,
    avatar: "CR",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a1", title: "Cerrador Maestro", description: "Cierra 10 ventas en un mes", icon: "🏆", unlockedAt: "2024-03-01" },
      { id: "a2", title: "Madrugador", description: "Primer contacto antes de las 8 AM", icon: "☀️", unlockedAt: "2024-03-15" }
    ],
    medals: [
      { id: "m1", type: "oro", title: "Top Ventas Marzo", date: "2024-03-31" },
      { id: "m2", type: "plata", title: "Eficiencia de Cierre", date: "2024-02-28" }
    ]
  },
  {
    id: "u2",
    name: "Ana Martínez",
    email: "ana@smartcrm.com",
    role: "Vendedor",
    plan: "Pyme",
    salesCount: 32,
    closedRevenue: 8400000,
    points: 3200,
    avatar: "AM",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a3", title: "Persistente", description: "Realiza 5 seguimientos a un mismo lead", icon: "🔥", unlockedAt: "2024-04-01" }
    ],
    medals: [
      { id: "m3", type: "plata", title: "Top Ventas Marzo", date: "2024-03-31" }
    ]
  },
  {
    id: "u3",
    name: "Juan Pérez",
    email: "juan@smartcrm.com",
    role: "Vendedor",
    plan: "Pyme",
    salesCount: 28,
    closedRevenue: 6200000,
    points: 2800,
    avatar: "JP",
    hasSeenOnboarding: true,
    achievements: [],
    medals: [
      { id: "m4", type: "bronce", title: "Top Ventas Marzo", date: "2024-03-31" }
    ]
  }
];

export const INTERNAL_CHATS: InternalChat[] = [
  {
    id: "ic1",
    name: "Ana Martínez",
    type: "individual",
    participants: ["u1", "u2"],
    lastMessage: "Carlos, ¿viste el lead de Juan Valdez?",
    lastMessageTime: "10:30 AM",
    avatar: "AM",
    messages: [
      { id: "im1", senderId: "u2", text: "Hola Carlos, ¿cómo vas?", timestamp: "2024-04-12T10:00:00Z" },
      { id: "im2", senderId: "u1", text: "Todo bien Ana, ¿tú?", timestamp: "2024-04-12T10:05:00Z" },
      { id: "im3", senderId: "u2", text: "Carlos, ¿viste el lead de Juan Valdez? Ya cerró el trato.", timestamp: "2024-04-12T10:30:00Z" }
    ]
  },
  {
    id: "ic2",
    name: "Equipo de Ventas",
    type: "group",
    participants: ["u1", "u2", "u3", "u4", "u5"],
    lastMessage: "¡Excelente cierre de mes equipo!",
    lastMessageTime: "Ayer",
    avatar: "EV",
    messages: [
      { id: "im4", senderId: "u1", text: "¡Excelente cierre de mes equipo! Superamos la meta.", timestamp: "2024-04-11T18:00:00Z" },
      { id: "im5", senderId: "u3", text: "¡Genial! Vamos por más en mayo.", timestamp: "2024-04-11T18:10:00Z" }
    ]
  },
  {
    id: "ic3",
    name: "Juan Pérez",
    type: "individual",
    participants: ["u1", "u3"],
    lastMessage: "Necesito ayuda con una propuesta.",
    lastMessageTime: "09:15 AM",
    avatar: "JP",
    messages: [
      { id: "im6", senderId: "u3", text: "Hola Carlos, necesito ayuda con una propuesta para un cliente de ferretería.", timestamp: "2024-04-12T09:15:00Z" }
    ]
  }
];

export const PLANS = [
  {
    id: "basic",
    name: "Básico" as PlanType,
    priceUSD: 0,
    priceCOP: 0,
    features: ["Hasta 50 clientes", "Pipeline básico", "Dashboard simple"],
    buttonText: "Plan Actual",
    isCurrent: false
  },
  {
    id: "pyme",
    name: "Pyme" as PlanType,
    priceUSD: 25,
    priceCOP: 90000,
    features: ["Clientes ilimitados", "Pipeline avanzado", "Dashboard con métricas", "IA Comercial Básica", "Soporte estándar"],
    buttonText: "Actualizar a Pyme",
    isCurrent: false
  },
  {
    id: "macro",
    name: "Macro" as PlanType,
    priceUSD: 45,
    priceCOP: 150000,
    features: ["Todo lo anterior +", "IA Comercial Avanzada", "Integración WhatsApp", "Automatizaciones", "Soporte prioritario"],
    buttonText: "Actualizar a Macro",
    isCurrent: true
  }
];

export const TIENDANA_HARDWARE = [
  {
    id: "combo-1",
    name: "Combo Tiendana Pro",
    price: 1820000,
    description: "Ideal para restaurantes y minimarkets. Incluye impresora, cajón y soporte."
  },
  {
    id: "combo-2",
    name: "Combo Tiendana Elite",
    price: 1990000,
    description: "Máximo rendimiento. Todo-en-uno con pantalla táctil y periféricos premium."
  }
];

export const DEFAULT_BUSINESS_TYPES = [
  "Restaurante",
  "Cafetería",
  "Minimarket",
  "Tienda de ropa",
  "Otros"
];

const generateMessages = (clientId: string) => [
  { id: "m1", senderId: "u1", text: "Hola, ¿cómo va el proceso?", timestamp: new Date().toISOString() },
  { id: "m2", senderId: clientId, text: "Estamos revisando la propuesta.", timestamp: new Date().toISOString() }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "1",
    nombreNegocio: "Café Juan Valdez",
    tipoNegocio: "Restaurante",
    nombreContacto: "Juan Valdez",
    telefono: "310 123 4567",
    email: "juan.valdez@cafe.com",
    ciudad: "Bogotá",
    estado: "Venta cerrada",
    temperatura: "Caliente",
    fechaRegistro: "2024-01-10",
    ultimoContacto: "2024-04-10",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Control de ventas y facturación electrónica",
    solucionOfrecida: "Sistema POS Cloud con Facturación Electrónica",
    equipoOfrecido: "Combo POS Premium + 3 Tablets",
    presupuestoEstimado: 4500000,
    assignedTo: "u1",
    closingProbability: 100,
    messages: generateMessages("1"),
    historial: [
      { id: "h1", type: 'Demo', content: "Demo realizada con éxito. El cliente quedó encantado con la rapidez del sistema.", timestamp: "2024-03-15T10:00:00Z", userId: "u1" },
      { id: "h2", type: 'Nota', content: "Cliente solicita capacitación para 5 empleados.", timestamp: "2024-04-10T14:30:00Z", userId: "u1" }
    ]
  },
  {
    id: "2",
    nombreNegocio: "Minimarket El Sol",
    tipoNegocio: "Minimarket",
    nombreContacto: "Marta Lucía",
    telefono: "320 987 6543",
    email: "marta@minimarket.com",
    ciudad: "Medellín",
    estado: "Negociación",
    temperatura: "Tibio",
    fechaRegistro: "2024-02-15",
    ultimoContacto: "2024-04-12",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Control de inventario y proveedores",
    solucionOfrecida: "Módulo de Inventarios Avanzado",
    equipoOfrecido: "Software POS + Lector de código de barras",
    presupuestoEstimado: 1200000,
    assignedTo: "u2",
    closingProbability: 75,
    messages: [],
    historial: [
      { id: "h3", type: 'Llamada', content: "Se discutió el descuento por pago de contado.", timestamp: "2024-04-12T09:00:00Z", userId: "u2" }
    ]
  },
  {
    id: "3",
    nombreNegocio: "Boutique Sofía",
    tipoNegocio: "Tienda de ropa",
    nombreContacto: "Sofía Vergara",
    telefono: "315 444 8888",
    email: "sofia@moda.com",
    ciudad: "Barranquilla",
    estado: "Envío de propuesta",
    temperatura: "Frío",
    fechaRegistro: "2024-03-10",
    ultimoContacto: "2024-04-11",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Gestión de tallas y colores",
    solucionOfrecida: "Software POS para Retail",
    equipoOfrecido: "Combo POS Básico + Impresora",
    presupuestoEstimado: 2800000,
    assignedTo: "u1",
    closingProbability: 85,
    messages: [],
    historial: []
  },
  {
    id: "4",
    nombreNegocio: "Papi Juancho Bar",
    tipoNegocio: "Otros",
    nombreContacto: "Maluma Baby",
    telefono: "314 555 6666",
    email: "maluma@papi.com",
    ciudad: "Medellín",
    estado: "Demo del sistema POS",
    temperatura: "Tibio",
    fechaRegistro: "2024-03-18",
    ultimoContacto: "2024-04-13",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Control de inventario de licores y comandas",
    solucionOfrecida: "Módulo de Comandas para Bares",
    equipoOfrecido: "Software POS + 2 Comanderos",
    presupuestoEstimado: 3500000,
    assignedTo: "u2",
    closingProbability: 60,
    messages: [],
    historial: [
      { id: "h4", type: 'Demo', content: "Se realizó demo presencial. Interesado en el módulo de inventarios.", timestamp: "2024-04-13T16:00:00Z", userId: "u2" }
    ]
  },
  {
    id: "5",
    nombreNegocio: "Cafetería La Tribu",
    tipoNegocio: "Cafetería",
    nombreContacto: "Camilo Echeverry",
    telefono: "317 333 2222",
    email: "camilo@tribu.com",
    ciudad: "Montería",
    estado: "Venta cerrada",
    temperatura: "Caliente",
    fechaRegistro: "2024-01-25",
    ultimoContacto: "2024-04-05",
    proximoSeguimiento: "2024-04-30",
    necesidadDetectada: "Facturación rápida",
    solucionOfrecida: "Sistema POS All-in-One",
    equipoOfrecido: "Combo POS All-in-One",
    presupuestoEstimado: 2200000,
    assignedTo: "u3",
    closingProbability: 100,
    messages: [],
    historial: []
  }
];

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  "Restaurante": {
    recomendar: "Plan Pyme + Combo Tiendana Pro",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro (1.820.000)"
  },
  "Cafetería": {
    recomendar: "Plan Pyme + Combo Tiendana Pro",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro (1.820.000)"
  },
  "Minimarket": {
    recomendar: "Plan Macro + Combo Tiendana Elite",
    plan: "Macro",
    equipos: "Combo Tiendana Elite (1.990.000)"
  },
  "Tienda de ropa": {
    recomendar: "Plan Pyme + Combo Tiendana Pro",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro (1.820.000)"
  },
  "Otros": {
    recomendar: "Plan Básico + Software Solo",
    plan: "Básico",
    equipos: "Solo Software"
  }
};
