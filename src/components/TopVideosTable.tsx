import React, { useState } from 'react';
import { VideoData } from '../types/youtube';
import {
  formatCompactNumber,
  formatFullNumber,
  formatRelativeDate,
  formatCurrencyUSD,
  formatCurrencyVND,
  calculateVideoWatchTimeAndRevenue,
  isShortVideo,
} from '../utils/formulas';
import { Video, ThumbsUp, MessageSquare, Clock, ExternalLink, ArrowUpDown, Hourglass, Coins, Zap, Film } from 'lucide-react';

interface TopVideosTableProps {
  videos: VideoData[];
}

export const TopVideosTable: React.FC<TopVideosTableProps> = ({ videos }) => {
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'comments' | 'date' | 'watchTime' | 'revenue'>('views');
  const [filterViewMode, setFilterViewMode] = useState<'grid' | 'table'>('table');
  const [videoCategory, setVideoCategory] = useState<'all' | 'long' | 'shorts'>('all');

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        Không có dữ liệu video mới xuất bản.
      </div>
    );
  }

  // Calculate Long vs Shorts Breakdown Metrics
  const longVideosList = videos.filter((v) => !isShortVideo(v));
  const shortsList = videos.filter((v) => isShortVideo(v));

  const calcSummary = (list: VideoData[]) => {
    let totalViews = 0;
    let totalWatchHours = 0;
    let totalRevUSD = 0;

    list.forEach((v) => {
      totalViews += v.viewCount || 0;
      const calc = calculateVideoWatchTimeAndRevenue(v.viewCount || 0, v.durationSeconds || 0);
      totalWatchHours += v.estimatedWatchHours ?? calc.estimatedWatchHours;
      totalRevUSD += v.estimatedRevenue?.avgUSD ?? calc.estimatedRevenue.avgUSD;
    });

    const avgViews = list.length > 0 ? Math.round(totalViews / list.length) : 0;
    return {
      count: list.length,
      totalViews,
      avgViews,
      totalWatchHours,
      totalRevUSD,
    };
  };

  const longStats = calcSummary(longVideosList);
  const shortsStats = calcSummary(shortsList);

  // Filter based on selected category tab
  const categoryFiltered = videos.filter((v) => {
    if (videoCategory === 'long') return !isShortVideo(v);
    if (videoCategory === 'shorts') return isShortVideo(v);
    return true;
  });

  const sortedVideos = [...categoryFiltered].sort((a, b) => {
    const calcA = calculateVideoWatchTimeAndRevenue(a.viewCount || 0, a.durationSeconds || 0);
    const calcB = calculateVideoWatchTimeAndRevenue(b.viewCount || 0, b.durationSeconds || 0);

    if (sortBy === 'views') return b.viewCount - a.viewCount;
    if (sortBy === 'likes') return b.likeCount - a.likeCount;
    if (sortBy === 'comments') return b.commentCount - a.commentCount;
    if (sortBy === 'date') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (sortBy === 'watchTime') return (b.estimatedWatchHours || calcB.estimatedWatchHours) - (a.estimatedWatchHours || calcA.estimatedWatchHours);
    if (sortBy === 'revenue') return (b.estimatedRevenue?.avgUSD || calcB.estimatedRevenue.avgUSD) - (a.estimatedRevenue?.avgUSD || calcA.estimatedRevenue.avgUSD);
    return 0;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            <span>Top Video Mới Nhất & Phân Loại Theo Tab YouTube</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân tách chính xác giữa <strong>Tab Video (Video dài / truyền thống)</strong> và <strong>Tab Shorts (YouTube Shorts)</strong>.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium flex-wrap">
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'views' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhiều View
            </button>
            <button
              onClick={() => setSortBy('watchTime')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'watchTime' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhiều Giờ Xem
            </button>
            <button
              onClick={() => setSortBy('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'revenue' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Doanh Thu Cao
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'likes' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhiều Like
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'date' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mới Nhất
            </button>
          </div>

          <button
            onClick={() => setFilterViewMode(filterViewMode === 'table' ? 'grid' : 'table')}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            title="Chuyển chế độ hiển thị"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">{filterViewMode === 'table' ? 'Bảng' : 'Lưới'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Cards: Long Videos vs Shorts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Long Videos Stat Card */}
        <div
          onClick={() => setVideoCategory('long')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            videoCategory === 'long'
              ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50'
              : 'bg-slate-950 border-slate-800 hover:border-blue-500/50'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Film className="w-4 h-4" />
              <span>🎬 Tab "Video" (Video Dài)</span>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30">
              {longStats.count} video
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Avg View</div>
              <div className="text-sm font-bold text-white mt-0.5">{formatCompactNumber(longStats.avgViews)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Giờ xem</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">~{formatCompactNumber(longStats.totalWatchHours)}h</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Doanh thu</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrencyUSD(longStats.totalRevUSD)}</div>
            </div>
          </div>
        </div>

        {/* Shorts Stat Card */}
        <div
          onClick={() => setVideoCategory('shorts')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            videoCategory === 'shorts'
              ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
              : 'bg-slate-950 border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Zap className="w-4 h-4 fill-purple-400" />
              <span>⚡ Tab "Shorts" (YouTube Shorts)</span>
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              {shortsStats.count} video
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Avg View</div>
              <div className="text-sm font-bold text-white mt-0.5">{formatCompactNumber(shortsStats.avgViews)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Giờ xem</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">~{formatCompactNumber(shortsStats.totalWatchHours)}h</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Doanh thu</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatCurrencyUSD(shortsStats.totalRevUSD)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVideoCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              videoCategory === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tất cả ({videos.length})
          </button>
          <button
            onClick={() => setVideoCategory('long')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              videoCategory === 'long'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Tab Video ({longVideosList.length})</span>
          </button>
          <button
            onClick={() => setVideoCategory('shorts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              videoCategory === 'shorts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tab Shorts ({shortsList.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Hiển thị: <strong className="text-white">{sortedVideos.length}</strong> video
        </span>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Không có video nào trong danh mục này.
        </div>
      ) : filterViewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 font-semibold rounded-xl">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Video / Thumbnail</th>
                <th className="py-3 px-4">Định dạng</th>
                <th className="py-3 px-4">Ngày đăng</th>
                <th className="py-3 px-4">Thời lượng</th>
                <th className="py-3 px-4">Lượt xem</th>
                <th className="py-3 px-4">Giờ xem (Ước tính)</th>
                <th className="py-3 px-4">Doanh thu (Ước tính)</th>
                <th className="py-3 px-4">Thích</th>
                <th className="py-3 px-4 rounded-r-xl">Bình luận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedVideos.map((video) => {
                const isShort = isShortVideo(video);
                const calc = calculateVideoWatchTimeAndRevenue(video.viewCount || 0, video.durationSeconds || 0);
                const watchHours = video.estimatedWatchHours ?? calc.estimatedWatchHours;
                const revenue = video.estimatedRevenue ?? calc.estimatedRevenue;

                return (
                  <tr key={video.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 max-w-md">
                        <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80';
                            }}
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs text-[10px] font-mono font-bold text-white px-1.5 py-0.2 rounded">
                            {video.duration}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-slate-100 hover:text-red-400 text-sm line-clamp-2 transition-colors flex items-center gap-1"
                          >
                            <span>{video.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {isShort ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          <Zap className="w-3 h-3 fill-purple-300" />
                          Shorts
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                          <Film className="w-3 h-3" />
                          Tab Video
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {formatRelativeDate(video.publishedAt)}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-300 whitespace-nowrap">
                      {video.duration}
                    </td>

                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {formatFullNumber(video.viewCount)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg w-fit">
                        <Hourglass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>~{formatCompactNumber(watchHours)} giờ</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {formatCurrencyUSD(revenue.minUSD)} - {formatCurrencyUSD(revenue.maxUSD)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ≈ {formatCurrencyVND(revenue.avgVND)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-emerald-400 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{formatCompactNumber(video.likeCount)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-amber-400 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{formatCompactNumber(video.commentCount)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVideos.map((video) => {
            const isShort = isShortVideo(video);
            const calc = calculateVideoWatchTimeAndRevenue(video.viewCount || 0, video.durationSeconds || 0);
            const watchHours = video.estimatedWatchHours ?? calc.estimatedWatchHours;
            const revenue = video.estimatedRevenue ?? calc.estimatedRevenue;

            return (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-950 border border-slate-800 hover:border-red-500/50 rounded-2xl p-3.5 flex flex-col justify-between group transition-all space-y-3"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80';
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-xs font-mono font-bold text-white px-2 py-0.5 rounded-md">
                      {video.duration}
                    </span>
                    <span className="absolute top-2 left-2">
                      {isShort ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-900/90 text-purple-200 border border-purple-500/50 px-2 py-0.5 rounded-full backdrop-blur-md">
                          <Zap className="w-3 h-3 fill-purple-200" />
                          Shorts
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-900/90 text-blue-200 border border-blue-500/50 px-2 py-0.5 rounded-full backdrop-blur-md">
                          <Film className="w-3 h-3" />
                          Tab Video
                        </span>
                      )}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-100 group-hover:text-red-400 text-sm line-clamp-2 transition-colors">
                    {video.title}
                  </h4>
                </div>

                {/* Watch Time & Revenue Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-amber-300 font-semibold uppercase">Giờ xem</div>
                      <div className="text-xs font-bold text-amber-400">~{formatCompactNumber(watchHours)}h</div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-emerald-300 font-semibold uppercase">Doanh thu</div>
                      <div className="text-xs font-extrabold text-emerald-400 truncate">
                        {formatCurrencyUSD(revenue.avgUSD)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="text-white font-bold">{formatCompactNumber(video.viewCount)} views</span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ThumbsUp className="w-3 h-3" />
                      {formatCompactNumber(video.likeCount)}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <MessageSquare className="w-3 h-3" />
                      {formatCompactNumber(video.commentCount)}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

