import React from 'react';
import { Youtube, BarChart3, Users, Heart, History, Key, ShieldCheck, Wand2, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'compare' | 'favorites' | 'history' | 'tools';
  setActiveTab: (tab: 'dashboard' | 'compare' | 'favorites' | 'history' | 'tools') => void;
  onOpenApiKeyModal: () => void;
  onOpenUserGuide: () => void;
  favoritesCount: number;
  historyCount: number;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  onOpenUserGuide,
  favoritesCount,
  historyCount,
  compareCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 p-0.5 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Youtube className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  YouTube Pro Analytics
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  Precision Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Hệ thống Phân tích Kênh & Gemini AI Audit Cá Nhân
              </p>
            </div>
          </div>

          {/* Mobile settings key */}
          <button
            onClick={onOpenApiKeyModal}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Cấu hình API Key"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'tools'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Công Cụ Studio</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'compare'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>So Sánh Kênh</span>
            {compareCount > 0 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-red-400 font-bold">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Yêu Thích</span>
            {favoritesCount > 0 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-rose-400 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch Sử</span>
            {historyCount > 0 && (
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenUserGuide}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/30 hover:to-rose-600/30 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition-all shadow-sm"
            title="Xem & Tải File PDF Hướng Dẫn Sử Dụng App"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Hướng Dẫn (PDF)</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            title="Cấu hình YouTube API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>YouTube API Key</span>
          </button>
        </div>
      </div>
    </header>
  );
};
