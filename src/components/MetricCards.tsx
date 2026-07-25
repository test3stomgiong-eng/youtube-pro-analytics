import React from 'react';
import { ChannelData } from '../types/youtube';
import { formatCompactNumber, formatFullNumber, formatCurrencyUSD, formatCurrencyVND } from '../utils/formulas';
import {
  Users,
  Eye,
  Video,
  BarChart2,
  Calendar,
  Zap,
  Clock,
  TrendingUp,
  Hourglass,
  Coins,
} from 'lucide-react';

interface MetricCardsProps {
  channel: ChannelData;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ channel }) => {
  const m = channel.calculatedMetrics;

  const cards = [
    {
      label: 'Subscribers',
      value: formatCompactNumber(channel.subscriberCount),
      subValue: `${formatFullNumber(channel.subscriberCount)} người đăng ký`,
      icon: Users,
      color: 'from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30',
    },
    {
      label: 'Total Views',
      value: formatCompactNumber(channel.viewCount),
      subValue: `${formatFullNumber(channel.viewCount)} lượt xem`,
      icon: Eye,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    },
    {
      label: 'Tổng Giờ Xem (Ước tính)',
      value: `${formatCompactNumber(m.totalEstimatedWatchHours || 0)}h`,
      subValue: `~${formatCompactNumber(m.recentEstimatedWatchHours || 0)}h từ video gần đây`,
      icon: Hourglass,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    },
    {
      label: 'Doanh Thu / Ngày (Ước tính)',
      value: formatCurrencyUSD(m.dailyRevenueEstimate?.avgUSD || 0),
      subValue: `≈ ${formatCurrencyVND(m.dailyRevenueEstimate?.avgVND || 0)} / ngày`,
      icon: Coins,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Doanh Thu / Tháng (Ước tính)',
      value: formatCurrencyUSD(m.monthlyRevenueEstimate?.avgUSD || 0),
      subValue: `≈ ${formatCurrencyVND(m.monthlyRevenueEstimate?.avgVND || 0)} / tháng`,
      icon: Coins,
      color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Doanh Thu Tổng Kênh',
      value: formatCurrencyUSD(m.totalRevenueEstimate?.avgUSD || 0),
      subValue: `≈ ${formatCurrencyVND(m.totalRevenueEstimate?.avgVND || 0)} (Tất cả view)`,
      icon: Coins,
      color: 'from-green-500/20 to-lime-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Total Videos',
      value: formatFullNumber(channel.videoCount),
      subValue: `Đã xuất bản`,
      icon: Video,
      color: 'from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30',
    },
    {
      label: 'Average Views',
      value: formatCompactNumber(m.averageViews),
      subValue: `Lượt xem TB / video gần đây`,
      icon: BarChart2,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    },
    {
      label: 'Videos / Month',
      value: `${m.videosPerMonth}`,
      subValue: `Trung bình hàng tháng`,
      icon: Calendar,
      color: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
    },
    {
      label: 'Views / Subscriber',
      value: `${m.viewsPerSubscriber}`,
      subValue: `Tỷ lệ hiệu suất lượt xem / sub`,
      icon: Zap,
      color: 'from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      label: 'Upload Frequency',
      value: m.uploadFrequencyText,
      subValue: `Khoảng cách giữa các video`,
      icon: Clock,
      color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
    },
    {
      label: 'Engagement Rate',
      value: `${m.recentEngagementRate}%`,
      subValue: `(Thích + Comment) / Views`,
      icon: TrendingUp,
      color: 'from-lime-500/20 to-emerald-500/20 text-lime-400 border-lime-500/30',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>Chỉ Số Hiệu Suất Tự Tính</span>
          <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            Strict Math Engine
          </span>
        </h2>
      </div>

      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 flex items-start gap-2">
        <Coins className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Lưu ý về Doanh Thu Ước Tính:</span> YouTube API công khai không cung cấp trạng thái bật kiếm tiền hay doanh thu thực. Con số trên dựa trên <strong className="text-white">RPM chuẩn YouTube</strong> ($0.05/1k view với Shorts, $1.20-$2.00/1k view với Video dài). Dù kênh <strong>chưa bật kiếm tiền</strong>, đây chính là <strong>mức doanh thu tiềm năng dự phóng</strong> mà kênh có thể kiếm được từ lượt xem đó khi đủ điều kiện bật kiếm tiền.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 group-hover:text-red-400 transition-colors">
                    {card.value}
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} border border-slate-800`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
                {card.subValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
