
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getCommercialRecommendation(clientData: {
  estado: string;
  necesidad: string;
  negocio: string;
  temperatura: string;
}) {
  try {
    const prompt = `
      Actúa como un experto consultor de ventas de sistemas POS (Software y Hardware) para SmartCRM.
      Analiza el siguiente prospecto y genera una recomendación estratégica.
      
      DATOS DEL CLIENTE:
      - Negocio: ${clientData.negocio}
      - Estado Comercial: ${clientData.estado}
      - Temperatura: ${clientData.temperatura}
      - Necesidad Detectada: ${clientData.necesidad}
      
      CONTEXTO DE PRODUCTOS (TIENDANA):
      - Planes: Básico (Gratis), Pyme ($25 USD), Macro ($45 USD)
      - Hardware: Combo Tiendana Pro (1.820.000), Combo Tiendana Elite (1.990.000)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recomendacion: { type: Type.STRING },
            equipoSugerido: { type: Type.STRING },
            planSugerido: { type: Type.STRING },
            proximaAccion: { type: Type.STRING },
            proximaFecha: { type: Type.STRING },
          },
          required: ["recomendacion", "equipoSugerido", "planSugerido", "proximaAccion", "proximaFecha"],
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error en Gemini Service:", error);
    // Fallback if API key is missing or error occurs
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 3);
    
    return {
      recomendacion: "El cliente muestra interés en optimizar sus procesos. Se recomienda realizar un seguimiento personalizado para profundizar en sus necesidades técnicas.",
      equipoSugerido: "Combo Tiendana Pro",
      planSugerido: "Pyme",
      proximaAccion: "Llamada de seguimiento",
      proximaFecha: nextDate.toISOString().split('T')[0]
    };
  }
}

export async function getAssistantResponse(history: { role: 'user' | 'model', content: string }[]) {
  try {
    const systemInstruction = `
      Eres el Asistente Inteligente de SmartCRM, la plataforma líder para el sector POS en Latinoamérica.
      Tu objetivo es ayudar a los usuarios (vendedores y administradores) a usar la plataforma, gestionar leads y vender más.

      CARACTERÍSTICAS DEL CRM:
      - Dashboard: Vista general de métricas y rendimiento.
      - Leads: Listado y administración de prospectos. Evita duplicados por teléfono.
      - Pipeline (Kanban): Etapas: Nuevo lead, Contacto inicial, Demo, Negociación, Cerrado.
      - Analytics: Inteligencia de datos y gráficos comerciales.
      - Sales Ranking: Clasificación de los mejores vendedores.
      - Comunicaciones: Chat interno entre el equipo y chat de WhatsApp con clientes.
      - Configuración: Perfiles, tipos de negocio admitidos y gestión de asesores.
      - Planes: Básico (Gratis), Pro ($25/mes), Enterprise ($45/mes).

      PRODUCTOS DE HARDWARE (Tiendana):
      - Combo Pro: Ideal para pequeños negocios (Impresora + Cajón + Software).
      - Combo Elite: Mayor velocidad y capacidad para negocios grandes.

      SOPORTE:
      - Email: soporte@smartcrm.com
      - Teléfono: +57 300 123 4567

      NORMAS DE RESPUESTA:
      1. Sé profesional pero cercano.
      2. Si te preguntan sobre el uso, da pasos breves.
      3. Si te piden recomendaciones de venta, sugiere usar el módulo de Pipeline para mover los leads hacia "Cerrado".
      4. Si el usuario tiene problemas técnicos, sugiere contactar a soporte.
      5. Responde siempre en español.
    `;

    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "Lo siento, no pude procesar tu solicitud.";
  } catch (error) {
    console.error("Error en Smart Assistant:", error);
    return "En este momento tengo dificultades para responder. Por favor, intenta de nuevo más tarde o contacta a soporte.";
  }
}

export async function generateContextualProposal(clientData: {
  negocio: string;
  contacto: string;
  necesidad: string;
  equipo: string;
  presupuesto: number;
}) {
  try {
    const prompt = `
      Eres un Consultor Senior de Ventas para SMARTCRM SAAS POS. Tu objetivo es redactar una propuesta comercial IRRESISTIBLE, HUMANA y ALTAMENTE PERSUASIVA para el negocio: "${clientData.negocio}".

      CONTEXTO DEL CLIENTE:
      - Interlocutor: ${clientData.contacto}
      - Dolor/Necesidad principal: ${clientData.necesidad}
      - Solución de Hardware sugerida: ${clientData.equipo}
      - Inversión estimada: $${clientData.presupuesto.toLocaleString()} COP

      ESTRUCTURA OBLIGATORIA:
      Saludar a ${clientData.contacto} y presentar la siguiente estructura:

      🌟 BENEFICIOS: ¿Por qué elegirnos? (Empatía con su dolor).
      🛠️ SOLUCIÓN PROPUESTA: Detalle del ${clientData.equipo} y plan de software asociado.
      ⚙️ AUTOMATIZACIÓN: Cómo esto eliminará sus tareas manuales hoy.
      📈 CONVERSIÓN Y RESULTADOS: El impacto en su rentabilidad.
      ⏭️ SEGUIMIENTO Y CIERRE: Próximos pasos para empezar hoy mismo.

      NORMAS DE REDACCIÓN:
      1. Tono: Profesional, empresarial, inspirador y experto.
      2. Usa negritas para puntos clave.
      3. Emojis moderados y elegantes.
      4. Lenguaje de negocios real de Latinoamérica.
      
      Responde ÚNICAMENTE con el cuerpo de la propuesta.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text || "No se pudo generar la propuesta.";
  } catch (error) {
    return `Propuesta comercial para ${clientData.negocio}. Estimado ${clientData.contacto}, hemos analizado su necesidad de ${clientData.necesidad} y le proponemos nuestro sistema SmartPOS con el equipo ${clientData.equipo || 'Tiendana Pro'}.`;
  }
}
