import { Recommendation, User, Notification, PlanType, Client, InternalChat } from "./types";

export const USERS: User[] = [
  {
    id: "u1",
    name: "Carlos Rodríguez",
    email: "carlos@smartcrm.com",
    role: "Admin",
    plan: "Premium",
    salesCount: 45,
    closedRevenue: 12500000,
    avatar: "CR"
  },
  {
    id: "u2",
    name: "Ana Martínez",
    email: "ana@smartcrm.com",
    role: "Vendedor",
    plan: "Premium",
    salesCount: 32,
    closedRevenue: 8400000,
    avatar: "AM"
  },
  {
    id: "u3",
    name: "Juan Pérez",
    email: "juan@smartcrm.com",
    role: "Vendedor",
    plan: "Premium",
    salesCount: 28,
    closedRevenue: 6200000,
    avatar: "JP"
  },
  {
    id: "u4",
    name: "Elena Gómez",
    email: "elena@smartcrm.com",
    role: "Vendedor",
    plan: "Profesional",
    salesCount: 15,
    closedRevenue: 3200000,
    avatar: "EG"
  },
  {
    id: "u5",
    name: "Roberto Díaz",
    email: "roberto@smartcrm.com",
    role: "Vendedor",
    plan: "Básico",
    salesCount: 10,
    closedRevenue: 1800000,
    avatar: "RD"
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
    isCurrent: true
  },
  {
    id: "pro",
    name: "Profesional" as PlanType,
    priceUSD: 19,
    priceCOP: 70000,
    features: ["Clientes ilimitados", "Pipeline avanzado", "Dashboard con métricas", "Recordatorios", "Soporte básico"],
    buttonText: "Actualizar a Pro",
    isCurrent: false
  },
  {
    id: "premium",
    name: "Premium" as PlanType,
    priceUSD: 39,
    priceCOP: 130000,
    features: ["Todo lo anterior +", "Integración WhatsApp", "Integración Meta Ads", "Automatizaciones", "Insights inteligentes", "Soporte prioritario"],
    buttonText: "Actualizar a Premium",
    isCurrent: false
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
    fechaRegistro: "2024-01-10",
    ultimoContacto: "2024-04-10",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Control de ventas y facturación electrónica",
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
    fechaRegistro: "2024-02-15",
    ultimoContacto: "2024-04-12",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Control de inventario y proveedores",
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
    fechaRegistro: "2024-03-10",
    ultimoContacto: "2024-04-11",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Gestión de tallas y colores",
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
    fechaRegistro: "2024-03-18",
    ultimoContacto: "2024-04-13",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Control de inventario de licores y comandas",
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
    fechaRegistro: "2024-01-25",
    ultimoContacto: "2024-04-05",
    proximoSeguimiento: "2024-04-30",
    necesidadDetectada: "Facturación rápida",
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
    recomendar: "Plan Restaurante Pro + Comandero Móvil",
    plan: "Profesional",
    equipos: "3 Tablets + 1 Impresora Térmica"
  },
  "Bar": {
    recomendar: "Plan Bar Nightlife + Control de Inventario",
    plan: "Profesional",
    equipos: "2 Tablets + 1 Lector de QR"
  },
  "Minimarket": {
    recomendar: "Plan Retail Express + Lector de Código de Barras",
    plan: "Básico",
    equipos: "1 PC + 1 Lector + 1 Cajón Monedero"
  },
  "Ferretería": {
    recomendar: "Plan Industrial + Gestión de Proveedores",
    plan: "Premium",
    equipos: "2 PCs + 2 Lectores de largo alcance"
  },
  "Otro": {
    recomendar: "Plan Flexible + Consultoría Personalizada",
    plan: "Profesional",
    equipos: "A definir según necesidad"
  }
};
