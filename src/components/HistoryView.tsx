import React from 'react';
import { SearchHistoryItem } from '../types/youtube';
import { formatCompactNumber } from '../utils/formulas';
import { History, Trash2, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  history: SearchHistoryItem[];
  onSelectChannel: (input: string) => void;
  onRemoveHistory: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectChannel,
  onRemoveHistory,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-white">Chưa Có Lịch Sử Tìm Kiếm</h3>
          <p className="text-xs text-slate-400">
            Các tìm kiếm của bạn sẽ tự động lưu lại đây để tra cứu và bấm lại trong lần truy cập tiếp theo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <span>Lịch Sử Tìm Kiếm</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách các kênh bạn đã tra cứu gần đây.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-full text-slate-300 border border-slate-700">
          {history.length} Mục
        </span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {history.map((item) => (
          <div
            key={item.id}
            className="py-3 px-4 flex items-center justify-between gap-4 hover:bg-slate-950/60 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.avatar}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    item.title
                  )}`;
                }}
              />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{item.customUrl}</span>
                  <span>•</span>
                  <span>{formatCompactNumber(item.subscriberCount)} subs</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {new Date(item.searchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>

              <button
                onClick={() => onSelectChannel(item.customUrl || item.channelId)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all"
              >
                <span>Phân Tích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onRemoveHistory(item.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Xóa khỏi lịch sử"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
