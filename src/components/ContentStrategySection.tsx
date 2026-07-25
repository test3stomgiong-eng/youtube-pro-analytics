import React, { useState } from 'react';
import { ChannelData } from '../types/youtube';
import {
  analyzePublishingSchedule,
  analyzeDurationPerformance,
  extractKeywordPerformance,
  analyzeTitleSeo,
  formatCompactNumber,
  formatCurrencyUSD,
  formatCurrencyVND,
  formatTotalDuration,
} from '../utils/formulas';
import {
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Video,
  Award,
  Search,
  Hourglass,
  Coins,
  ChevronRight,
  Film,
  Zap,
} from 'lucide-react';

interface ContentStrategySectionProps {
  channel: ChannelData;
}

export const ContentStrategySection: React.FC<ContentStrategySectionProps> = ({ channel }) => {
  const [draftTitle, setDraftTitle] = useState('');

  const scheduleData = analyzePublishingSchedule(channel.recentVideos);
  const durationData = analyzeDurationPerformance(channel.recentVideos);
  const keywordsData = extractKeywordPerformance(
    channel.recentVideos,
    channel.calculatedMetrics.averageViews
  );

  const peakDay = scheduleData.find((d) => d.isPeakDay);
  const seoResult = analyzeTitleSeo(draftTitle);

  // Group into Short Videos (<= 5 mins) vs Long Videos (> 5 mins)
  const shortVideos = durationData.filter((d) => d.category === 'shorts' || d.category === 'short_form');
  const longVideos = durationData.filter((d) => d.category === 'mid_form' || d.category === 'long_form');

  const totalShortDurationSec = shortVideos.reduce((acc, curr) => acc + curr.totalDurationSeconds, 0);
  const totalShortCount = shortVideos.reduce((acc, curr) => acc + curr.count, 0);
  const totalShortViews = shortVideos.reduce((acc, curr) => acc + curr.totalViews, 0);
  const totalShortWatchHours = shortVideos.reduce((acc, curr) => acc + curr.totalWatchHours, 0);
  const totalShortRevenue = shortVideos.reduce((acc, curr) => acc + curr.estimatedRevenueUSD, 0);

  const totalLongDurationSec = longVideos.reduce((acc, curr) => acc + curr.totalDurationSeconds, 0);
  const totalLongCount = longVideos.reduce((acc, curr) => acc + curr.count, 0);
  const totalLongViews = longVideos.reduce((acc, curr) => acc + curr.totalViews, 0);
  const totalLongWatchHours = longVideos.reduce((acc, curr) => acc + curr.totalWatchHours, 0);
  const totalLongRevenue = longVideos.reduce((acc, curr) => acc + curr.estimatedRevenueUSD, 0);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Phân Tích Chuyên Sâu & Chiến Lược Nội Dung</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Tối Ưu Đăng Bài & Thời Lượng Video Ngắn / Dài
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Báo cáo tổng thời gian phát hành video ngắn vs video dài, giờ xem tích lũy, lịch đăng bài tối ưu và công cụ kiểm tra chuẩn SEO tiêu đề.
          </p>
        </div>
      </div>

      {/* Summary Highlight: Tổng Thời Gian Video Ngắn vs Video Dài */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Video Ngắn */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tổng Thống Kê</span>
                <h3 className="text-base font-extrabold text-white">Video Ngắn (Shorts & &lt;5 Phút)</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-xl">
              {totalShortCount} video
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Thời Lượng</div>
              <div className="text-base font-extrabold text-amber-400 mt-0.5">
                {formatTotalDuration(totalShortDurationSec)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                TB: {formatTotalDuration(totalShortCount > 0 ? Math.round(totalShortDurationSec / totalShortCount) : 0)}/video
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Giờ Xem</div>
              <div className="text-base font-extrabold text-white mt-0.5">
                ~{formatCompactNumber(totalShortWatchHours)}h
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {formatCompactNumber(totalShortViews)} lượt xem
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Doanh Thu Ước Tính</div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                {formatCurrencyUSD(totalShortRevenue)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ≈ {formatCurrencyVND(Math.round(totalShortRevenue * 25000))}
              </div>
            </div>
          </div>
        </div>

        {/* Card Video Dài */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Tổng Thống Kê</span>
                <h3 className="text-base font-extrabold text-white">Video Dài (&ge;5 Phút)</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-xl">
              {totalLongCount} video
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Thời Lượng</div>
              <div className="text-base font-extrabold text-indigo-400 mt-0.5">
                {formatTotalDuration(totalLongDurationSec)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                TB: {formatTotalDuration(totalLongCount > 0 ? Math.round(totalLongDurationSec / totalLongCount) : 0)}/video
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Giờ Xem</div>
              <div className="text-base font-extrabold text-white mt-0.5">
                ~{formatCompactNumber(totalLongWatchHours)}h
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {formatCompactNumber(totalLongViews)} lượt xem
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Doanh Thu Ước Tính</div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                {formatCurrencyUSD(totalLongRevenue)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                ≈ {formatCurrencyVND(Math.round(totalLongRevenue * 25000))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Projections Breakdown (Theo Ngày / Theo Tháng / Tổng Kênh) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AdSense Benchmark & Dự Phóng</span>
              <h3 className="text-base font-extrabold text-white">Báo Cáo Doanh Thu Theo Ngày & Theo Tháng</h3>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 shrink-0">
            RPM Shorts ($0.05) & Video Dài ($1.20 - $2.00)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Daily Revenue */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh Thu / Ngày</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {formatCurrencyUSD(channel.calculatedMetrics.dailyRevenueEstimate?.avgUSD || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              ≈ {formatCurrencyVND(channel.calculatedMetrics.dailyRevenueEstimate?.avgVND || 0)} / ngày
            </div>
            <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
              Khoảng: {formatCurrencyUSD(channel.calculatedMetrics.dailyRevenueEstimate?.minUSD || 0)} - {formatCurrencyUSD(channel.calculatedMetrics.dailyRevenueEstimate?.maxUSD || 0)}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh Thu / Tháng</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {formatCurrencyUSD(channel.calculatedMetrics.monthlyRevenueEstimate?.avgUSD || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              ≈ {formatCurrencyVND(channel.calculatedMetrics.monthlyRevenueEstimate?.avgVND || 0)} / tháng
            </div>
            <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
              Khoảng: {formatCurrencyUSD(channel.calculatedMetrics.monthlyRevenueEstimate?.minUSD || 0)} - {formatCurrencyUSD(channel.calculatedMetrics.monthlyRevenueEstimate?.maxUSD || 0)}
            </div>
          </div>

          {/* Total Channel Revenue */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh Thu Tất Cả View</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {formatCurrencyUSD(channel.calculatedMetrics.totalRevenueEstimate?.avgUSD || 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              ≈ {formatCurrencyVND(channel.calculatedMetrics.totalRevenueEstimate?.avgVND || 0)}
            </div>
            <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
              Tổng {formatCompactNumber(channel.viewCount)} lượt xem từ khi lập kênh
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Lịch Đăng Bài & Ngày Vàng */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Lịch Đăng Bài & Ngày Vàng</h3>
                <p className="text-[11px] text-slate-400">Tần suất đăng và ngày đạt lượt xem trung bình cao nhất</p>
              </div>
            </div>
          </div>

          {peakDay && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm shadow-md">
                  {peakDay.shortName}
                </div>
                <div>
                  <div className="text-xs font-semibold text-indigo-300">Ngày Đăng Hiệu Quả Nhất</div>
                  <div className="text-sm font-extrabold text-white">{peakDay.dayName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Lượt xem TB / video</div>
                <div className="text-sm font-extrabold text-emerald-400">
                  {formatCompactNumber(peakDay.avgViews)} views
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {scheduleData.map((day) => (
              <div
                key={day.dayName}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  day.isPeakDay
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 mb-1">{day.shortName}</div>
                <div className="text-xs font-extrabold text-white">{day.count} <span className="text-[10px] font-normal text-slate-400">video</span></div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1 truncate">
                  {day.avgViews > 0 ? formatCompactNumber(day.avgViews) : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Chi Tiết Phân Tích Định Dạng & Thời Lượng */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Chi Tiết Từng Nhóm Thời Lượng</h3>
                <p className="text-[11px] text-slate-400">Phân rã 4 nhóm video từ Shorts tới video dài &gt;15 phút</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {durationData.map((item) => (
              <div
                key={item.category}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {item.range}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-base font-black text-white">
                    {item.count} <span className="text-xs font-normal text-slate-400">video</span>
                  </div>
                  <div className="text-xs font-extrabold text-amber-400">
                    Tổng {formatTotalDuration(item.totalDurationSeconds)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Hourglass className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>~{formatCompactNumber(item.totalWatchHours)}h xem</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold justify-end">
                    <Coins className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{formatCurrencyUSD(item.estimatedRevenueUSD)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module 3: Từ Khóa & Chủ Đề Kéo View Hot */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Từ Khóa Kéo View Hiệu Quả Nhất</h3>
              <p className="text-[11px] text-slate-400">Các từ xuất hiện nhiều trong tiêu đề đạt lượt xem vượt trội</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 w-fit">
            Top {keywordsData.length} Từ Khóa Nổi Bật
          </span>
        </div>

        {keywordsData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {keywordsData.map((kw) => {
              const isHighImpact = kw.viewMultiplier >= 1.2;
              return (
                <div
                  key={kw.keyword}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isHighImpact
                      ? 'bg-gradient-to-b from-rose-950/30 to-slate-950 border-rose-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {kw.keyword}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {kw.count}x
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-slate-900">
                    <span className="text-xs font-semibold text-slate-300">
                      {formatCompactNumber(kw.avgViews)} views
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        kw.viewMultiplier >= 1.0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {kw.viewMultiplier}x TB
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            Chưa có đủ dữ liệu từ khóa từ các video gần đây.
          </div>
        )}
      </div>

      {/* Module 4: Trình Kiểm Tra & Tối Ưu Tiêu Đề SEO Trực Tiếp */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Công Cụ Đánh Giá & Tối Ưu Tiêu Đề Bài Đăng (SEO Title Checker)</h3>
            <p className="text-[11px] text-slate-400">Nhập tiêu đề bạn dự định làm video để kiểm tra độ thu hút và chuẩn SEO</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Nhập tiêu đề video thử nghiệm (Ví dụ: Bí mật tạo video triệu view trong 24h)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl py-3.5 pl-4 pr-24 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
              {draftTitle.length} ký tự
            </div>
          </div>

          {draftTitle.trim().length > 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
                      seoResult.score >= 80
                        ? 'bg-emerald-500 text-slate-950'
                        : seoResult.score >= 60
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {seoResult.score}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Điểm SEO Tiêu Đề</div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <span>Xếp hạng: Hạng {seoResult.grade}</span>
                      {seoResult.score >= 80 && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Rất Tốt
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className={`px-2.5 py-1 rounded-lg border ${seoResult.hasNumbers ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800'}`}>
                    Con số {seoResult.hasNumbers ? '✓' : '✗'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg border ${seoResult.hasPowerWords ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800'}`}>
                    Từ khóa HOT {seoResult.hasPowerWords ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              {/* Feedback list */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">Đánh giá chi tiết:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {seoResult.feedback.map((fb, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{fb}</span>
                    </div>
                  ))}
                  {seoResult.suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/30">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-amber-200">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Search className="w-4 h-4 text-slate-600" />
              <span>Gõ một tiêu đề bất kỳ ở trên để nhận phân tích độ chuẩn SEO ngay lập tức.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
