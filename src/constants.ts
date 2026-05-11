import { Recommendation, User, PlanType, Client, InternalChat, BusinessType, LeadStatus } from "./types";

// ===== NUEVO: Datos demo enriquecidos (u1 a u6) =====
export const USERS: User[] = [
  {
    id: "u1",
    name: "Carlos Mendoza",
    email: "carlos@smartcrm.com",
    role: "Admin",
    plan: "Macro",
    salesCount: 67,
    closedRevenue: 85400000,
    points: 6700,
    avatar: "CM",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a1", title: "Cerrador Élite", description: "50+ ventas cerradas", icon: "🏆", unlockedAt: "2024-01-15" },
      { id: "a2", title: "Madrugador", description: "Primer contacto antes de las 8 AM", icon: "☀️", unlockedAt: "2024-02-01" }
    ],
    medals: [
      { id: "m1", type: "oro", title: "Top Ventas Q1", date: "2024-03-31" },
      { id: "m2", type: "oro", title: "Mayor Ticket Promedio", date: "2024-02-28" }
    ]
  },
  {
    id: "u2",
    name: "Valentina Torres",
    email: "valentina@smartcrm.com",
    role: "Vendedor",
    plan: "Macro",
    salesCount: 54,
    closedRevenue: 72300000,
    points: 5400,
    avatar: "VT",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a3", title: "Persuasiva Pro", description: "10 propuestas aceptadas seguidas", icon: "🔥", unlockedAt: "2024-02-15" }
    ],
    medals: [
      { id: "m3", type: "plata", title: "Top Ventas Q1", date: "2024-03-31" }
    ]
  },
  {
    id: "u3",
    name: "Andrés Jiménez",
    email: "andres@smartcrm.com",
    role: "Vendedor",
    plan: "Pyme",
    salesCount: 41,
    closedRevenue: 58900000,
    points: 4100,
    avatar: "AJ",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a4", title: "Persistente", description: "5 seguimientos al mismo lead", icon: "💪", unlockedAt: "2024-03-01" }
    ],
    medals: [
      { id: "m4", type: "bronce", title: "Top Ventas Q1", date: "2024-03-31" }
    ]
  },
  {
    id: "u4",
    name: "Paola Ramírez",
    email: "paola@smartcrm.com",
    role: "Vendedor",
    plan: "Pyme",
    salesCount: 38,
    closedRevenue: 49200000,
    points: 3800,
    avatar: "PR",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a5", title: "Networker", description: "20 clientes referidos", icon: "🤝", unlockedAt: "2024-03-10" }
    ],
    medals: [
      { id: "m5", type: "plata", title: "Mejor Tasa de Conversión", date: "2024-02-28" }
    ]
  },
  {
    id: "u5",
    name: "Diego Herrera",
    email: "diego@smartcrm.com",
    role: "Vendedor",
    plan: "Básico",
    salesCount: 22,
    closedRevenue: 31500000,
    points: 2200,
    avatar: "DH",
    hasSeenOnboarding: true,
    achievements: [],
    medals: []
  },
  {
    id: "u6",
    name: "Luisa Fernanda Castro",
    email: "luisa@smartcrm.com",
    role: "Vendedor",
    plan: "Básico",
    salesCount: 18,
    closedRevenue: 24800000,
    points: 1800,
    avatar: "LC",
    hasSeenOnboarding: true,
    achievements: [
      { id: "a6", title: "Novata Estrella", description: "Primera venta cerrada", icon: "⭐", unlockedAt: "2024-03-20" }
    ],
    medals: []
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

export const DEFAULT_BUSINESS_TYPES: BusinessType[] = [
  "Restaurante",
  "Cafetería",
  "Minimarket",
  "Tienda de ropa",
  "Otros"
];

export const COLUMNS: LeadStatus[] = [
  "Nuevos prospectos", 
  "Contacto inicial", 
  "Presentación", 
  "Negociación", 
  "Propuesta enviada",
  "Ganado",
  "Perdido"
];

export const INITIAL_CLIENTS: Client[] = [
  // Clientes originales (1-5)
  {
    id: "1",
    nombreNegocio: "Café Juan Valdez",
    tipoNegocio: "Restaurante",
    nombreContacto: "Juan Valdez",
    telefono: "310 123 4567",
    email: "juan.valdez@cafe.com",
    ciudad: "Bogotá",
    estado: "Ganado",
    temperatura: "Caliente",
    fechaRegistro: "2026-03-03",
    ultimoContacto: "2026-04-10",
    proximoSeguimiento: "2026-04-15",
    necesidadDetectada: "Control de ventas y facturación electrónica",
    solucionOfrecida: "Sistema POS Cloud con Facturación Electrónica",
    equipoOfrecido: "Combo POS Premium + 3 Tablets",
    presupuestoEstimado: 4500000,
    assignedTo: "u1",
    closingProbability: 100,
    messages: [],
    historial: [
      { id: "h1", type: 'Demo', content: "Demo realizada con éxito. El cliente quedó encantado con la rapidez del sistema.", timestamp: "2024-03-15T10:00:00Z", userId: "u1" }
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
      { id: "h2", type: 'Llamada', content: "Marta solicita ajuste en el presupuesto del hardware.", timestamp: "2024-04-12T09:00:00Z", userId: "u2" }
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
    estado: "Negociación",
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
    estado: "Presentación",
    temperatura: "Tibio",
    fechaRegistro: "2026-03-03",
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
      { id: "h4", type: 'Demo', content: "Demo presencial con el administrador del bar.", timestamp: "2024-04-13T16:00:00Z", userId: "u2" }
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
    estado: "Cerrado",
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
  },
  // ===== NUEVO: Clientes extendidos (6-22) =====
  {
    id: "6",
    nombreNegocio: "Fruver La Cosecha",
    tipoNegocio: "Minimarket",
    nombreContacto: "Hernando Castillo",
    telefono: "311 234 5678",
    email: "hcastillo@cosecha.com",
    ciudad: "Medellín",
    estado: "Negociación",
    temperatura: "Tibio",
    fechaRegistro: "2024-03-05",
    ultimoContacto: "2024-04-01",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Básculas conectadas al POS",
    solucionOfrecida: "POS con integración de básculas",
    equipoOfrecido: "Combo Tiendana Pro + Báscula",
    presupuestoEstimado: 2100000,
    assignedTo: "u2",
    closingProbability: 70,
    messages: [],
    historial: [{ id: "h6", type: 'Llamada', content: "Envío de cotización detallada.", timestamp: "2024-04-01T10:00:00Z", userId: "u2" }]
  },
  {
    id: "7",
    nombreNegocio: "Panadería Don Lucho",
    tipoNegocio: "Restaurante",
    nombreContacto: "Luis Alberto Mora",
    telefono: "312 345 6789",
    email: "lucho@panderia.com",
    ciudad: "Bogotá",
    estado: "Negociación",
    temperatura: "Caliente",
    fechaRegistro: "2024-03-10",
    ultimoContacto: "2024-04-08",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Multi-caja por alto flujo",
    solucionOfrecida: "Plan Macro con 3 terminales",
    equipoOfrecido: "3 Combos Tiendana Elite",
    presupuestoEstimado: 3800000,
    assignedTo: "u1",
    closingProbability: 85,
    messages: [],
    historial: [{ id: "h7", type: 'Reunión', content: "Visita técnica al local. Se valida alcance.", timestamp: "2024-04-08T15:00:00Z", userId: "u1" }]
  },
  {
    id: "8",
    nombreNegocio: "Droguería San Rafael",
    tipoNegocio: "Otros",
    nombreContacto: "Carmen Inés Pérez",
    telefono: "313 456 7890",
    email: "carmen@sanrafael.com",
    ciudad: "Cali",
    estado: "Demo",
    temperatura: "Tibio",
    fechaRegistro: "2024-03-15",
    ultimoContacto: "2024-04-05",
    proximoSeguimiento: "2024-04-12",
    necesidadDetectada: "Manejo de fechas de vencimiento",
    solucionOfrecida: "Módulo farmacéutico avanzado",
    equipoOfrecido: "Software POS + Lector",
    presupuestoEstimado: 4200000,
    assignedTo: "u3",
    closingProbability: 55,
    messages: [],
    historial: [{ id: "h8", type: 'Demo', content: "Demostración de gestión de lotes.", timestamp: "2024-04-05T11:00:00Z", userId: "u3" }]
  },
  {
    id: "9",
    nombreNegocio: "Tienda Naturista Verde Vida",
    tipoNegocio: "Tienda de ropa",
    nombreContacto: "Sofía Morales",
    telefono: "314 567 8901",
    email: "sofia@verdevida.com",
    ciudad: "Barranquilla",
    estado: "Nuevo lead",
    temperatura: "Frío",
    fechaRegistro: "2024-04-02",
    ultimoContacto: "2024-04-02",
    proximoSeguimiento: "2024-04-20",
    necesidadDetectada: "Reportes de ventas por canal",
    solucionOfrecida: "Dashboard avanzado",
    equipoOfrecido: "Plan Pyme",
    presupuestoEstimado: 1500000,
    assignedTo: "u4",
    closingProbability: 15,
    messages: [],
    historial: [{ id: "h9", type: 'Email', content: "Información inicial enviada por mail.", timestamp: "2024-04-02T16:00:00Z", userId: "u4" }]
  },
  {
    id: "10",
    nombreNegocio: "Restaurante El Fogón Paisa",
    tipoNegocio: "Restaurante",
    nombreContacto: "Jorge Esteban Reyes",
    telefono: "315 678 9012",
    email: "jorge@fogonpaisa.com",
    ciudad: "Medellín",
    estado: "Cerrado",
    temperatura: "Caliente",
    fechaRegistro: "2024-02-20",
    ultimoContacto: "2024-04-10",
    proximoSeguimiento: "2024-05-10",
    necesidadDetectada: "Comandas a cocina directas",
    solucionOfrecida: "Plan Macro con KDS (Kitchen Display System)",
    equipoOfrecido: "Combo POS Pro + 2 Tablets KDS",
    presupuestoEstimado: 5600000,
    assignedTo: "u2",
    closingProbability: 100,
    messages: [],
    historial: [{ id: "h10", type: 'Nota', content: "Implementación exitosa. Capacitación completa.", timestamp: "2024-04-10T17:00:00Z", userId: "u2" }]
  },
  {
    id: "11",
    nombreNegocio: "Supermercado Mercacentro",
    tipoNegocio: "Minimarket",
    nombreContacto: "Patricia López",
    telefono: "316 789 0123",
    email: "plopez@mercacentro.com",
    ciudad: "Bucaramanga",
    estado: "Contacto inicial",
    temperatura: "Frío",
    fechaRegistro: "2024-04-05",
    ultimoContacto: "2024-04-05",
    proximoSeguimiento: "2024-04-25",
    necesidadDetectada: "Sincronización de 5 puntos",
    solucionOfrecida: "Estructura multi-sede Cloud",
    equipoOfrecido: "Infraestructura Cloud + Licencias",
    presupuestoEstimado: 7800000,
    assignedTo: "u5",
    closingProbability: 25,
    messages: [],
    historial: [{ id: "h11", type: 'Llamada', content: "Primer contacto exploratorio.", timestamp: "2024-04-05T09:30:00Z", userId: "u5" }]
  },
  {
    id: "12",
    nombreNegocio: "Cafetería El Descanso",
    tipoNegocio: "Cafetería",
    nombreContacto: "Andrés Felipe Gómez",
    telefono: "317 890 1234",
    email: "afgomez@eldescanso.com",
    ciudad: "Bogotá",
    estado: "Demo",
    temperatura: "Tibio",
    fechaRegistro: "2024-03-20",
    ultimoContacto: "2024-04-11",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Manejo de propinas e inventario base",
    solucionOfrecida: "Módulo gastro estándar",
    equipoOfrecido: "Combo Tiendana Pro",
    presupuestoEstimado: 1900000,
    assignedTo: "u1",
    closingProbability: 60,
    messages: [],
    historial: [{ id: "h12", type: 'Demo', content: "Demo realizada. Interesados en factura electrónica.", timestamp: "2024-04-11T14:00:00Z", userId: "u1" }]
  },
  {
    id: "13",
    nombreNegocio: "Boutique Eleganza",
    tipoNegocio: "Tienda de ropa",
    nombreContacto: "Marcela Suárez",
    telefono: "318 901 2345",
    email: "marcela@eleganza.com",
    ciudad: "Cali",
    estado: "Negociación",
    temperatura: "Caliente",
    fechaRegistro: "2024-04-01",
    ultimoContacto: "2024-04-12",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Gestión de fidelización de clientes",
    solucionOfrecida: "Módulo CRM y Loyalty",
    equipoOfrecido: "Tiendana Pro",
    presupuestoEstimado: 2700000,
    assignedTo: "u6",
    closingProbability: 75,
    messages: [],
    historial: [{ id: "h13", type: 'Llamada', content: "Se resuelve duda sobre carga masiva de clientes.", timestamp: "2024-04-12T16:00:00Z", userId: "u6" }]
  },
  {
    id: "14",
    nombreNegocio: "Heladería Cremosa",
    tipoNegocio: "Cafetería",
    nombreContacto: "Tomás Ríos",
    telefono: "319 012 3456",
    email: "trios@cremosa.com",
    ciudad: "Cartagena",
    estado: "Negociación",
    temperatura: "Caliente",
    fechaRegistro: "2024-03-22",
    ultimoContacto: "2024-04-10",
    proximoSeguimiento: "2024-04-15",
    necesidadDetectada: "Manejo de toppings (modificadores)",
    solucionOfrecida: "Configuración avanzada de productos",
    equipoOfrecido: "Software POS",
    presupuestoEstimado: 3100000,
    assignedTo: "u3",
    closingProbability: 88,
    messages: [],
    historial: [{ id: "h14", type: 'Llamada', content: "Negociación de términos de soporte.", timestamp: "2024-04-10T10:00:00Z", userId: "u3" }]
  },
  {
    id: "15",
    nombreNegocio: "Ferretería El Tornillo",
    tipoNegocio: "Otros",
    nombreContacto: "Ricardo Mendoza",
    telefono: "320 123 4567",
    email: "rmendoza@tornillo.com",
    ciudad: "Bogotá",
    estado: "Cerrado",
    temperatura: "Caliente",
    fechaRegistro: "2024-02-15",
    ultimoContacto: "2024-04-05",
    proximoSeguimiento: "2024-05-05",
    necesidadDetectada: "Catálogo masivo de 50.000 SKUs",
    solucionOfrecida: "Motor de búsqueda optimizado",
    equipoOfrecido: "Combo POS Elite + Lector Inalámbrico",
    presupuestoEstimado: 6400000,
    assignedTo: "u4",
    closingProbability: 100,
    messages: [],
    historial: [{ id: "h15", type: 'Reunión', content: "Post-venta: Revisión de inventario inicial.", timestamp: "2024-04-05T14:30:00Z", userId: "u4" }]
  },
  {
    id: "16",
    nombreNegocio: "Papelería Universitaria",
    tipoNegocio: "Otros",
    nombreContacto: "Gloria Amparo Ruiz",
    telefono: "321 234 5678",
    email: "gruiz@papeleria.com",
    ciudad: "Manizales",
    estado: "Nuevo lead",
    temperatura: "Frío",
    fechaRegistro: "2024-04-12",
    ultimoContacto: "2024-04-12",
    proximoSeguimiento: "2024-04-20",
    necesidadDetectada: "Impresión de facturas rápida",
    solucionOfrecida: "Driver de impresión optimizado",
    equipoOfrecido: "Impresora Térmica + Software",
    presupuestoEstimado: 980000,
    assignedTo: "u5",
    closingProbability: 10,
    messages: [],
    historial: [{ id: "h16", type: 'Email', content: "Envío de catálogo de precios.", timestamp: "2024-04-12T09:00:00Z", userId: "u5" }]
  },
  {
    id: "17",
    nombreNegocio: "Bar La Rumba",
    tipoNegocio: "Otros",
    nombreContacto: "Alexander Castro",
    telefono: "322 345 6789",
    email: "acastro@larumba.com",
    ciudad: "Medellín",
    estado: "Contacto inicial",
    temperatura: "Tibio",
    fechaRegistro: "2024-04-08",
    ultimoContacto: "2024-04-08",
    proximoSeguimiento: "2024-04-18",
    necesidadDetectada: "Consumo de botellas internas",
    solucionOfrecida: "Módulo de consumo interno",
    equipoOfrecido: "Combo Básico",
    presupuestoEstimado: 4500000,
    assignedTo: "u6",
    closingProbability: 30,
    messages: [],
    historial: [{ id: "h17", type: 'Nota', content: "El cliente solicita demo presencial nocturna.", timestamp: "2024-04-08T11:00:00Z", userId: "u6" }]
  },
  {
    id: "18",
    nombreNegocio: "Mini Mercado La Esquina",
    tipoNegocio: "Minimarket",
    nombreContacto: "Rosa María Herrera",
    telefono: "323 456 7890",
    email: "rherrera@laesquina.com",
    ciudad: "Pereira",
    estado: "Demo",
    temperatura: "Tibio",
    fechaRegistro: "2024-03-28",
    ultimoContacto: "2024-04-13",
    proximoSeguimiento: "2024-04-16",
    necesidadDetectada: "Control de arqueo de caja riguroso",
    solucionOfrecida: "Reportes de auditoría X y Z",
    equipoOfrecido: "Cajón monedero + Impresora",
    presupuestoEstimado: 2300000,
    assignedTo: "u2",
    closingProbability: 50,
    messages: [],
    historial: [{ id: "h18", type: 'Llamada', content: "Se programa demo técnica para el sábado.", timestamp: "2024-04-13T10:00:00Z", userId: "u2" }]
  },
  {
    id: "19",
    nombreNegocio: "Restaurante Sabores del Mar",
    tipoNegocio: "Restaurante",
    nombreContacto: "Fernando Díaz",
    telefono: "324 567 8901",
    email: "fdiaz@saboresmar.com",
    ciudad: "Cartagena",
    estado: "Cerrado",
    temperatura: "Caliente",
    fechaRegistro: "2024-02-10",
    ultimoContacto: "2024-04-11",
    proximoSeguimiento: "2024-05-11",
    necesidadDetectada: "Manejo de domicilios integrados",
    solucionOfrecida: "Módulo de domicilio y tracking",
    equipoOfrecido: "Combo POS Elite + Integración",
    presupuestoEstimado: 8500000,
    assignedTo: "u1",
    closingProbability: 100,
    messages: [],
    historial: [{ id: "h19", type: 'Reunión', content: "Cierre exitoso en oficina principal.", timestamp: "2024-04-11T12:00:00Z", userId: "u1" }]
  },
  {
    id: "20",
    nombreNegocio: "Cafetería Momento",
    tipoNegocio: "Cafetería",
    nombreContacto: "Isabela Vargas",
    telefono: "325 678 9012",
    email: "ivargas@momento.com",
    ciudad: "Bogotá",
    estado: "Negociación",
    temperatura: "Tibio",
    fechaRegistro: "2024-04-05",
    ultimoContacto: "2024-04-13",
    proximoSeguimiento: "2024-04-16",
    necesidadDetectada: "Venta de combos (mañana/tarde)",
    solucionOfrecida: "Módulo de recetas y combos",
    equipoOfrecido: "Plan Pyme",
    presupuestoEstimado: 1700000,
    assignedTo: "u3",
    closingProbability: 65,
    messages: [],
    historial: [{ id: "h20", type: 'Llamada', content: "Aclara dudas sobre impuestos (IVA/INC).", timestamp: "2024-04-13T09:30:00Z", userId: "u3" }]
  },
  {
    id: "21",
    nombreNegocio: "Tienda Deportiva Runner",
    tipoNegocio: "Tienda de ropa",
    nombreContacto: "Camila Jiménez",
    telefono: "326 789 0123",
    email: "cjimenez@runner.com",
    ciudad: "Cali",
    estado: "Negociación",
    temperatura: "Caliente",
    fechaRegistro: "2024-03-31",
    ultimoContacto: "2024-04-12",
    proximoSeguimiento: "2024-04-14",
    necesidadDetectada: "Manejo de códigos de barras propios",
    solucionOfrecida: "Generador de etiquetas integrado",
    equipoOfrecido: "Software + Impresora de etiquetas",
    presupuestoEstimado: 3600000,
    assignedTo: "u4",
    closingProbability: 80,
    messages: [],
    historial: [{ id: "h21", type: 'Reunión', content: "Se negocia descuento por compra de 2 licencias.", timestamp: "2024-04-12T15:00:00Z", userId: "u4" }]
  },
  {
    id: "22",
    nombreNegocio: "Distribuidora El Mayorista",
    tipoNegocio: "Minimarket",
    nombreContacto: "Gustavo Peña",
    telefono: "327 890 1234",
    email: "gpena@mayorista.com",
    ciudad: "Bogotá",
    estado: "Demo",
    temperatura: "Frío",
    fechaRegistro: "2024-04-01",
    ultimoContacto: "2024-04-11",
    proximoSeguimiento: "2024-04-20",
    necesidadDetectada: "Carga de 100.000 SKU's",
    solucionOfrecida: "Base de datos optimizada Enterprise",
    equipoOfrecido: "Plan Pyme + Capacitación avanzada",
    presupuestoEstimado: 9200000,
    assignedTo: "u5",
    closingProbability: 45,
    messages: [],
    historial: [{ id: "h22", type: 'Llamada', content: "Sigue analizando factibilidad técnica.", timestamp: "2024-04-11T16:30:00Z", userId: "u5" }]
  }
];

export const INTERNAL_CHATS: InternalChat[] = [
  {
    id: "ic1",
    name: "Andrés Jiménez",
    type: "individual",
    participants: ["u1", "u3"],
    lastMessage: "¿Qué tal la demo de Juan Valdez?",
    lastMessageTime: "10:30 AM",
    avatar: "AJ",
    messages: [
      { id: "im1", senderId: "u3", text: "Hola Carlos, ¿cómo vas con esa propuesta?", timestamp: "2024-04-12T10:00:00Z" },
      { id: "im2", senderId: "u1", text: "Todo bien, ya casi lista. ¿Qué tal la demo de Juan Valdez?", timestamp: "2024-04-12T10:05:00Z" }
    ]
  },
  {
    id: "ic2",
    name: "Equipo Ventas",
    type: "group",
    participants: ["u1", "u2", "u3", "u4", "u5", "u6"],
    lastMessage: "¡Vamos por la meta de Q2!",
    lastMessageTime: "09:00 AM",
    avatar: "EV",
    messages: [
      { id: "im3", senderId: "u1", text: "Equipo, ¡hemos tenido un gran inicio de mes!", timestamp: "2024-04-13T08:00:00Z" },
      { id: "im4", senderId: "u2", text: "Totalmente, ¡vamos por la meta de Q2!", timestamp: "2024-04-13T09:00:00Z" }
    ]
  },
  {
    id: "ic3",
    name: "Valentina Torres",
    type: "individual",
    participants: ["u1", "u2"],
    lastMessage: "Propuesta enviada a Minimarket El Sol.",
    lastMessageTime: "Ayer",
    avatar: "VT",
    messages: [
      { id: "im5", senderId: "u2", text: "Carlos, propuesta enviada a Minimarket El Sol. Quedaron de avisar mañana.", timestamp: "2024-04-12T17:00:00Z" }
    ]
  },
  // ===== NUEVO: Otros chats =====
  {
    id: "ic4",
    name: "Estrategia Q2",
    type: "group",
    participants: ["u1", "u2", "u3", "u4"],
    lastMessage: "Revisen los presupuestos asignados.",
    lastMessageTime: "11:20 AM",
    avatar: "Q2",
    messages: [
      { id: "im6", senderId: "u1", text: "Hola equipo, este trimestre nos enfocaremos en Minimarkets.", timestamp: "2024-04-13T10:00:00Z" },
      { id: "im7", senderId: "u4", text: "Entendido Carlos, ya tengo 3 en el pipeline.", timestamp: "2024-04-13T10:15:00Z" },
      { id: "im8", senderId: "u1", text: "Excelente. Revisen los presupuestos asignados.", timestamp: "2024-04-13T11:20:00Z" }
    ]
  },
  {
    id: "ic5",
    name: "Paola Ramírez",
    type: "individual",
    participants: ["u1", "u4"],
    lastMessage: "Cliente transferido correctamente.",
    lastMessageTime: "08:45 AM",
    avatar: "PR",
    messages: [
      { id: "im9", senderId: "u1", text: "Paola, te transferí al cliente Droguería San Rafael.", timestamp: "2024-04-13T08:30:00Z" },
      { id: "im10", senderId: "u4", text: "Recibido. Cliente transferido correctamente. Ya hablé con ellos.", timestamp: "2024-04-13T08:45:00Z" }
    ]
  }
];

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  "Restaurante": {
    recomendar: "Para un restaurante con alta rotación se recomienda POS con gestión de mesas, comandas móviles y KDS (Kitchen Display System) para optimizar el servicio.",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro + 2 Tablets KDS"
  },
  "Cafetería": {
    recomendar: "Plan Pyme + COMBO PRO. Enfatizar rapidez en caja y facturación electrónica.",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro (1.820.000)"
  },
  "Minimarket": {
    recomendar: "Plan Macro con Combo Tiendana Elite. Clave: Inventario masivo y códigos de barras.",
    plan: "Macro",
    equipos: "Combo Tiendana Elite (1.990.000)"
  },
  "Tienda de ropa": {
    recomendar: "Plan Pyme + Lector de Código. Mostrar gestión de tallas, colores y cierres de caja.",
    plan: "Pyme",
    equipos: "Combo Tiendana Pro (1.820.000)"
  },
  "Otros": {
    recomendar: "Plan Básico o Pyme según volumen. Diagnosticar si requiere hardware específico.",
    plan: "Básico",
    equipos: "Consultar hardware según necesidad"
  }
};
