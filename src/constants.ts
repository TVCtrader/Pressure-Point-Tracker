import { ChecklistItem } from './types';

export const SOCIAL_PRESSURE_ITEMS: ChecklistItem[] = [
  {
    id: 'sp-media',
    title: '傳媒表現 (Media Performance)',
    description: '50 個頻道同時說同一句對白，或用同一個激進辭彙。這代表訊息正在被高度同步化。',
    category: 'FAT', // Reusing category for logic but will rename labels in UI
  },
  {
    id: 'sp-expert',
    title: '專家背書 (Expert Endorsement)',
    description: '大量跨領域專家（非該學科）出來支持某項政策。例如明星講政策，或不相關的權威集體背書。',
    category: 'FAT',
  },
  {
    id: 'sp-identity',
    title: '身份認同 (Identity)',
    description: '社交媒體上突然有大量人同時更換特定的支持頭像。這是一種群體壓力的施加。',
    category: 'FAT',
  },
  {
    id: 'sp-value',
    title: '價值反轉 (Value Inversion)',
    description: '出現「言論自由會殺死人」、「性別是選擇」等奧維爾式口號。',
    category: 'FAT',
  },
  {
    id: 'sp-gov',
    title: '政府行為 (Government Action)',
    description: '改換機構名稱（如：國防部改稱戰爭部）以改變心理框架 (Frame)。',
    category: 'FAT',
  },
];

export const INVESTMENT_PRESSURE_ITEMS: ChecklistItem[] = [
  {
    id: 'inv-money',
    title: '追蹤金錢流向 (Follow the Money)',
    description: '當新政策推出時，問：「誰是最大得益者？」、「誰賺最多錢？」。利用 opensecrets.org 查詢。',
    category: 'TREPAN',
  },
  {
    id: 'inv-seeds',
    title: '觀察「民意種子」播種階段',
    description: '投資要在「專家出來背書」階段就行動。觀察不相關權威是否集體討論某議題。',
    category: 'TREPAN',
  },
  {
    id: 'inv-prediction',
    title: '利用預測市場 (Prediction Markets)',
    description: '參考 Polymarket 等對沖網站。這反映了真實賠率，通常比新聞更精準。',
    category: 'TREPAN',
  },
];

export const SELF_PROTECTION_ITEMS: ChecklistItem[] = [
  {
    id: 'prot-beneficiary',
    title: '誰是最大得益者？',
    description: '分析政策背後的利益團體，尤其是能源、製藥或軍事領域。',
    category: 'PROTECTION',
  },
  {
    id: 'prot-experts',
    title: '辨識「非專業專家」',
    description: '警惕那些被推出來作為宣傳（Propaganda）工具的跨領域權威。',
    category: 'PROTECTION',
  },
  {
    id: 'prot-adaptation',
    title: '適應 vs 解決問題',
    description: '判斷方案是在解決問題，還是強迫大眾在心理上「適應」未來危機。',
    category: 'PROTECTION',
  },
];
