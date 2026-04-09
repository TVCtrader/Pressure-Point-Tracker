import { GoogleGenAI } from "@google/genai";

export async function fetchDailyPressurePointsSummary() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toUTCString();
  
  const prompt = `
    【絕對指令：嚴格實時分析】
    現在的精確時間是：${currentTime}。
    今天的日期是：${currentDate} (YYYY-MM-DD)。
    
    你是一位專業的社會與投資市場分析師。你的任務是執行「壓力點」（Pressure Points）實時監控。
    
    **檢索與過濾規則（極其重要）：**
    1. **僅限 24 小時內**：你必須使用 Google Search 檢索，並且「只」提取在過去 24 小時內（即 ${currentDate} 當天）發布的新聞、社交媒體貼文或公告。
    2. **禁止舊聞**：嚴禁引用任何發布日期早於 ${currentDate} 的資訊。如果搜尋結果顯示是 1 天前、2 天前或更久，請立即捨棄。
    3. **年份校驗**：現在是 2026 年。嚴禁引用 2025 年或更早的任何數據。
    4. **實時水壓**：報告必須反映「此時此刻」的社會與市場壓力狀況。

    **分析架構（請將以下五個區域視為「獨立單位」進行詳細分析）：**
    1. **全球 (Global)**：專注於國際組織（如 UN, WHO, WEF）、跨國地緣政治、全球性經濟趨勢及跨國社會運動。
    2. **美國 (USA)**：專注於美國國內政治、法律、社會事件及美國本土市場動態。
    3. **中國 (China)**
    4. **香港 (Hong Kong)**
    5. **日本 (Japan)**

    每個獨立單位必須包含以下三個子章節。若 24 小時內完全沒有符合特徵的事件，請直接寫「沒有」。

    1) **社會壓力點辨識** (必須包含以下 5 點分析)：
       1. **傳媒表現（同步化訊息）**：是否有大量頻道同時使用相同的激進辭彙、口號或敘事結構？
       2. **專家背書（跨領域權威）**：是否有跨領域專家突然集體支持某項非其專業領域的政策或觀點？
       3. **身份認同（更換頭像）**：社交媒體上是否有大規模更換特定頭像、標籤或加入特定符號的現象？
       4. **價值反轉（奧維爾式口號）**：是否出現價值觀倒置的口號（如「戰爭即和平」、「言論自由會殺死人」）？
       5. **政府行為（機構更名）**：是否有政府機構突然更名、成立奇特的新部門或推行突如其來的奇特法例？
    
    2) **投資市場壓力點** (必須包含以下 3 點分析)：
       1. **「追蹤金錢流向」（Follow the Money）**：追蹤異常的大額資金流動、企業收購或資產轉移跡象。
       2. **「民意種子播種階段」**：辨識是否正在進行為未來政策或市場轉向鋪墊的輿論引導。
       3. **「預測市場」（如 Polymarket）的應用**：監控預測市場中的異常賠率波動或針對特定事件的對沖行為。
    
    3) **預判自保策略**：
       - 針對上述事件，提供結構性提問框架以看清利益格局。

    **引用與連結規範（防止 404）：** 
    - **禁止幻覺連結**：嚴禁根據標題自行猜測或構建網址。你提供的網址必須是 Google Search 工具返回的**真實、完整、原始連結**。
    - **連結準確性**：在輸出連結前，請二次核對網址是否與搜尋結果中的 "link" 字段完全一致。
    - **優先級**：優先選擇來自知名新聞機構（如 Reuters, Bloomberg, AP, BBC 等）或政府官方網站的連結，這些連結通常更穩定。
    - **格式**：必須提供 Markdown 格式的可點擊網址連結：[來源名稱](正確的原始網址)。
    - **連結驗證**：你必須確保你提供的網址內容確實是 ${currentDate} 當天更新的。

    請以結構清晰的 Markdown 格式回覆。
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
