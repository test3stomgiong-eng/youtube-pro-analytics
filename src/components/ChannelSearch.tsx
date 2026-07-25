import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, AlertCircle, Users, Check, ChevronRight } from 'lucide-react';
import { ChannelSearchResult } from '../types/youtube';
import { searchChannels } from '../services/apiService';
import { formatCompactNumber } from '../utils/formulas';
import { ChannelSelectModal } from './ChannelSelectModal';

interface ChannelSearchProps {
  onAnalyze: (input: string) => void;
  isAnalyzing: boolean;
}

export const ChannelSearch: React.FC<ChannelSearchProps> = ({ onAnalyze, isAnalyzing }) => {
  const [input, setInput] = useState('');
  const [candidates, setCandidates] = useState<ChannelSearchResult[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for live suggestions
  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      setCandidates([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingCandidates(true);
      try {
        const results = await searchChannels(trimmed);
        setCandidates(results);
        setShowDropdown(results.length > 0);
      } catch (e) {
        console.warn('Autocomplete search failed:', e);
      } finally {
        setIsLoadingCandidates(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSelectCandidate = (channelIdOrHandle: string) => {
    setShowDropdown(false);
    setIsModalOpen(false);
    onAnalyze(channelIdOrHandle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check if input is direct Channel ID or direct URL
    const isDirectIdOrUrl =
      trimmed.startsWith('UC') ||
      trimmed.includes('youtube.com/channel/') ||
      trimmed.includes('youtube.com/c/') ||
      trimmed.includes('youtube.com/@');

    if (isDirectIdOrUrl) {
      setShowDropdown(false);
      onAnalyze(trimmed);
      return;
    }

    // Fetch candidate list for ambiguous search term and show selection modal
    setIsLoadingCandidates(true);
    try {
      const results = await searchChannels(trimmed);
      if (results && results.length > 0) {
        setCandidates(results);
        setIsModalOpen(true);
      } else {
        // Direct attempt
        onAnalyze(trimmed);
      }
    } catch {
      onAnalyze(trimmed);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  const sampleChannels = [
    { label: '@MrBeast', query: '@MrBeast' },
    { label: '@mkbhd', query: '@mkbhd' },
    { label: '@MixiGamingOfficial', query: '@MixiGamingOfficial' },
    { label: '@FAPTV', query: '@FAPTV' },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-sm relative z-40">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3">
        <div className="relative flex-1 z-50" ref={dropdownRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (candidates.length > 0) setShowDropdown(true);
            }}
            placeholder="Nhập tên kênh, @username (vd: Mixi, @MrBeast) hoặc ID (UC...)..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-950 border border-slate-800 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm md:text-base outline-none transition-all"
            disabled={isAnalyzing}
          />

          {isLoadingCandidates && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Autocomplete Dropdown Popup */}
          {showDropdown && candidates.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2.5 bg-slate-900/98 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Gợi ý kênh phù hợp ({candidates.length})</span>
                <span className="text-slate-500">Bấm vào để chọn ngay</span>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
                {candidates.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => handleSelectCandidate(channel.id)}
                    className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-4 rounded-xl hover:bg-slate-800/90 text-left transition-all group border border-transparent hover:border-slate-700/60"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <img
                        src={channel.avatar}
                        alt={channel.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-red-500/60 shrink-0 transition-all shadow-md bg-slate-950"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channel.title)}`;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-red-400 truncate transition-colors flex items-center gap-2">
                          <span>{channel.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1 flex-wrap">
                          <span className="text-red-400 font-semibold">{channel.customUrl}</span>
                          {channel.subscriberCount ? (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-300 font-sans">{formatCompactNumber(channel.subscriberCount)} sub</span>
                            </>
                          ) : null}
                          {channel.videoCount ? (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400 font-sans">{formatCompactNumber(channel.videoCount)} video</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 group-hover:text-red-400 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/60 group-hover:bg-red-500/10 group-hover:border-red-500/30 border border-slate-700/50 transition-all">
                      <span>Phân tích</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !input.trim()}
          className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm md:text-base rounded-xl shadow-lg shadow-red-600/25 transition-all duration-200 active:scale-95 whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang Phân Tích...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white/20" />
              <span>Tìm & Phân Tích</span>
            </>
          )}
        </button>
      </form>

      {/* Input guidance & Quick Tags */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Hỗ trợ từ khóa tên kênh (Mixi, MrBeast), `@username` hoặc ID `UC...`</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-medium">Thử nhanh:</span>
          {sampleChannels.map((c) => (
            <button
              key={c.query}
              type="button"
              onClick={() => {
                setInput(c.query);
                onAnalyze(c.query);
              }}
              disabled={isAnalyzing}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 font-mono transition-colors border border-slate-700/60"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Selection Dialog for Candidate Options */}
      <ChannelSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        query={input}
        candidates={candidates}
        onSelect={handleSelectCandidate}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};
