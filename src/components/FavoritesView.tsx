import React from 'react';
import { FavoriteChannel } from '../types/youtube';
import { formatCompactNumber, formatFullNumber } from '../utils/formulas';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: FavoriteChannel[];
  onSelectChannel: (input: string) => void;
  onRemoveFavorite: (channel: any) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onSelectChannel,
  onRemoveFavorite,
}) => {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-white">Chưa Có Kênh Yêu Thích</h3>
          <p className="text-xs text-slate-400">
            Bạn có thể lưu các kênh quan trọng vào danh sách yêu thích để dễ dàng theo dõi chỉ số thay đổi bất kỳ lúc nào.
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
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Kênh Yêu Thích Đã Lưu</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách các kênh bạn lưu để truy cập và phân tích lại nhanh chóng.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-full text-rose-400 border border-slate-700">
          {favorites.length} Kênh
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all"
          >
            <div className="flex items-start gap-3">
              <img
                src={fav.avatar}
                alt={fav.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    fav.title
                  )}`;
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                  {fav.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono">{fav.customUrl}</p>
                <div className="text-[11px] text-slate-500 mt-1">
                  Đã lưu: {new Date(fav.addedAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Subscribers</div>
                <div className="font-bold text-white mt-0.5">{formatCompactNumber(fav.subscriberCount)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Views</div>
                <div className="font-bold text-white mt-0.5">{formatCompactNumber(fav.viewCount)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Videos</div>
                <div className="font-bold text-white mt-0.5">{formatFullNumber(fav.videoCount)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                onClick={() => onRemoveFavorite({ id: fav.channelId })}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Xóa khỏi yêu thích"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectChannel(fav.customUrl || fav.channelId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs rounded-xl shadow transition-all"
              >
                <span>Phân Tích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
