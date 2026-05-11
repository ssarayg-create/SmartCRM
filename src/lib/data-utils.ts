import { Client, LeadStatus, ClientTemperature, BusinessType } from '../types';
import { USERS } from '../constants';

export function generateMockData(range: string): Client[] {
  const now = new Date();
  // We want data from March 3, 2026
  const startDate = new Date(2026, 2, 3); // Month is 0-indexed, so 2 is March
  
  let daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) daysDiff = 60; // Fallback if now is before March 3
  
  const statuses: LeadStatus[] = [
    "Nuevos prospectos", 
    "Contacto inicial", 
    "Presentación", 
    "Negociación", 
    "Propuesta enviada", 
    "Ganado", 
    "Perdido"
  ];
  
  const businessTypes: BusinessType[] = ["Restaurante", "Cafetería", "Minimarket", "Tienda de ropa", "Otros"];
  const cities = ["Medellín", "Bogotá", "Cali", "Barranquilla", "Pereira", "Manizales", "Bucaramanga"];
  const temps: ClientTemperature[] = ["Frío", "Tibio", "Caliente"];

  const data: Client[] = [];
  
  // Ensure we have data for every single day since March 3
  for (let d = 0; d <= daysDiff; d++) {
    const currentDay = new Date(startDate.getTime() + d * 86400000);
    // Generate 2-5 leads per day
    const leadsToday = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < leadsToday; i++) {
      const assignedTo = USERS[Math.floor(Math.random() * USERS.length)].id;
      const estado = statuses[Math.floor(Math.random() * statuses.length)];
      const presupuesto = Math.floor(Math.random() * 8000000) + 1500000;
      const bType = businessTypes[Math.floor(Math.random() * businessTypes.length)];

      data.push({
        id: `L-${startDate.getTime()}-${d}-${i}`,
        nombreNegocio: `${bType} ${['Soluciones', 'Express', 'Delicias', 'Caseritas', 'Gourmet', 'Market', 'Fashion'][Math.floor(Math.random() * 7)]} ${d}${i}`,
        nombreContacto: `Cliente ${d}${i}`,
        telefono: `300${Math.floor(Math.random() * 9000000 + 1000000)}`,
        email: `cliente${d}${i}@smartcrm.co`,
        ciudad: cities[Math.floor(Math.random() * cities.length)],
        estado,
        tipoNegocio: bType,
        presupuestoEstimado: presupuesto,
        closingProbability: estado === 'Ganado' ? 100 : estado === 'Perdido' ? 0 : Math.floor(Math.random() * 90),
        assignedTo,
        fechaRegistro: currentDay.toISOString(),
        ultimoContacto: currentDay.toISOString(),
        proximoSeguimiento: new Date(currentDay.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString(),
        necesidadDetectada: "Optimización de ventas y control de inventarios POS.",
        solucionOfrecida: "SmartCRM POS Cloud v2",
        equipoOfrecido: "Terminal Táctil K1 + Impresora Térmica",
        temperatura: temps[Math.floor(Math.random() * temps.length)],
        messages: [],
        historial: [
          {
            id: `h1-${d}-${i}`,
            type: 'Contacto inicial',
            content: 'Primer contacto realizado telefónicamente.',
            timestamp: currentDay.toISOString(),
            userId: assignedTo
          }
        ]
      });
    }
  }

  // Filter based on range if needed, but the user wants "all history" to show data
  // For the purpose of this request, we'll return the full set and let components filter
  return data;
}

export function getDailyTrends(clients: Client[]) {
  const days: Record<string, { leads: number, sales: number }> = {};
  
  clients.forEach(c => {
    const d = new Date(c.fechaRegistro);
    const dateKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    if (!days[dateKey]) {
      days[dateKey] = { leads: 0, sales: 0 };
    }
    days[dateKey].leads += 1;
    if (c.estado === 'Ganado') {
      days[dateKey].sales += 1;
    }
  });

  return Object.entries(days).map(([date, counts]) => ({
    date,
    leads: counts.leads,
    sales: counts.sales
  })).sort((a, b) => a.date.localeCompare(b.date));
}
