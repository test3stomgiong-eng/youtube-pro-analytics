import React, { useState } from 'react';
import { ChannelData, HashtagCompetitorStrategy } from '../types/youtube';
import { fetchHashtagCompetitorStrategy } from '../services/apiService';
import {
  Hash,
  Users,
  Sparkles,
  Target,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Layers,
  Lightbulb,
  Loader2,
  BookmarkPlus,
  Compass,
} from 'lucide-react';

interface AiHashtagCompetitorSectionProps {
  channel: ChannelData;
}

export const AiHashtagCompetitorSection: React.FC<AiHashtagCompetitorSectionProps> = ({ channel }) => {
  const [data, setData] = useState<HashtagCompetitorStrategy | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState<boolean>(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHashtagCompetitorStrategy(channel);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kết nối AI phân tích đối thủ & Hashtag.');
    } finally {
      setLoading(false);
    }
  };

  const copyAllHashtags = () => {
    if (!data || !data.recommendedHashtags.length) return;
    const hashtagString = data.recommendedHashtags.map((h) => h.tag).join(' ');
    navigator.clipboard.writeText(hashtagString);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const copySingleText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Hash className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Phân Tích Chiến Lược Hashtag & Đối Thủ
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Trích xuất từ khóa chuẩn ngách, bộ Hashtag tối ưu hiển thị, và phân tích chiến lược đối thủ từ từ khóa kênh <strong className="text-slate-200">{channel.title}</strong>.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang quét từ khóa & đối thủ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{data ? 'Phân Tích Lại Bằng AI' : 'Kích Hoạt AI Phân Tích Ngách & Đối Thủ'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="py-12 text-center space-y-3 bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl">
          <Compass className="w-10 h-10 text-cyan-400/60 mx-auto animate-pulse" />
          <div className="text-sm font-semibold text-slate-300">
            Chưa có dữ liệu chiến lược Hashtag & Đối thủ
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nhấn nút <strong className="text-cyan-400">"Kích Hoạt AI Phân Tích"</strong> phía trên để Gemini AI tự động bóc tách từ khóa hạt giống, đề xuất bộ Hashtag triệu view và tìm ra khoảng trống cạnh tranh với đối thủ.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Keywords / Seed Keywords */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Từ Khóa Hạt Giống (Primary Niche Keywords)
              </span>
              <span className="text-[10px] text-slate-500">Bấm để sao chép từ khóa</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.mainKeywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => copySingleText(kw)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span className="font-medium">{kw}</span>
                  {copiedKeyword === kw ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Hashtags Grid */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Bộ Hashtag Gợi Ý Chuẩn SEO</h3>
              </div>
              <button
                onClick={copyAllHashtags}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-all"
              >
                {copiedHashtags ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã Sao Chép Bộ Hashtag!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao Chép Tất Cả Hashtag</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.recommendedHashtags.map((item, idx) => {
                const badgeColor =
                  item.type === 'trending'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : item.type === 'broad'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                return (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-2xl space-y-2 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-sm tracking-tight text-cyan-300">
                          {item.tag}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.whyUse}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>Tầm ảnh hưởng: <strong className="text-slate-200">{item.estimatedReach}</strong></span>
                      <button
                        onClick={() => copySingleText(item.tag)}
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {copiedKeyword === item.tag ? 'Đã chép' : 'Chép tag'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Clusters & Competitor Insights Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Topic Clusters */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>Cụm Chủ Đề Tiềm Năng (Topic Clusters)</span>
              </div>
              <div className="space-y-3">
                {data.topicClusterIdeas.map((cluster, idx) => (
                  <div key={idx} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-300">{cluster.topic}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-500/30">
                        Cơ hội: {cluster.opportunityScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cluster.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Strategy Insights */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-amber-400 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Phân Tích Đối Thủ Cạnh Tranh Trong Ngách</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Format Formats */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Định dạng đối thủ đang làm tốt nhất:
                  </span>
                  <p className="text-slate-300">{data.competitorInsights.topCompetitorFormats}</p>
                </div>

                {/* Content Gaps */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-teal-300 block flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Khoảng trống nội dung (Content Gaps) nên khai thác:
                  </span>
                  <ul className="space-y-1 pl-1">
                    {data.competitorInsights.contentGapsToExploit.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Winning Title Formulas */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-300 block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Mẫu Tiêu Đề Thắng Lớn Của Đối Thủ:
                  </span>
                  <div className="space-y-1">
                    {data.competitorInsights.winningTitlePatterns.map((pattern, idx) => (
                      <div
                        key={idx}
                        onClick={() => copySingleText(pattern)}
                        className="bg-slate-950 p-2 rounded-xl text-slate-300 hover:text-white border border-slate-800/80 cursor-pointer flex items-center justify-between text-[11px]"
                      >
                        <span>"{pattern}"</span>
                        <Copy className="w-3 h-3 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
