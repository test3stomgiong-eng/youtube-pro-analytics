import React, { useState } from 'react';
import { AiAuditResult, ChannelData } from '../types/youtube';
import { askGeminiAi } from '../services/apiService';
import {
  Bot,
  Sparkles,
  CheckCircle,
  XCircle,
  Search,
  Type,
  Image,
  Calendar,
  Zap,
  Info,
  Target,
  DollarSign,
  Send,
  MessageSquare,
  HelpCircle,
  Loader2,
} from 'lucide-react';

interface AiAuditSectionProps {
  auditResult: AiAuditResult | null;
  onRunAudit: () => void;
  isAuditing: boolean;
  channelTitle: string;
  channel?: ChannelData;
}

export const AiAuditSection: React.FC<AiAuditSectionProps> = ({
  auditResult,
  onRunAudit,
  isAuditing,
  channelTitle,
  channel,
}) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string }>>([]);

  const samplePrompts = [
    'Gợi ý 3 ý tưởng video ngắn (Shorts) triệu view cho kênh này',
    'Làm thế nào để tăng tỷ lệ click (CTR) Thumbnail lên trên 8%?',
    'Đề xuất cấu trúc dàn ý video dài 10 phút thu hút giữ chân người xem',
    'Chiến lược kết hợp Affiliate Marketing & Tài trợ phù hợp nhất',
  ];

  const handleAskQuestion = async (qText?: string) => {
    const questionToAsk = qText || customQuestion;
    if (!questionToAsk.trim() || !channel || isAsking) return;

    setIsAsking(true);
    try {
      const answer = await askGeminiAi(channel, questionToAsk);
      setAiAnswers((prev) => [
        { q: questionToAsk, a: answer, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) },
        ...prev,
      ]);
      if (!qText) setCustomQuestion('');
    } catch (err: any) {
      setAiAnswers((prev) => [
        { q: questionToAsk, a: `Lỗi: ${err.message || 'Không thể kết nối Gemini AI.'}`, time: new Date().toLocaleTimeString('vi-VN') },
        ...prev,
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gemini AI Strategic Audit & Assistant
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đánh giá chuyên sâu định tính (SEO, Tiêu đề, Thumbnail, Định vị ngách, Tối ưu Doanh thu & Hỏi đáp AI thực tế).
          </p>
        </div>

        <button
          onClick={onRunAudit}
          disabled={isAuditing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-purple-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          {isAuditing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gemini Đang Phân Tích...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{auditResult ? 'Phân Tích Lại Với AI' : 'Khởi Chạy Gemini AI Audit'}</span>
            </>
          )}
        </button>
      </div>

      {!auditResult ? (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Chưa Có Kết Quả Gemini AI Audit</h3>
            <p className="text-xs text-slate-400">
              Nhấn nút bên trên để Gemini AI kiểm tra toàn bộ tiêu đề, phong cách thumbnail, cấu trúc SEO và đưa ra giải pháp thực tế cho kênh {channelTitle}.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Điểm Mạnh Cốt Lõi (Strengths)</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {auditResult.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-emerald-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Điểm Hạn Chế Cần Khắc Phục (Weaknesses)</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {auditResult.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-rose-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Strategy & Monetization Expansion Modules */}
          {(auditResult.contentNicheStrategy || auditResult.monetizationAdvice) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Module: Strategic Positioning & Shorts vs Long */}
              {auditResult.contentNicheStrategy && (
                <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                    <Target className="w-4 h-4" />
                    <span>Định Vị Ngách & Khán Giả Mục Tiêu</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-indigo-300 block">🎯 Định vị thương hiệu:</span>
                      <p className="text-slate-300">{auditResult.contentNicheStrategy.positioning}</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-300 block">⚡ Lời khuyên Video Ngắn vs Video Dài:</span>
                      <p className="text-slate-300">{auditResult.contentNicheStrategy.shortsVsLongAdvice}</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-300 block">👥 Chân dung khán giả:</span>
                      <p className="text-slate-300">{auditResult.contentNicheStrategy.targetAudience}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Module: Monetization Expansion */}
              {auditResult.monetizationAdvice && (
                <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>Tối Ưu & Mở Rộng Dòng Doanh Thu (Monetization)</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-300 block">💵 Tiềm năng Doanh thu AdSense:</span>
                      <p className="text-slate-300">{auditResult.monetizationAdvice.adRevenuePotential}</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="font-bold text-teal-300 block">🚀 Nguồn thu mở rộng nên áp dụng:</span>
                      <ul className="space-y-1">
                        {auditResult.monetizationAdvice.otherRevenueSources.map((src, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>{src}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detailed Audit Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* SEO Analysis */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                <Search className="w-4 h-4" />
                <span>Đánh Giá Chuẩn SEO & Từ Khóa</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {auditResult.seoAnalysis.scoreEvaluation}
              </p>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Từ khóa nổi bật quan sát được:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {auditResult.seoAnalysis.keywordsObserved.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Title Analysis */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <Type className="w-4 h-4" />
                <span>Đánh Giá Tiêu Đề & Gợi Ý Mẫu</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {auditResult.titleAnalysis.evaluation}
              </p>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mẫu tiêu đề đề xuất:
                </span>
                <ul className="space-y-1.5 text-xs text-amber-200">
                  {auditResult.titleAnalysis.suggestedTitles.map((t, i) => (
                    <li key={i} className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 font-medium">
                      💡 "{t}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Thumbnail Analysis */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
                <Image className="w-4 h-4" />
                <span>Đánh Giá & Gợi Ý Thiết Kế Thumbnail</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {auditResult.thumbnailAnalysis.evaluation}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {auditResult.thumbnailAnalysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule Strategy */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                <Calendar className="w-4 h-4" />
                <span>Chiến Lược Lịch Đăng Video</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {auditResult.scheduleStrategy.evaluation}
              </p>
              <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 font-semibold">
                📅 Lịch khuyến nghị: {auditResult.scheduleStrategy.optimalDays}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-gradient-to-br from-slate-950 to-purple-950/40 border border-purple-500/30 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Gợi Ý Cải Thiện Cần Làm Ngay (Actionable Steps)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {auditResult.actionableRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center shrink-0 border border-purple-500/30">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Assistant Area */}
          {channel && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                <MessageSquare className="w-4 h-4" />
                <span>Hỏi Trực Tiếp Gemini AI Về Kênh {channel.title}</span>
              </div>

              {/* Sample prompts */}
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={isAsking}
                    onClick={() => handleAskQuestion(prompt)}
                    className="text-left text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              {/* Custom input box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Nhập câu hỏi bất kỳ cho Gemini AI (Ví dụ: Đặt tiêu đề thu hút cho chủ đề du lịch?)..."
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  onClick={() => handleAskQuestion()}
                  disabled={isAsking || !customQuestion.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  {isAsking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Q&A history list */}
              {aiAnswers.length > 0 && (
                <div className="space-y-3 pt-2">
                  {aiAnswers.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs animate-fade-in">
                      <div className="flex items-center justify-between text-purple-300 font-bold border-b border-slate-800/80 pb-2">
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                          <span>Q: {item.q}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-line pt-1">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 italic justify-end">
            <Info className="w-3.5 h-3.5" />
            <span>Phân tích được tạo bởi Gemini AI ({auditResult.generatedAt.split('T')[0]})</span>
          </div>
        </div>
      )}
    </div>
  );
};

