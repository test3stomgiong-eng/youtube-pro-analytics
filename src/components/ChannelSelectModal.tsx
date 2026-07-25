import React from 'react';
import { ChannelSearchResult } from '../types/youtube';
import { formatCompactNumber } from '../utils/formulas';
import { Users, Video, ArrowRight, X, Search, CheckCircle2 } from 'lucide-react';

interface ChannelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  candidates: ChannelSearchResult[];
  onSelect: (channelIdOrHandle: string) => void;
  isAnalyzing?: boolean;
}

export const ChannelSelectModal: React.FC<ChannelSelectModalProps> = ({
  isOpen,
  onClose,
  query,
  candidates,
  onSelect,
  isAnalyzing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                Chọn kênh YouTube cần phân tích
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Tìm thấy <span className="font-bold text-slate-100">{candidates.length}</span> kênh phù hợp với từ khóa &ldquo;<span className="text-red-400 font-mono font-semibold">{query}</span>&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Candidates List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 divide-y-0">
          {candidates.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800/60 p-6">
              <p className="text-base font-medium text-slate-200">Không tìm thấy kênh phù hợp trực tiếp.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Thử nhập lại chính xác Handle (ví dụ: <code className="text-red-400 font-mono">@MrBeast</code>) hoặc ID kênh (<code className="text-red-400 font-mono">UC...</code>).
              </p>
            </div>
          ) : (
            candidates.map((channel) => (
              <div
                key={channel.id}
                onClick={() => !isAnalyzing && onSelect(channel.id)}
                className="group relative p-4 sm:p-5 bg-slate-950/80 hover:bg-slate-800/70 border border-slate-800 hover:border-red-500/50 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg"
              >
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <img
                    src={channel.avatar}
                    alt={channel.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-red-500/80 shrink-0 transition-all shadow-md bg-slate-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channel.title)}`;
                    }}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-100 group-hover:text-red-400 transition-colors truncate">
                        {channel.title}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 fill-blue-400/10" />
                    </div>

                    <p className="text-xs font-mono font-semibold text-red-400">{channel.customUrl}</p>

                    <div className="flex items-center gap-2.5 text-xs text-slate-300 flex-wrap pt-1">
                      <span className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200 font-medium">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        {channel.subscriberCount ? formatCompactNumber(channel.subscriberCount) : 'N/A'} sub
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200 font-medium">
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                        {channel.videoCount ? formatCompactNumber(channel.videoCount) : 'N/A'} video
                      </span>
                    </div>

                    {channel.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 pt-1 leading-relaxed">{channel.description}</p>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAnalyzing) onSelect(channel.id);
                    }}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md group-hover:shadow-red-600/30 whitespace-nowrap"
                  >
                    <span>Phân tích ngay</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-500">
          <span>Nếu không có trong danh sách, hãy dán liên kết URL trực tiếp của kênh.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
