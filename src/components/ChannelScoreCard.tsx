import React from 'react';
import { ChannelScore } from '../types/youtube';
import { Award, CheckCircle2, Info } from 'lucide-react';

interface ChannelScoreCardProps {
  score: ChannelScore;
}

export const ChannelScoreCard: React.FC<ChannelScoreCardProps> = ({ score }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S+':
      case 'S':
        return 'from-amber-400 via-yellow-500 to-amber-600 text-amber-950 border-amber-300';
      case 'A+':
      case 'A':
        return 'from-emerald-500 to-teal-600 text-white border-emerald-400';
      case 'B':
        return 'from-blue-500 to-cyan-600 text-white border-blue-400';
      case 'C':
        return 'from-purple-500 to-violet-600 text-white border-purple-400';
      default:
        return 'from-slate-600 to-slate-700 text-white border-slate-500';
    }
  };

  const categories = [
    { key: 'uploadConsistency', data: score.uploadConsistency },
    { key: 'averageViews', data: score.averageViews },
    { key: 'engagement', data: score.engagement },
    { key: 'growth', data: score.growth },
    { key: 'titleQuality', data: score.titleQuality },
    { key: 'thumbnailQuality', data: score.thumbnailQuality },
    { key: 'contentConsistency', data: score.contentConsistency },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Channel Score Standard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Điểm số tổng hợp được tính toán 100% bằng thuật toán toán học dựa trên dữ liệu thực tế (Max 100).
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Overall Grade</div>
            <div className="text-3xl font-black text-white">
              {score.overall} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getTierColor(
              score.tier
            )} flex items-center justify-center text-2xl font-black shadow-lg border`}
          >
            {score.tier}
          </div>
        </div>
      </div>

      {/* 7 Core Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(({ key, data }) => {
          const percent = Math.round((data.score / data.maxScore) * 100);

          return (
            <div
              key={key}
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {data.label}
                </span>

                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  {data.score} / {data.maxScore}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent >= 80
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : percent >= 60
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      : percent >= 40
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="text-xs text-slate-400 font-medium line-clamp-2">{data.description}</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Không sử dụng bất kỳ số liệu ngẫu nhiên hoặc tạo điểm giả. Tất cả các thành phần được cân chỉnh từ dữ liệu video gần nhất.
        </span>
      </div>
    </div>
  );
};
