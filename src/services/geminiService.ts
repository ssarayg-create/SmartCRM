
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getCommercialRecommendation(clientData: {
  estado: string;
  necesidad: string;
  negocio: string;
  temperatura: string;
}) {
  try {
    console.log("Calling Gemini API with model: gemini-1.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Actúa como un experto consultor de ventas de sistemas POS (Software y Hardware).
      Analiza el siguiente prospecto y genera una recomendación estratégica.
      
      DATOS DEL CLIENTE:
      - Negocio: ${clientData.negocio}
      - Estado Comercial: ${clientData.estado}
      - Temperatura: ${clientData.temperatura}
      - Necesidad Detectada: ${clientData.necesidad}
      
      CONTEXTO DE PRODUCTOS (TIENDANA):
      - Planes: Básico (Gratis), Pyme ($25 USD), Macro ($45 USD)
      - Hardware: Combo Tiendana Pro (1.820.000), Combo Tiendana Elite (1.990.000)
      
      RESPONDE ÚNICAMENTE EN FORMATO JSON CON ESTA ESTRUCTURA:
      {
        "recomendacion": "Breve párrafo con el pitch de venta sugerido",
        "equipoSugerido": "Nombre del combo de hardware sugerido",
        "planSugerido": "Básico, Pyme o Macro",
        "proximaAccion": "Acción concreta (ej: Llamada de seguimiento, Demo técnica)",
        "proximaFecha": "Fecha sugerida en formato YYYY-MM-DD (debe ser entre 1 y 5 días a partir de hoy)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpiar el texto de posibles bloques de código markdown
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error en Gemini Service:", error);
    // Fallback en caso de error o falta de API Key
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
