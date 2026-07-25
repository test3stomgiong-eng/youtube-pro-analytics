import React from 'react';
import { ChannelData } from '../types/youtube';
import { formatFullNumber, formatCompactNumber, formatRelativeDate } from '../utils/formulas';
import { Heart, Users, RefreshCw, Calendar, Globe, Video, Eye, ExternalLink, FileText } from 'lucide-react';

interface ChannelOverviewCardProps {
  channel: ChannelData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCompare: () => void;
  onReAnalyze: () => void;
  onExportReport?: () => void;
  isAnalyzing: boolean;
}

export const ChannelOverviewCard: React.FC<ChannelOverviewCardProps> = ({
  channel,
  isFavorite,
  onToggleFavorite,
  onAddToCompare,
  onReAnalyze,
  onExportReport,
  isAnalyzing,
}) => {
  const createdFormatted = channel.publishedAt
    ? new Date(channel.publishedAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Banner */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full bg-slate-950 overflow-hidden">
        <img
          src={channel.banner}
          alt={channel.title}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Top Right Quick Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isFavorite
                ? 'bg-rose-600/90 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                : 'bg-slate-900/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Yêu Thích' : 'Lưu Kênh'}</span>
          </button>

          <button
            onClick={onAddToCompare}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Thêm vào danh sách so sánh"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">So Sánh</span>
          </button>

          {onExportReport && (
            <button
              onClick={onExportReport}
              className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border border-red-500/50 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-red-950/40"
              title="Xuất báo cáo kênh (.txt)"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Báo Cáo</span>
            </button>
          )}

          <button
            onClick={onReAnalyze}
            disabled={isAnalyzing}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>
        </div>
      </div>

      {/* Main Channel Details */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
          {/* Avatar + Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative group">
              <img
                src={channel.avatar}
                alt={channel.title}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-950"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    channel.title
                  )}`;
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900 shadow">
                VERIFIED
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {channel.title}
                </h1>
                <a
                  href={`https://www.youtube.com/${channel.customUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  title="Mở kênh trên YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-slate-400 text-sm font-mono">{channel.customUrl}</p>

              <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{channel.country || 'Toàn Cầu'}</span>
                </span>

                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tham gia: {createdFormatted} ({formatRelativeDate(channel.publishedAt)})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Big Metric Badges */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="text-center px-2">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-red-400" />
                <span>Subscribers</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatCompactNumber(channel.subscriberCount)}
              </div>
            </div>

            <div className="text-center px-2 border-x border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-blue-400" />
                <span>Total Views</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatCompactNumber(channel.viewCount)}
              </div>
            </div>

            <div className="text-center px-2">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
                <Video className="w-3 h-3 text-emerald-400" />
                <span>Videos</span>
              </div>
              <div className="text-lg font-bold text-white mt-0.5">
                {formatFullNumber(channel.videoCount)}
              </div>
            </div>
          </div>
        </div>

        {/* Channel Description */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
          <span className="font-semibold text-slate-200">Mô tả kênh: </span>
          {channel.description || 'Không có mô tả chi tiết.'}
        </div>
      </div>
    </div>
  );
};
