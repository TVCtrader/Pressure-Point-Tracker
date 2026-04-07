/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Circle, 
  FileText,
  Search,
  Eye,
  RefreshCw,
  Calendar,
  Loader2
} from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { SOCIAL_PRESSURE_ITEMS, INVESTMENT_PRESSURE_ITEMS, SELF_PROTECTION_ITEMS } from './constants';
import { generateMarkdownReport, downloadFile } from './lib/report';
import { cn } from './lib/utils';
import { fetchDailyPressurePointsSummary } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

type Tab = 'DAILY' | 'FAT' | 'TREPAN' | 'PROTECTION';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('DAILY');
  const { state, toggleItem, setItemNote, setSummaryNote } = useAppState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dailySummary, setDailySummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const tabs = [
    { id: 'DAILY', label: '每日預判', icon: Calendar, items: [] },
    { id: 'FAT', label: '社會壓力點', icon: Waves, items: SOCIAL_PRESSURE_ITEMS },
    { id: 'TREPAN', label: '投資市場', icon: TrendingUp, items: INVESTMENT_PRESSURE_ITEMS },
    { id: 'PROTECTION', label: '預判自保', icon: ShieldCheck, items: SELF_PROTECTION_ITEMS },
  ];

  const handleFetchSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await fetchDailyPressurePointsSummary();
      setDailySummary(summary);
    } catch (error) {
      setDailySummary("獲取每日總結失敗，請檢查 API Key 或網路連接。");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'DAILY' && !dailySummary && !isLoadingSummary) {
      handleFetchSummary();
    }
  }, [activeTab]);

  const handleExport = () => {
    const markdown = generateMarkdownReport(state);
    downloadFile(markdown, `anti-brainwash-report-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
  };

  const currentTabData = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Desktop Header */}
      <header className="hidden md:flex sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Pressure Points Tracker</h1>
        </div>
        
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-semibold">匯出報告</span>
        </button>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-indigo-500" />
          <h1 className="text-lg font-bold text-white">Pressure Points</h1>
        </div>
        <button onClick={handleExport} className="p-2 text-slate-400 hover:text-white">
          <Download className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <currentTabData.icon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {activeTab === 'DAILY' ? 'DAILY' : activeTab === 'FAT' ? 'SOCIAL' : activeTab === 'TREPAN' ? 'MARKET' : 'STRATEGY'} ANALYSIS
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{currentTabData.label}</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                {activeTab === 'DAILY' && "利用 AI 實時檢索全球資訊，找出今日符合「壓力點」特徵的潛在事件。"}
                {activeTab === 'FAT' && "追蹤社會系統中最脆弱、最容易引發連鎖反應的「水壓」位置。"}
                {activeTab === 'TREPAN' && "在金融市場中，透過辨識權力機構的鋪排跡象來預見暴利機會。"}
                {activeTab === 'PROTECTION' && "當新聞鋪天蓋地時，透過核心提問看穿劇本，保護資產與人格。"}
              </p>
            </div>

            {activeTab === 'DAILY' ? (
              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 min-h-[400px] relative overflow-hidden">
                  {isLoadingSummary ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 space-y-4">
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                      <p className="text-slate-400 font-medium animate-pulse">正在檢索全球資訊並分析壓力點...</p>
                    </div>
                  ) : null}
                  
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-400" />
                      今日全球壓力點分析報告
                    </h3>
                    <button 
                      onClick={handleFetchSummary}
                      disabled={isLoadingSummary}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-400 disabled:opacity-50"
                    >
                      <RefreshCw className={cn("w-5 h-5", isLoadingSummary && "animate-spin")} />
                    </button>
                  </div>

                  <div className="prose prose-invert prose-indigo max-w-none">
                    {dailySummary ? (
                      <div className="markdown-body">
                        <ReactMarkdown>{dailySummary}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">點擊右上角刷新按鈕開始分析今日動態...</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-200/80">
                    注意：此分析由 AI 根據公開資訊生成，僅供結構性預判參考，不構成任何投資或行動建議。
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentTabData.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    className={cn(
                      "group p-6 rounded-2xl border transition-all duration-300",
                      state.checkedItems[item.id] 
                        ? "bg-indigo-900/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5" 
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {/* ... existing item content ... */}
                    <div className="flex items-start gap-4">
                      <button 
                        onClick={() => toggleItem(item.id)}
                        className={cn(
                          "mt-1 flex-shrink-0 transition-transform active:scale-90",
                          state.checkedItems[item.id] ? "text-indigo-500" : "text-slate-600"
                        )}
                      >
                        {state.checkedItems[item.id] ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <Circle className="w-7 h-7" />
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-4">
                        <div onClick={() => toggleItem(item.id)} className="cursor-pointer">
                          <h3 className={cn(
                            "text-xl font-bold transition-colors",
                            state.checkedItems[item.id] ? "text-white" : "text-slate-200"
                          )}>
                            {item.title}
                          </h3>
                          <p className="text-slate-400 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            觀察實例筆記
                          </label>
                          <textarea
                            value={state.itemNotes[item.id] || ''}
                            onChange={(e) => setItemNote(item.id, e.target.value)}
                            placeholder="記錄具體的觀察細節、新聞連結或疑點..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[100px] resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="pt-8 border-t border-slate-800">
              <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Eye className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">結構性預判總結</h3>
                </div>
                <textarea
                  value={state.summaryNotes[activeTab] || ''}
                  onChange={(e) => setSummaryNote(activeTab, e.target.value)}
                  placeholder={`針對 ${currentTabData.label} 的結構性觀察與預判結論...`}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-300 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[150px] resize-none"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around pb-safe">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
              activeTab === tab.id 
                ? "text-indigo-400" 
                : "text-slate-500"
            )}
          >
            <tab.icon className={cn("w-6 h-6", activeTab === tab.id ? "animate-pulse" : "")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
