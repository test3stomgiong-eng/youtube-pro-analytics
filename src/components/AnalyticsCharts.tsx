import React from 'react';
import { ChannelData } from '../types/youtube';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { formatCompactNumber } from '../utils/formulas';

interface AnalyticsChartsProps {
  channel: ChannelData;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ channel }) => {
  const videos = [...channel.recentVideos].reverse(); // Oldest to newest for timeline

  const chartData = videos.map((v, i) => ({
    name: `Video ${i + 1}`,
    title: v.title,
    views: v.viewCount,
    likes: v.likeCount,
    comments: v.commentCount,
    avgViews: channel.calculatedMetrics.averageViews,
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Recent Video Views Velocity */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white">Lượt Xem Video Gần Đây</h3>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            {videos.length} Video Mới Nhất
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => formatCompactNumber(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [formatCompactNumber(Number(value)), 'Lượt xem']}
                labelFormatter={(label, items) => {
                  if (items && items.length > 0) {
                    return items[0].payload.title || label;
                  }
                  return label;
                }}
              />
              <Bar dataKey="views" fill="#ef4444" radius={[6, 6, 0, 0]} name="Views" />
              <Line
                type="monotone"
                dataKey="avgViews"
                stroke="#38bdf8"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                name="Trung bình"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Recent Likes & Comments Engagement */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Tương Tác Thích & Bình Luận</h3>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            Biểu Đồ Tương Tác
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => formatCompactNumber(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  formatCompactNumber(Number(value)),
                  name === 'likes' ? 'Lượt Thích' : 'Lượt Bình Luận',
                ]}
              />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                name="likes"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }}
                name="comments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
