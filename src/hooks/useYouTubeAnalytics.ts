import { useState, useEffect, useCallback } from 'react';
import { ChannelData, AiAuditResult, FavoriteChannel, SearchHistoryItem } from '../types/youtube';
import {
  analyzeChannel,
  runAiAudit,
  fetchFavorites,
  toggleFavoriteChannel,
  fetchSearchHistory,
  deleteSearchHistoryItem,
  compareChannels as apiCompareChannels,
} from '../services/apiService';

export function useYouTubeAnalytics() {
  const [activeChannel, setActiveChannel] = useState<ChannelData | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<AiAuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'compare' | 'favorites' | 'history' | 'tools'>('dashboard');

  const [favorites, setFavorites] = useState<FavoriteChannel[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [compareList, setCompareList] = useState<ChannelData[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Load initial favorites and history
  const loadInitialData = useCallback(async () => {
    try {
      const [favs, hist] = await Promise.all([fetchFavorites(), fetchSearchHistory()]);
      setFavorites(favs);
      setSearchHistory(hist);
    } catch (e) {
      console.warn('Initial data load error:', e);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle Search Channel
  const handleAnalyze = useCallback(
    async (channelInput: string) => {
      if (!channelInput.trim()) {
        showToast('Vui lòng nhập Channel ID, URL hoặc @username', 'error');
        return;
      }

      setIsAnalyzing(true);
      setError(null);
      setAiAuditResult(null);

      try {
        const data = await analyzeChannel(channelInput);
        setActiveChannel(data);
        setActiveTab('dashboard');
        showToast(`Đã phân tích thành công kênh: ${data.title}`, 'success');

        // Refresh search history list
        const updatedHist = await fetchSearchHistory();
        setSearchHistory(updatedHist);
      } catch (err: any) {
        console.error('Analyze error:', err);
        setError(err.message || 'Không thể lấy thông tin kênh.');
        showToast(err.message || 'Lỗi khi phân tích kênh', 'error');
      } finally {
        setIsAnalyzing(false);
      }
    },
    [showToast]
  );

  // Handle Trigger AI Audit
  const handleTriggerAiAudit = useCallback(async () => {
    if (!activeChannel) return;

    setIsAuditing(true);
    try {
      showToast('Gemini AI đang phân tích toàn bộ dữ liệu kênh...', 'info');
      const audit = await runAiAudit(activeChannel);
      setAiAuditResult(audit);
      showToast('Hoàn tất Gemini AI Audit!', 'success');
    } catch (err: any) {
      console.error('AI Audit error:', err);
      showToast(err.message || 'Lỗi khi khởi chạy AI Audit', 'error');
    } finally {
      setIsAuditing(false);
    }
  }, [activeChannel, showToast]);

  // Handle Toggle Favorite
  const handleToggleFavorite = useCallback(
    async (channel: ChannelData) => {
      try {
        const { favorites: newFavs, isFavorite } = await toggleFavoriteChannel(channel);
        setFavorites(newFavs);
        showToast(
          isFavorite ? `Đã thêm ${channel.title} vào danh sách yêu thích` : `Đã xóa ${channel.title} khỏi yêu thích`,
          'success'
        );
      } catch (err: any) {
        showToast(err.message || 'Lỗi khi cập nhật yêu thích', 'error');
      }
    },
    [showToast]
  );

  // Check if current channel is favorited
  const isCurrentFavorite = activeChannel
    ? favorites.some((f) => f.channelId === activeChannel.id)
    : false;

  // Handle Remove History
  const handleRemoveHistory = useCallback(
    async (id: string) => {
      try {
        const updated = await deleteSearchHistoryItem(id);
        setSearchHistory(updated);
        showToast('Đã xóa khỏi lịch sử tìm kiếm', 'info');
      } catch (err: any) {
        showToast('Không thể xóa lịch sử', 'error');
      }
    },
    [showToast]
  );

  // Handle Compare Channels
  const handleRunComparison = useCallback(
    async (inputs: string[]) => {
      if (inputs.length === 0) return;
      setIsComparing(true);
      try {
        showToast('Đang so sánh dữ liệu các kênh...', 'info');
        const list = await apiCompareChannels(inputs);
        setCompareList(list);
        setActiveTab('compare');
        showToast(`Đã so sánh thành công ${list.length} kênh`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Lỗi khi so sánh kênh', 'error');
      } finally {
        setIsComparing(false);
      }
    },
    [showToast]
  );

  // Add channel to compare
  const handleAddToCompare = useCallback(
    (channel: ChannelData) => {
      if (compareList.some((c) => c.id === channel.id)) {
        showToast('Kênh này đã có trong danh sách so sánh', 'info');
        return;
      }
      if (compareList.length >= 5) {
        showToast('Tối đa so sánh 5 kênh cùng lúc', 'error');
        return;
      }
      setCompareList((prev) => [...prev, channel]);
      showToast(`Đã thêm ${channel.title} vào danh sách so sánh`, 'success');
    },
    [compareList, showToast]
  );

  const handleRemoveFromCompare = useCallback((channelId: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== channelId));
  }, []);

  return {
    activeChannel,
    aiAuditResult,
    isAnalyzing,
    isAuditing,
    error,
    toastMessage,
    activeTab,
    setActiveTab,
    favorites,
    searchHistory,
    compareList,
    isComparing,
    isCurrentFavorite,
    handleAnalyze,
    handleTriggerAiAudit,
    handleToggleFavorite,
    handleRemoveHistory,
    handleRunComparison,
    handleAddToCompare,
    handleRemoveFromCompare,
    showToast,
  };
}
