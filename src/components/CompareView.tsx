import React, { useState } from 'react';
import { ChannelData } from '../types/youtube';
import { formatCompactNumber, formatFullNumber } from '../utils/formulas';
import { Users, Plus, X, Award, Eye, Video, Clock, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CompareViewProps {
  compareList: ChannelData[];
  onRemoveChannel: (id: string) => void;
  onRunComparison: (inputs: string[]) => void;
  isComparing: boolean;
  onAnalyzeChannel: (input: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareList,
  onRemoveChannel,
  onRunComparison,
  isComparing,
  onAnalyzeChannel,
}) => {
  const [newInput, setNewInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInput.trim()) {
      const inputs = [...compareList.map((c) => c.customUrl || c.id), newInput.trim()];
      onRunComparison(inputs);
      setNewInput('');
    }
  };

  const chartData = compareList.map((c) => ({
    name: c.title,
    subscribers: c.subscriberCount,
    views: c.viewCount,
    videos: c.videoCount,
    avgViews: c.calculatedMetrics.averageViews,
    score: c.score.overall,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">So Sánh Trực Tiếp (Tối đa 5 Kênh)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              So sánh các chỉ số Subscribers, Lượt xem, Tần suất đăng bài và Channel Score thực tế.
            </p>
          </div>

          {/* Quick input form */}
          {compareList.length < 5 && (
            <form onSubmit={handleAdd} className="flex items-center gap-2">
              <input
                type="text"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                placeholder="Thêm channel URL / @handle..."
                className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                disabled={isComparing}
              />
              <button
                type="submit"
                disabled={isComparing || !newInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Kênh</span>
              </button>
            </form>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">Chưa Có Kênh Nào Trong Danh Sách So Sánh</h3>
              <p className="text-xs text-slate-400">
                Thêm tối đa 5 kênh bằng cách nhập URL/handle ở trên hoặc nhấn nút "So Sánh" trên các kênh bạn đang phân tích.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Channels Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {compareList.map((channel, rank) => (
                <div
                  key={channel.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3 relative group flex flex-col justify-between"
                >
                  <button
                    onClick={() => onRemoveChannel(channel.id)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"
                    title="Xóa khỏi so sánh"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex flex-col items-center text-center space-y-2 pt-2">
                    <img
                      src={channel.avatar}
                      alt={channel.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          channel.title
                        )}`;
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{channel.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{channel.customUrl}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Hạng #{rank + 1}</span>
                    <span className="font-bold text-amber-400">{channel.score.overall} pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Side-by-Side Comparison Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Chỉ Số</th>
                    {compareList.map((c) => (
                      <th key={c.id} className="py-3 px-4 font-bold text-white">
                        {c.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-red-400" /> Subscribers
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4 text-white font-bold">
                        {formatFullNumber(c.subscriberCount)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-400" /> Total Views
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4">
                        {formatFullNumber(c.viewCount)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-emerald-400" /> Total Videos
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4">
                        {formatFullNumber(c.videoCount)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-400" /> Average Views
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4 font-mono">
                        {formatCompactNumber(c.calculatedMetrics.averageViews)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-400" /> Tần Suất Đăng
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4 text-xs">
                        {c.calculatedMetrics.uploadFrequencyText}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" /> Channel Score
                    </td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 font-extrabold border border-amber-500/20">
                          {c.score.overall} / 100 ({c.score.tier})
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-400 font-bold">Thao Tác</td>
                    {compareList.map((c) => (
                      <td key={c.id} className="py-3 px-4">
                        <button
                          onClick={() => onAnalyzeChannel(c.customUrl || c.id)}
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span>Xem Chi Tiết</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visual Recharts Bar Chart for Channel Score */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Biểu Đồ So Sánh Channel Score (Max 100)</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} points`, 'Channel Score']}
                    />
                    <Bar dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Channel Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
