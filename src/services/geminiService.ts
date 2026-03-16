import { GoogleGenAI } from "@google/genai";
import { AISettings } from "../utils/aiProviders";

export interface NumerologyData {
  name: string;
  birthday: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  personalYear: number;
  targetYear: number;
  pinnacles: { level: number; value: number; age: string }[];
  challenges: { level: number; value: number }[];
  birthChart: Record<number, number>;
  nameChart: Record<number, number>;
}

function buildPrompt(data: NumerologyData): string {
  return `
Bạn là một chuyên gia Thần số học (Numerology) hàng đầu tại Việt Nam, am hiểu sâu sắc hệ thống Pitago và cách áp dụng cho người Việt.
Hãy phân tích các chỉ số sau cho người dùng:
- Họ tên: ${data.name} (Phân tích theo quy tắc chữ Y là nguyên âm/phụ âm của tiếng Việt)
- Ngày sinh: ${data.birthday}
- Số Chủ Đạo: ${data.lifePath}
- Số Sứ Mệnh: ${data.expression}
- Số Linh Hồn: ${data.soulUrge}
- Số Nhân Cách: ${data.personality}
- Năm Cá Nhân (${data.targetYear}): ${data.personalYear}
- Biểu đồ Ngày sinh (Số lượng): ${JSON.stringify(data.birthChart)}
- Biểu đồ Tên (Số lượng): ${JSON.stringify(data.nameChart)}
- 4 Đỉnh Cao: ${data.pinnacles.map(p => `Đỉnh ${p.level}(${p.age}): ${p.value}`).join(', ')}
- 4 Thử Thách: ${data.challenges.map(c => `Thử thách ${c.level}: ${c.value}`).join(', ')}

Yêu cầu:
1. Phân tích sự kết hợp giữa Biểu đồ Ngày sinh và Biểu đồ Tên để thấy sự bù trừ năng lượng (phương pháp phổ biến tại VN).
2. Giải thích ý nghĩa các con số dựa trên văn hóa và tư duy của người Việt.
3. Đưa ra lộ trình phát triển và các bài học thực tế.
4. Ngôn ngữ: Tiếng Việt truyền cảm, sâu sắc.
5. Định dạng: Markdown.
  `.trim();
}

// --- Gemini ---
async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text ?? "";
}

// --- OpenAI-compatible (Groq & OpenRouter) ---
async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
  extraHeaders?: Record<string, string>
): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? "";
}

// --- Main dispatcher ---
export async function getNumerologyReading(
  data: NumerologyData,
  settings: AISettings
): Promise<string> {
  const prompt = buildPrompt(data);
  const { providerId, apiKey, model } = settings;

  if (!apiKey) {
    throw new Error("Chưa có API Key. Vui lòng vào Cài đặt AI để nhập key.");
  }

  switch (providerId) {
    case "gemini":
      return callGemini(apiKey, model, prompt);

    case "groq":
      return callOpenAICompatible(
        "https://api.groq.com/openai/v1",
        apiKey,
        model,
        prompt
      );

    case "openrouter":
      return callOpenAICompatible(
        "https://openrouter.ai/api/v1",
        apiKey,
        model,
        prompt,
        {
          "HTTP-Referer": window.location.origin,
          "X-Title": "AuraNumerology",
        }
      );

    default:
      throw new Error("Provider không được hỗ trợ.");
  }
}
