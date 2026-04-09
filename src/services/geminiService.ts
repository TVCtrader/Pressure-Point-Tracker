import { GoogleGenAI } from "@google/genai";

export async function fetchDailyPressurePointsSummary() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    你是一位專業的社會與投資市場分析師。請**僅針對「當天」(Today) 或「過去 24 小時內」**發生的全球重大新聞、社交媒體趨勢及市場動態，找出符合以下「壓力點」（Pressure Points）徵兆的實例並提供每日總結。
    
    **嚴格要求：** 
    - 請忽略過往的歷史事件，除非該事件在今天有了重大的新進展、新鋪排或轉折。
    - 報告必須反映當下的實時「水壓」狀況。
    
    請將報告分為以下五個部分進行詳細分析：
    1. 全球 (Global)
    2. 美國 (USA)
    3. 中國 (China)
    4. 香港 (Hong Kong)
    5. 日本 (Japan)

    在每個部分中，必須包含以下三個子章節，若該區域在過去 24 小時內沒有相關發現，請明確寫出「沒有」：

    1) **社會壓力點辨識**：
       - 包含：傳媒表現（同步化訊息/激進辭彙）、專家背書（跨領域權威突然集體支持）、身份認同（社交媒體大規模更換頭像/標籤）、價值反轉（奧維爾式倒置口號）及政府行為（機構更名/突發奇特法例）。
    
    2) **投資市場壓力點**：
       - 包含：追蹤金錢流向（Follow the Money）、民意種子播種階段（為未來政策鋪墊的輿論）及預測市場（如 Polymarket）的異常賠率或應用。
    
    3) **預判自保策略**：
       - 提供結構性提問框架，幫助讀者在重大事件發生前看清背後的利益格局與潛在風險。

    請以結構清晰的 Markdown 格式回覆，包含具體事件、分析原因及潛在影響。
    
    **重要要求：** 
    - 對於提到的每一個具體事件或徵兆，請務必標註**消息來源出處**。
    - **必須提供可點擊的網址連結 (Website Address Link)**，並使用 Markdown 格式呈現（例如：[來源名稱](https://example.com)）。
    - **嚴格限制：所引用的網址連結必須是過去 24 小時內發布的新聞或頁面**，以確保資訊的即時性。
    - 優先引用主流媒體、官方公告或具公信力的數據平台。
    
    如果某個區域今天沒有明顯徵兆，請說明該區域目前的觀察狀態。
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
