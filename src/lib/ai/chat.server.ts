import { convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
import { createResponsesCall } from "./responses.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const BodySchema = z.object({
  threadId: z.string().min(1).max(100),
  context: z.string().max(4000).optional(),
  messages: z.array(z.any()).min(1).max(200),
});

const INSTRUCTIONS = `Você é a "Gota", assistente virtual do ALERTA CIVIL INTELIGENTE — uma estação meteorológica escolar (Instituto Estadual de Educação Dr. Caetano Munhoz da Rocha, Paranaguá – PR) que monitora temperatura, umidade, pressão, UV, qualidade do ar, vento, chuva e nível de água para emitir alertas preventivos à comunidade.

Como responder:
- Português do Brasil, frases curtas, linguagem simples, sem termos técnicos difíceis.
- Vá direto ao ponto: o que está acontecendo e o que a pessoa deve fazer. Use listas curtas quando ajudar.
- Os níveis de alerta são: 1 Informativo (azul), 2 Atenção (amarelo), 3 Alerta (laranja), 4 Emergência (vermelho).
- Use o "Estado atual da estação" abaixo quando a pergunta for sobre a situação agora. Deixe claro que são dados da estação local (no momento, simulados para testes), não previsões oficiais.
- Nunca invente previsões, limites oficiais ou alertas oficiais. Para informações oficiais, indique a Defesa Civil (199) e o INMET.
- Em risco de vida, oriente a ligar imediatamente: Defesa Civil 199, Bombeiros 193, SAMU 192, Polícia 190.
- Se a pergunta não tiver relação com tempo, clima, segurança ou o sistema, responda brevemente e com educação, e traga a conversa de volta ao tema.`;

export async function handleChat(request: Request): Promise<Response> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "A assistente não está configurada." }, { status: 500 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const messages = body.messages as UIMessage[];
  const instructions = body.context
    ? `${INSTRUCTIONS}\n\nEstado atual da estação:\n${body.context}`
    : INSTRUCTIONS;

  const modelMessages = await convertToModelMessages(messages);
  return createResponsesCall(
    request,
    { baseURL: GATEWAY_URL, apiKey, model: MODEL },
    modelMessages,
    instructions,
    messages,
  ).response();
}
