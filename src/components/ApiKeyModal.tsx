import React, { useState, useEffect } from 'react';
import { X, Key, Check, ShieldAlert } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaveKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('custom_yt_api_key') || '';
      setApiKey(stored);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = apiKey.trim();
    if (clean) {
      localStorage.setItem('custom_yt_api_key', clean);
      onSaveKey(clean);
    } else {
      localStorage.removeItem('custom_yt_api_key');
      onSaveKey('');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    localStorage.removeItem('custom_yt_api_key');
    setApiKey('');
    onSaveKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">YouTube Data API Key</h3>
            <p className="text-xs text-slate-400">Tùy chọn API Key cá nhân để tăng Quota</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nhập API Key của bạn:</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs font-mono text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Bảo mật thiết bị</span>
            </div>
            <p>
              API Key chỉ được lưu cục bộ trong LocalStorage trình duyệt của bạn và gửi qua Header an toàn khi gọi YouTube API v3.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold justify-center">
              <Check className="w-4 h-4" />
              <span>Đã lưu API Key thành công!</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
              >
                Xóa Key
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
