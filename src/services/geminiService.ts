import { GoogleGenAI } from "@google/genai";

export async function fetchDailyPressurePointsSummary() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    你是一位專業的社會與投資市場分析師。請根據今天的全球重大新聞、社交媒體趨勢及市場動態，找出符合以下「壓力點」（Pressure Points）徵兆的實例並提供每日總結：
    
    1. 傳媒表現：是否有大量頻道同時使用相同的激進辭彙或口號？
    2. 專家背書：是否有跨領域專家突然集體支持某項非其專業領域的政策？
    3. 身份認同：社交媒體上是否有大規模更換特定頭像或標籤的現象？
    4. 價值反轉：是否出現價值觀倒置的奧維爾式口號（如「言論自由會殺死人」）？
    5. 政府行為：是否有機構更名或突如其來的奇特法例推行？
    6. 投資市場：追蹤異常金錢流向、民意種子播種跡象及預測市場（如 Polymarket）的異常賠率。
    
    請以結構清晰的 Markdown 格式回覆，包含具體事件、分析原因及潛在影響。如果今天沒有明顯徵兆，請說明目前的觀察狀態。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text || "無法生成總結，請稍後再試。";
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    throw error;
  }
}
