import { GoogleGenAI, Type } from "@google/genai";
import { CommandResponse } from '../types';

// Mock implementation for fallback when API key is missing
const mockParseCommand = async (text: string): Promise<CommandResponse> => {
  const t = text.toLowerCase();
  
  // 1. Unblock / Stop deleting
  if (t.includes('přestaň') || t.includes('zruš') || t.includes('nemazat')) {
    const senderMatch = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || t.match(/od\s+([a-zA-Z0-9.-]+)/);
    const sender = senderMatch ? senderMatch[1] || senderMatch[0] : "unknown";
    return {
      intent: 'unblock_sender',
      parameters: { sender },
      response_text: `✅ Zrušil jsem pravidla pro ${sender}. Emaily zůstanou v inboxu.`
    };
  }

  // 2. Pause / Stop for a while
  if (t.includes('vypni') || t.includes('pozastav') || t.includes('pauza')) {
    return {
      intent: 'pause_rule',
      parameters: { duration: '2 weeks' }, // Simplified mock extraction
      response_text: "⏸️ Pozastavil jsem všechna pravidla. Připomenu ti to později."
    };
  }

  // 3. Granular / Complex logic
  if (t.includes('ale ne') || t.includes('jen')) {
     const senderMatch = t.match(/od\s+([a-zA-Z0-9.-]+)/);
     const sender = senderMatch ? senderMatch[1] : "sender";
     return {
       intent: 'granular_rule',
       parameters: { sender },
       response_text: `✅ Nastavil jsem granulární pravidla pro ${sender}.`
     };
  }

  // 4. List / Show
  if (t.includes('ukaž') || t.includes('seznam') || t.includes('jaká')) {
    const senderMatch = t.match(/pro\s+([a-zA-Z0-9.-]+)/);
    const sender = senderMatch ? senderMatch[1] : null;
    return {
      intent: 'list_rules',
      parameters: { sender },
      response_text: sender ? `📋 Zde jsou pravidla pro ${sender}:` : "📋 Zde je seznam všech pravidel."
    };
  }

  // Unknown
  return {
    intent: 'unknown',
    response_text: "❓ Nerozuměl jsem přesně. Můžeš zkusit: 'Přestaň mazat od X', 'Ukaž pravidla', nebo 'Pozastavit'."
  };
};

export const parseUserCommand = async (text: string): Promise<CommandResponse> => {
  // Use mock if no key available in env
  if (!process.env.API_KEY) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockParseCommand(text);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: `Jsi asistent pro správu Gmail pravidel. Analyzuj vstup uživatele v češtině a extrahuj záměr (intent) a parametry.
        
        Možné intenty:
        - unblock_sender: Uživatel chce zrušit mazání nebo pravidla pro odesílatele.
        - granular_rule: Uživatel chce nastavit specifické akce pro různé typy emailů od jednoho odesílatele (např. smazat marketing, nechat faktury).
        - list_rules: Uživatel chce vidět existující pravidla.
        - pause_rule: Uživatel chce dočasně pozastavit pravidla.
        - delete_rule: Uživatel chce smazat pravidlo.

        Pokud si nejsi jistý, vrať intent 'unknown'.
        Vrať také přirozenou odpověď v 'response_text' v češtině, která potvrzuje akci.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { 
              type: Type.STRING, 
              enum: ['unblock_sender', 'granular_rule', 'list_rules', 'pause_rule', 'delete_rule', 'unknown'] 
            },
            parameters: {
              type: Type.OBJECT,
              properties: {
                sender: { type: Type.STRING },
                action: { type: Type.STRING },
                duration: { type: Type.STRING },
                semantic_type: { type: Type.STRING }
              }
            },
            response_text: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as CommandResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockParseCommand(text);
  }
};
