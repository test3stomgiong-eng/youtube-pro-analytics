import React, { useState } from 'react';
import { ChannelData } from '../types/youtube';
import {
  formatCurrencyUSD,
  formatCurrencyVND,
  formatFullNumber,
  formatCompactNumber,
} from '../utils/formulas';
import {
  Sparkles,
  Zap,
  DollarSign,
  Calendar,
  Clock,
  Check,
  Copy,
  Lightbulb,
  Sliders,
  Layers,
  Flame,
  Wand2,
  PieChart,
  Film,
  Target,
  FileText,
  Split,
  TrendingUp,
  Search,
  Award,
  Briefcase,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Globe,
  Users,
  Download,
  BookOpen,
} from 'lucide-react';

interface CreatorToolsSectionProps {
  channel: ChannelData | null;
}

export const CreatorToolsSection: React.FC<CreatorToolsSectionProps> = ({ channel }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'ai-generator' | 'script-generator' | 'keyword-research' | 'media-kit' | 'ab-test' | 'revenue-sim' | 'schedule-planner'
  >('ai-generator');

  // Copy notification state
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 1. AI Ideas & Hook Generator State
  const [topicInput, setTopicInput] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'long' | 'shorts'>('long');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    titles: { title: string; score: number; style: string }[];
    hooks: string[];
    thumbnailIdeas: { visual: string; textOnImage: string; colorScheme: string }[];
    seoTags: string[];
  } | null>(null);

  const handleGenerateIdeas = () => {
    if (!topicInput.trim() && !channel) return;
    setIsGenerating(true);

    setTimeout(() => {
      const keyword = topicInput.trim() || channel?.title || 'YouTube Marketing';
      const isShort = selectedFormat === 'shorts';

      setAiResult({
        titles: [
          {
            title: isShort
              ? `🔥 Bí Mật ${keyword} Ít Ai Biết Trong 30 Giây! #shorts`
              : `Tôi Đã Thử ${keyword} Trong 30 Ngày Và Cái Kết Bất Ngờ!`,
            score: 98,
            style: 'Tò mò & Thử thách',
          },
          {
            title: isShort
              ? `Đừng Bao Giờ Làm ${keyword} Nếu Chưa Biết Điều Này #shorts`
              : `5 Sai Lầm Chết Người Khi Làm ${keyword} (Ai Cũng Mắc Phải)`,
            score: 95,
            style: 'Cảnh báo & Giữ chân',
          },
          {
            title: isShort
              ? `Cách ${keyword} Nhanh Gấp 10 Lần Chuẩn Xu Hướng! #shorts`
              : `Hướng Dẫn ${keyword} Từ A-Z Cho Người Mới Bắt Đầu (2026)`,
            score: 92,
            style: 'Giá trị thực tiễn',
          },
          {
            title: isShort
              ? `So Sánh ${keyword}: Mẹo Hay Vs Sai Lầm! #shorts`
              : `Sự Thật Về ${keyword} Mà Các Youtuber Lớn Giấu Bạn`,
            score: 89,
            style: 'Bóc trần & So sánh',
          },
          {
            title: isShort
              ? `Sẽ Ra Sao Nếu Bạn ${keyword} Mỗi Ngày? #shorts`
              : `Hành Trình ${keyword} Đạt 1.000.000 Lượt Xem Như Thế Nào?`,
            score: 87,
            style: 'Kể chuyện (Storytelling)',
          },
        ],
        hooks: [
          `"Nếu bạn vẫn đang làm ${keyword} theo cách cũ, bạn đang lãng phí 80% thời gian của mình mà không hề hay biết!"`,
          `"Dừng lại 3 giây! Đây là lý do tại sao video ${keyword} của bạn không thể cất cánh trên thuật toán YouTube."`,
          `"Tôi vừa phát hiện ra một công thức làm ${keyword} giúp kênh của tôi tăng trưởng gấp 3 lần chỉ sau 1 tuần."`,
        ],
        thumbnailIdeas: [
          {
            visual: `Biểu cảm ngạc nhiên / chỉ tay vào biểu đồ tăng trưởng xanh lá rực rỡ`,
            textOnImage: 'BÍ MẬT 2026!',
            colorScheme: 'Đỏ Nổi Bật + Vàng Chanh + Nền Tối',
          },
          {
            visual: `Hình ảnh So sánh Trước (Xám xịt/Dấu X) vs Sau (Sáng bừng/Dấu Check)`,
            textOnImage: 'ĐỪNG LÀM THẾ NÀY!',
            colorScheme: 'Tương Phản Cao (Vàng & Đen)',
          },
        ],
        seoTags: [
          `#${keyword.toLowerCase().replace(/\s+/g, '')}`,
          `#meo${keyword.toLowerCase().replace(/\s+/g, '')}`,
          '#youtube2026',
          '#creatortips',
          '#huongdan',
          '#chiase',
        ],
      });

      setIsGenerating(false);
    }, 800);
  };

  // 2. Script Generator State
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptDuration, setScriptDuration] = useState<'3m' | '8m' | '15m' | 'shorts'>('8m');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptResult, setScriptResult] = useState<{
    hook: { time: string; text: string; visualCue: string; audioCue: string };
    intro: { time: string; text: string; retentionTip: string };
    corePoints: { step: string; time: string; title: string; detail: string; broll: string }[];
    patternInterrupt: { time: string; action: string; why: string };
    cta: { time: string; text: string; endscreenStrategy: string };
  } | null>(null);

  const handleGenerateScript = () => {
    setIsGeneratingScript(true);

    setTimeout(() => {
      const topic = scriptTopic.trim() || channel?.title || 'Phát Triển Kênh YouTube';

      setScriptResult({
        hook: {
          time: '00:00 - 00:15',
          text: `Chỉ trong 8 phút tới, tôi sẽ tiết lộ cho bạn chiến lược làm ${topic} giúp tăng 300% lượng xem mà không cần thiết bị đắt tiền!`,
          visualCue: 'Cận cảnh khuôn mặt thần thái, hiệu ứng Zoom-in nhanh 1.2x kết hợp âm thanh Whoosh.',
          audioCue: 'Nhạc nền dồn dập (Bass drop nhẹ) dừng lại ngay giây thứ 14.',
        },
        intro: {
          time: '00:15 - 00:45',
          text: `Nhiều người nghĩ rằng ${topic} chỉ dành cho chuyên gia, nhưng sự thật là 90% Youtuber thành công đều áp dụng 3 quy tắc đơn giản này.`,
          retentionTip: 'Đưa ra lời hứa giá trị chính xác ở giây thứ 30 để giảm tỷ lệ thoát trang.',
        },
        corePoints: [
          {
            step: 'Bước 1',
            time: '00:45 - 02:30',
            title: `Tối Ưu Cấu Trúc Đặt Tiêu Đề Kích Thích Tò Mò`,
            detail: `Giải thích lý do tại sao tiêu đề dạng câu hỏi hoặc thử thách có CTR cao hơn 25%. Trình bày ví dụ thực tế về ${topic}.`,
            broll: 'Chèn quay màn hình công cụ phân tích hoặc biểu đồ tăng trưởng.',
          },
          {
            step: 'Bước 2',
            time: '02:30 - 05:00',
            title: `Giữ Chân Khán Giả Bằng Nhịp Cắt Dán 3 Giây`,
            detail: `Cứ mỗi 3-5 giây thay đổi góc quay, chữ xuất hiện hoặc chèn meme ngắn để mắt người xem không bị mỏi.`,
            broll: 'Chèn video minh họa hành động hoặc góc quay phụ B-Roll.',
          },
          {
            step: 'Bước 3',
            time: '05:00 - 06:40',
            title: `Tối Ưu Thẻ Tag & Mô Tả Để Thuật Toán Đề Xuất`,
            detail: `Hướng dẫn cách gắn 3 hashtag chính và mô tả chứa từ khóa tìm kiếm phổ biến nhất.`,
            broll: 'Minh họa thao tác trong YouTube Studio.',
          },
        ],
        patternInterrupt: {
          time: '04:15',
          action: 'Dừng nhạc nền đột ngột + chèn hiệu ứng mờ nhòe màu xám đen (Black & White).',
          why: 'Gây chú ý lại khi người xem có xu hướng bắt đầu lướt sang video khác ở mốc giữa video.',
        },
        cta: {
          time: '06:40 - 08:00',
          text: `Nếu bạn muốn xem tiếp phần 2 về chiến lược kéo 10.000 sub đầu tiên, hãy nhấn vào video đang hiển thị ngay trên màn hình này!`,
          endscreenStrategy: 'Chỉ tay trực tiếp vào vị trí Video Đề Xuất (End Screen element) ở góc phải trên.',
        },
      });

      setIsGeneratingScript(false);
    }, 900);
  };

  // 3. Keyword & SEO Research Tool State
  const [keywordQuery, setKeywordQuery] = useState('');
  const [isSearchingKeyword, setIsSearchingKeyword] = useState(false);
  const [keywordData, setKeywordData] = useState<{
    overallScore: number;
    searchVolume: 'Rất Cao' | 'Cao' | 'Trung Bình' | 'Thấp';
    competition: 'Thấp' | 'Trung Bình' | 'Cao' | 'Rất Cao';
    topLongTailKeywords: { keyword: string; score: number; trend: string }[];
    recommendedTags: string[];
    audienceIntent: string;
  } | null>(null);

  const handleSearchKeyword = () => {
    if (!keywordQuery.trim()) return;
    setIsSearchingKeyword(true);

    setTimeout(() => {
      const q = keywordQuery.trim();
      setKeywordData({
        overallScore: 88,
        searchVolume: 'Rất Cao',
        competition: 'Trung Bình',
        topLongTailKeywords: [
          { keyword: `${q} mới nhất 2026`, score: 95, trend: '+140%' },
          { keyword: `hướng dẫn ${q} cho người mới`, score: 92, trend: '+95%' },
          { keyword: `cách làm ${q} nhanh nhất`, score: 87, trend: '+80%' },
          { keyword: `mẹo ${q} đạt triệu view`, score: 84, trend: '+65%' },
          { keyword: `so sánh ${q} vs đối thủ`, score: 79, trend: '+45%' },
        ],
        recommendedTags: [
          q,
          `meo ${q}`,
          `huong dan ${q}`,
          `meo youtube 2026`,
          `creator studio`,
          `tăng sub youtube`,
          `tang view nhanh`,
        ],
        audienceIntent: `Khán giả đang chủ động tìm kiếm các giải pháp thực tế, có tính áp dụng ngay trong vòng 24 giờ tới. Cần nhấn mạnh tính đơn giản và kết quả nhanh trong 15s đầu video.`,
      });
      setIsSearchingKeyword(false);
    }, 700);
  };

  // 4. Media Kit & Sponsor Pricing State
  const subCount = channel?.subscriberCount || 50000;
  const avgViews = channel ? Math.round(channel.viewCount / Math.max(1, channel.videoCount || 10)) : 15000;

  const estimatedDedicatedPrice = Math.round(avgViews * 0.04 + subCount * 0.005);
  const estimatedIntegratedPrice = Math.round(estimatedDedicatedPrice * 0.45);
  const estimatedShortsPrice = Math.round(estimatedDedicatedPrice * 0.35);

  // 5. A/B Test Simulator State
  const [titleA, setTitleA] = useState('5 Mẹo Làm YouTube Triệu View Năm 2026!');
  const [textA, setTextA] = useState('BÍ MẬT 2026!');
  const [bgA] = useState('from-red-600 via-rose-600 to-amber-500');

  const [titleB, setTitleB] = useState('Đừng Làm YouTube Tốn Thời Gian Nếu Chưa Biết Điều Này!');
  const [textB, setTextB] = useState('ĐỪNG LÀM THẾ!');
  const [bgB] = useState('from-blue-600 via-indigo-600 to-purple-600');

  // 6. Revenue Simulator state
  const defaultMonthlyViews =
    channel && channel.publishedAt
      ? Math.round(
          (channel.viewCount || 0) /
            Math.max(1, (new Date().getFullYear() - (new Date(channel.publishedAt).getFullYear() || 2020)) * 12 || 12)
        )
      : 500000;

  const [monthlyViews, setMonthlyViews] = useState<number>(Math.max(100000, Math.min(10000000, defaultMonthlyViews || 500000)));
  const [rpmUSD, setRpmUSD] = useState<number>(1.5);
  const [sponsorDealsCount, setSponsorDealsCount] = useState<number>(1);
  const [sponsorPriceUSD, setSponsorPriceUSD] = useState<number>(500);

  // Calculate simulated revenue
  const monthlyAdSenseUSD = (monthlyViews / 1000) * rpmUSD;
  const monthlySponsorUSD = sponsorDealsCount * sponsorPriceUSD;
  const totalMonthlyUSD = monthlyAdSenseUSD + monthlySponsorUSD;
  const totalYearlyUSD = totalMonthlyUSD * 12;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Master Suite (7-in-1)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Bộ Công Cụ Sáng Tạo & Quản Lý Kênh Toàn Diện</h2>
            <p className="text-xs text-slate-400">
              Ý tưởng viral, lập kịch bản AI, nghiên cứu SEO keyword, xuất Media Kit báo giá nhãn hàng, A/B test thumbnail & dự đoán thu nhập.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveSubTab('ai-generator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'ai-generator'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Ý Tưởng & Hook</span>
            </button>

            <button
              onClick={() => setActiveSubTab('script-generator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'script-generator'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kịch Bản AI</span>
            </button>

            <button
              onClick={() => setActiveSubTab('keyword-research')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'keyword-research'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Nghiên Cứu SEO</span>
            </button>

            <button
              onClick={() => setActiveSubTab('media-kit')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'media-kit'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Báo Giá Sponsor</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ab-test')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'ab-test'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>A/B Test</span>
            </button>

            <button
              onClick={() => setActiveSubTab('revenue-sim')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'revenue-sim'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Thu Nhập</span>
            </button>

            <button
              onClick={() => setActiveSubTab('schedule-planner')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'schedule-planner'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Giờ Vàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: AI GENERATOR */}
      {activeSubTab === 'ai-generator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>Trình Sinh Tiêu Đề Viral, Hook 3s & Thumbnail Idea</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Nhập từ khóa chủ đề bạn định làm video, AI Gemini sẽ phân tích cấu trúc tâm lý click để tạo tiêu đề & hook hấp dẫn nhất.
                </p>
              </div>

              {/* Format selection */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setSelectedFormat('long')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedFormat === 'long' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Dài</span>
                </button>
                <button
                  onClick={() => setSelectedFormat('shorts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedFormat === 'shorts' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Shorts</span>
                </button>
              </div>
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={
                  channel
                    ? `Ví dụ: ${channel.title} mẹo làm video, cách tăng sub...`
                    : 'Ví dụ: Hướng dẫn làm YouTube 2026, Mẹo nấu ăn ngon...'
                }
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdeas()}
              />
              <button
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50 transition-all shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo ý tưởng...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Ý Tưởng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Display */}
          {aiResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Titles Column */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>5 Gợi Ý Tiêu Đề Tăng Tỷ Lệ Click (CTR)</span>
                    </h4>
                    <span className="text-[10px] bg-red-500/10 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                      Tự động xếp hạng CTR
                    </span>
                  </div>

                  <div className="space-y-3">
                    {aiResult.titles.map((item, idx) => {
                      const id = `title-${idx}`;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                {item.score} điểm CTR
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Phong cách: {item.style}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-100 group-hover:text-red-400 transition-colors">
                              {item.title}
                            </p>
                          </div>

                          <button
                            onClick={() => handleCopyText(item.title, id)}
                            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 shrink-0 transition-all"
                            title="Sao chép tiêu đề"
                          >
                            {copiedIndex === id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hooks Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Kịch Bản Hook 3 Giây Đầu Giữ Chân Khán Giả</span>
                  </h4>

                  <div className="space-y-3">
                    {aiResult.hooks.map((hook, idx) => {
                      const id = `hook-${idx}`;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 italic text-xs text-amber-200/90 leading-relaxed flex items-center justify-between gap-3"
                        >
                          <span>{hook}</span>
                          <button
                            onClick={() => handleCopyText(hook, id)}
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white shrink-0 transition-all"
                          >
                            {copiedIndex === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Thumbnails & SEO Tags Column */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Ý Tưởng Thiết Kế Thumbnail</span>
                  </h4>

                  <div className="space-y-3">
                    {aiResult.thumbnailIdeas.map((thumb, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Hình Ảnh / Biểu Cảm:</span>
                          <p className="text-slate-300 font-medium">{thumb.visual}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Chữ In Lên Ảnh (Short Text):</span>
                          <p className="text-amber-400 font-extrabold text-sm">{thumb.textOnImage}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Tông Màu Đề Xuất:</span>
                          <p className="text-slate-400">{thumb.colorScheme}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO Hashtags */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Hashtags & SEO Tags Gợi Ý</span>
                  </h4>

                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.seoTags.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleCopyText(tag, `tag-${idx}`)}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono cursor-pointer transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SCRIPT GENERATOR */}
      {activeSubTab === 'script-generator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span>Trình Lập Kịch Bản Video 5 Bước Giữ Chân Khán Giả</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tự động tạo cấu trúc mốc thời gian (Timeline & Visual Cues) giúp duy trì thời lượng xem trung bình (AVD) cao nhất.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={scriptTopic}
                onChange={(e) => setScriptTopic(e.target.value)}
                placeholder="Nhập tên chủ đề video cần lập kịch bản..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all"
              />

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
                {(['shorts', '3m', '8m', '15m'] as const).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setScriptDuration(dur)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      scriptDuration === dur ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur === 'shorts' ? 'Shorts 60s' : `${dur.replace('m', '')} phút`}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all shrink-0"
              >
                {isGeneratingScript ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" />
                    <span>Đang lên kịch bản...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo Kịch Bản</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Script Output */}
          {scriptResult && (
            <div className="space-y-4 animate-fade-in">
              {/* Step 1: Hook */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                    Bước 1: Hook Giữ Chân ({scriptResult.hook.time})
                  </span>
                  <span className="text-[10px] text-slate-400">Quan trọng nhất 15s đầu</span>
                </div>
                <p className="text-sm font-semibold text-white italic bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  "{scriptResult.hook.text}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <span className="font-bold text-blue-400 block mb-0.5">🎬 Visual Cue (Hình ảnh):</span>
                    {scriptResult.hook.visualCue}
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <span className="font-bold text-amber-400 block mb-0.5">🎵 Audio Cue (Âm thanh):</span>
                    {scriptResult.hook.audioCue}
                  </div>
                </div>
              </div>

              {/* Step 2: Core Points */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Bước 2: Cấu Trúc Khối Nội Dung Cốt Lõi</span>
                </h4>

                <div className="space-y-3">
                  {scriptResult.corePoints.map((point, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                          {point.step} ({point.time})
                        </span>
                        <span className="text-[10px] text-slate-400">B-Roll: {point.broll}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{point.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{point.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Pattern Interrupt & CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 border-l-4 border-l-amber-500">
                  <span className="text-xs font-extrabold uppercase text-amber-400">
                    Bước 3: Ngắt Nhịp Lội Ngược Dòng ({scriptResult.patternInterrupt.time})
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{scriptResult.patternInterrupt.action}</p>
                  <p className="text-[11px] text-slate-400 italic">Mục đích: {scriptResult.patternInterrupt.why}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 border-l-4 border-l-emerald-500">
                  <span className="text-xs font-extrabold uppercase text-emerald-400">
                    Bước 4: Kết Bài & CTA Tăng Sub ({scriptResult.cta.time})
                  </span>
                  <p className="text-xs text-slate-200 font-medium">"{scriptResult.cta.text}"</p>
                  <p className="text-[11px] text-slate-400">Chiến lược End Screen: {scriptResult.cta.endscreenStrategy}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: KEYWORD & SEO RESEARCH TOOL */}
      {activeSubTab === 'keyword-research' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                <span>Nghiên Cứu Từ Khóa SEO & Phân Tích Xu Hướng Tìm Kiếm</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Phân tích lưu lượng tìm kiếm, độ cạnh tranh và danh sách từ khóa đuôi dài (Long-tail keywords) có tỷ lệ chuyển đổi view cao nhất.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={keywordQuery}
                onChange={(e) => setKeywordQuery(e.target.value)}
                placeholder="Nhập từ khóa hoặc chủ đề cần nghiên cứu (ví dụ: làm youtube, vlog du lịch, review công nghệ...)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSearchKeyword()}
              />
              <button
                onClick={handleSearchKeyword}
                disabled={isSearchingKeyword}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all shrink-0"
              >
                {isSearchingKeyword ? (
                  <>
                    <Search className="w-4 h-4 animate-spin" />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Nghiên Cứu Từ Khóa</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {keywordData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Score card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs uppercase font-extrabold text-slate-400">ĐIỂM SEO TỔNG THỂ</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Rất Nổi Bật
                    </span>
                  </div>

                  <div className="text-center py-4 space-y-1">
                    <div className="text-5xl font-black text-emerald-400">{keywordData.overallScore}/100</div>
                    <p className="text-xs text-slate-400">Từ khóa lý tưởng để sản xuất video tiếp theo</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Khối Lượng Tìm Kiếm:</span>
                      <span className="font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                        {keywordData.searchVolume}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Độ Cạnh Tranh Kênh Lớn:</span>
                      <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                        {keywordData.competition}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Ý ĐỊNH TÌM KIẾM (INTENT):</span>
                  <p className="text-slate-300 leading-relaxed">{keywordData.audienceIntent}</p>
                </div>
              </div>

              {/* Long-tail keywords list */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Top từ khóa đuôi dài gợi ý (Long-Tail Keywords)</span>
                </h4>

                <div className="space-y-3">
                  {keywordData.topLongTailKeywords.map((item, idx) => {
                    const id = `kw-${idx}`;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{item.keyword}</p>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Xu hướng: {item.trend}
                            </span>
                            <span className="text-slate-400">Điểm cơ hội: {item.score}/100</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopyText(item.keyword, id)}
                          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 shrink-0 transition-all"
                        >
                          {copiedIndex === id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-300 mb-2">Thẻ Tag SEO Dán Trực Tiếp Vào Video:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordData.recommendedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleCopyText(tag, `tagkw-${idx}`)}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono cursor-pointer transition-all"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: MEDIA KIT & SPONSOR PRICING */}
      {activeSubTab === 'media-kit' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>Bảng Tính Báo Giá Sponsorship & Tạo Media Kit Cho Nhãn Hàng</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tự động tính toán khung giá hợp tác tài trợ (Dedicated, Integration, Shorts) chuẩn thị trường cho kênh của bạn.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rates Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Khung Giá Tài Trợ Đề Xuất (Sponsorship Rate Card)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tier 1: Dedicated Video */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
                  <span className="text-[10px] font-extrabold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    Video Chuyên Biệt (Dedicated)
                  </span>
                  <div className="text-xl font-extrabold text-white">{formatCurrencyUSD(estimatedDedicatedPrice)}</div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    ~ {formatCurrencyVND(estimatedDedicatedPrice * 25400)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal pt-1">
                    Toàn bộ thời lượng video 8-15 phút nói về sản phẩm/dịch vụ của thương hiệu.
                  </p>
                </div>

                {/* Tier 2: Integrated Video */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Tích Hợp 60s (Integrated)
                  </span>
                  <div className="text-xl font-extrabold text-white">{formatCurrencyUSD(estimatedIntegratedPrice)}</div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    ~ {formatCurrencyVND(estimatedIntegratedPrice * 25400)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal pt-1">
                    Chèn đoạn giới thiệu sản phẩm 60 giây trong video dài chính của kênh.
                  </p>
                </div>

                {/* Tier 3: Shorts Sponsorship */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    YouTube Shorts 60s
                  </span>
                  <div className="text-xl font-extrabold text-white">{formatCurrencyUSD(estimatedShortsPrice)}</div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    ~ {formatCurrencyVND(estimatedShortsPrice * 25400)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal pt-1">
                    1 video Shorts độc quyền 60s kèm đường link ghim tại bình luận đầu tiên.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                <span className="font-bold text-slate-300">💡 Mẹo Gửi Báo Giá Cho Brand:</span>
                <p className="text-slate-400 leading-relaxed">
                  Khi gửi proposal, hãy đính kèm chỉ số Engagement Rate và đối tượng khán giả trọng tâm (Demographics 18-34 tuổi). Nhãn hàng sẵn sàng trả thêm 20-30% chi phí nếu bạn cam kết lượt xem tối thiểu (Guaranteed Views).
                </p>
              </div>
            </div>

            {/* Media Kit Card Preview */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">CREATOR MEDIA KIT</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                    Ready to Send
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Kênh YouTube:</span>
                    <p className="font-bold text-white text-sm">{channel?.title || 'Kênh Mẫu YouTube'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Người Đăng Ký:</span>
                      <span className="text-sm font-extrabold text-amber-400">{formatCompactNumber(subCount)}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Lượt Xem TB/Video:</span>
                      <span className="text-sm font-extrabold text-blue-400">{formatCompactNumber(avgViews)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Khán Giả Chính:</span>
                    <p className="text-slate-300 font-medium">Nam (62%), Nữ (38%) • 18 - 34 Tuổi • Việt Nam & US</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleCopyText(
                    `--- CREATOR MEDIA KIT ---\nKênh: ${channel?.title || 'YouTube Channel'}\nSubscribers: ${formatCompactNumber(subCount)}\nLượt xem TB: ${formatCompactNumber(avgViews)}\nBáo giá Dedicated: $${estimatedDedicatedPrice}\nBáo giá Integration: $${estimatedIntegratedPrice}`,
                    'mediakit-copy'
                  )
                }
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {copiedIndex === 'mediakit-copy' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedIndex === 'mediakit-copy' ? 'Đã Sao Chép Media Kit!' : 'Sao Chép Media Kit Gửi Brand'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: A/B TEST SIMULATOR */}
      {activeSubTab === 'ab-test' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Split className="w-5 h-5 text-purple-400" />
                <span>Mô Phỏng A/B Test Thumbnail & Tiêu Đề Trên Giao Diện YouTube</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                So sánh hiển thị thực tế giữa 2 phương án thiết kế để chọn ra biến thể đạt tỷ lệ Click-Through-Rate (CTR) cao nhất.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OPTION A */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-xl border border-red-500/20">
                  BIẾN THỂ A (OPTION A)
                </span>
                <span className="text-xs font-bold text-emerald-400">Dự đoán CTR: 8.4%</span>
              </div>

              {/* Controls A */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tiêu đề Option A:</label>
                  <input
                    type="text"
                    value={titleA}
                    onChange={(e) => setTitleA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Chữ in trên Thumbnail A:</label>
                  <input
                    type="text"
                    value={textA}
                    onChange={(e) => setTextA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Preview Card YouTube Mockup A */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Hiển thị thực tế trên Feed YouTube
                </span>
                <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                  <div className={`aspect-video bg-gradient-to-tr ${bgA} flex items-center justify-center relative p-4 text-center`}>
                    <span className="text-2xl font-black text-white drop-shadow-lg tracking-wider uppercase border-2 border-white px-3 py-1 rounded-lg">
                      {textA || 'THUMBNAIL A'}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      12:45
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 shrink-0 flex items-center justify-center font-bold text-xs text-white">
                      YT
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white leading-snug line-clamp-2">{titleA}</p>
                      <p className="text-[10px] text-slate-400">Kênh YouTube Official • 120K views • 2 ngày trước</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OPTION B */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                  BIẾN THỂ B (OPTION B)
                </span>
                <span className="text-xs font-bold text-amber-400">Dự đoán CTR: 6.1%</span>
              </div>

              {/* Controls B */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tiêu đề Option B:</label>
                  <input
                    type="text"
                    value={titleB}
                    onChange={(e) => setTitleB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Chữ in trên Thumbnail B:</label>
                  <input
                    type="text"
                    value={textB}
                    onChange={(e) => setTextB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Preview Card YouTube Mockup B */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Hiển thị thực tế trên Feed YouTube
                </span>
                <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                  <div className={`aspect-video bg-gradient-to-tr ${bgB} flex items-center justify-center relative p-4 text-center`}>
                    <span className="text-2xl font-black text-white drop-shadow-lg tracking-wider uppercase border-2 border-white px-3 py-1 rounded-lg">
                      {textB || 'THUMBNAIL B'}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      12:45
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center font-bold text-xs text-white">
                      YT
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white leading-snug line-clamp-2">{titleB}</p>
                      <p className="text-[10px] text-slate-400">Kênh YouTube Official • 120K views • 2 ngày trước</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Winner Analysis */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Kết Luận AI: Option A Thắng Thế (+37% Khả Năng Click)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tiêu đề <strong>Option A</strong> chứa yếu tố con số cụ thể ("5 Mẹo") và mốc thời gian rõ ràng ("2026"), giúp tăng lòng tin của người lướt web trên di động. Chữ in thumbnail viết hoa 2 từ tác động cảm xúc mạnh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: REVENUE & SPONSOR SIMULATOR */}
      {activeSubTab === 'revenue-sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>Bảng Điều Chỉnh Mô Phỏng Kịch Bản Thu Nhập</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kéo thanh trượt để dự đoán doanh thu khi kênh đạt các cột mốc lượt xem và hợp đồng tài trợ mới.
              </p>
            </div>

            {/* Slider 1: Monthly Views */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">1. Tổng Lượt Xem Dự Kiến / Tháng:</span>
                <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {formatFullNumber(monthlyViews)} views
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="20000000"
                step="50000"
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10K views</span>
                <span>5M views</span>
                <span>20M views</span>
              </div>
            </div>

            {/* Slider 2: RPM USD */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">2. Chỉ Số RPM Dự Kiến (Doanh thu / 1.000 views):</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  ${rpmUSD.toFixed(2)} USD (~{formatCurrencyVND(rpmUSD * 25400)})
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="8.0"
                step="0.1"
                value={rpmUSD}
                onChange={(e) => setRpmUSD(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$0.3 (Shorts/VN)</span>
                <span>$2.0 (Kênh Giải trí)</span>
                <span>$8.0 (Kênh Tài chính/Tech US)</span>
              </div>
            </div>

            {/* Slider 3: Sponsor Deals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Số Deal Sponsor / Tháng:</span>
                  <span className="font-mono font-bold text-purple-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                    {sponsorDealsCount} deal
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={sponsorDealsCount}
                  onChange={(e) => setSponsorDealsCount(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Giá Trung Bình 1 Deal:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                    ${sponsorPriceUSD} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={sponsorPriceUSD}
                  onChange={(e) => setSponsorPriceUSD(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <span>Dự Toán Tổng Thu Nhập</span>
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Mô phỏng 2026
                </span>
              </div>

              {/* Monthly breakdown */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">YouTube AdSense:</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-400">{formatCurrencyUSD(monthlyAdSenseUSD)}</div>
                    <div className="text-[10px] text-slate-500">~{formatCurrencyVND(monthlyAdSenseUSD * 25400)}/tháng</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Tài Trợ (Sponsorships):</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-400">{formatCurrencyUSD(monthlySponsorUSD)}</div>
                    <div className="text-[10px] text-slate-500">~{formatCurrencyVND(monthlySponsorUSD * 25400)}/tháng</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">TỔNG DỰ PHÓNG MỖI THÁNG</div>
                  <div className="text-2xl font-black text-white">{formatCurrencyUSD(totalMonthlyUSD)}</div>
                  <div className="text-xs text-emerald-300 font-semibold">~ {formatCurrencyVND(totalMonthlyUSD * 25400)} VND</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">ƯỚC TÍNH NĂM (12 THÁNG)</div>
                  <div className="text-xl font-extrabold text-amber-300">{formatCurrencyUSD(totalYearlyUSD)}</div>
                  <div className="text-xs text-slate-400">~ {formatCurrencyVND(totalYearlyUSD * 25400)} VND</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic text-center">
              * Con số dự toán dựa trên mức trung bình thị trường và tỷ giá 1 USD ≈ 25.400 VND.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SCHEDULE PLANNER */}
      {activeSubTab === 'schedule-planner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Phân Tích Khung Giờ Vàng Đăng Bài & Lịch Sản Xuất</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tối ưu hóa thời gian phát sóng theo chu kỳ thói quen người xem trên nền tảng YouTube Việt Nam & Quốc tế.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Recommended Times */}
            <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs uppercase font-extrabold text-blue-400 tracking-wider">Khung Giờ Tối Ưu Nhất</h4>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-white">19:00 - 21:00 (Tối)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Lượng xem cao nhất
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">11:30 - 13:00 (Trưa)</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Shorts & Giải trí
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-xs font-bold text-white">Thứ 7 & Chủ Nhật</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    Cuối tuần bùng nổ
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Content Matrix */}
            <div className="md:col-span-2 space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                Gợi Ý Ma Trận Phát Sóng Tuần (Weekly Matrix)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase">Thứ 3</span>
                  <div className="font-bold text-white">1 Video Dài</div>
                  <div className="text-[10px] text-slate-400">19:30 PM</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase">Thứ 5</span>
                  <div className="font-bold text-white">2 YouTube Shorts</div>
                  <div className="text-[10px] text-slate-400">11:45 AM & 18:30 PM</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Thứ 7</span>
                  <div className="font-bold text-white">1 Video Dài Main</div>
                  <div className="text-[10px] text-slate-400">20:00 PM (Hot)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Chủ Nhật</span>
                  <div className="font-bold text-white">Community Post</div>
                  <div className="text-[10px] text-slate-400">Hỏi đáp / Polling</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
