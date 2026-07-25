import { useState, useEffect } from 'react';
import { useYouTubeAnalytics } from './hooks/useYouTubeAnalytics';
import { Header } from './components/Header';
import { ChannelSearch } from './components/ChannelSearch';
import { ChannelOverviewCard } from './components/ChannelOverviewCard';
import { MetricCards } from './components/MetricCards';
import { ChannelScoreCard } from './components/ChannelScoreCard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TopVideosTable } from './components/TopVideosTable';
import { ContentStrategySection } from './components/ContentStrategySection';
import { AiHashtagCompetitorSection } from './components/AiHashtagCompetitorSection';
import { AiAuditSection } from './components/AiAuditSection';
import { CompareView } from './components/CompareView';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ReportExportModal } from './components/ReportExportModal';
import { UserGuideModal } from './components/UserGuideModal';
import { CreatorToolsSection } from './components/CreatorToolsSection';
import { Toast } from './components/Toast';
import { DashboardSkeleton } from './components/SkeletonLoaders';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AlertCircle, Sparkles, Youtube } from 'lucide-react';

export default function App() {
  const {
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
  } = useYouTubeAnalytics();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // Auto-analyze a default channel on first load if none active
  useEffect(() => {
    if (!activeChannel && !isAnalyzing) {
      handleAnalyze('@MrBeast');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        favoritesCount={favorites.length}
        historyCount={searchHistory.length}
        compareCount={compareList.length}
      />

      {/* Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Top Search Area */}
        <ChannelSearch onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-950/80 border border-rose-500/40 p-4 rounded-2xl flex items-center gap-3 text-rose-200 text-sm font-medium shadow-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Lỗi phân tích: </span>
              {error}
            </div>
          </div>
        )}

        <ErrorBoundary>
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {isAnalyzing ? (
                <DashboardSkeleton />
              ) : activeChannel ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Channel Overview Banner Card */}
                  <ChannelOverviewCard
                    channel={activeChannel}
                    isFavorite={isCurrentFavorite}
                    onToggleFavorite={() => handleToggleFavorite(activeChannel)}
                    onAddToCompare={() => handleAddToCompare(activeChannel)}
                    onReAnalyze={() => handleAnalyze(activeChannel.customUrl || activeChannel.id)}
                    onExportReport={() => setIsExportModalOpen(true)}
                    isAnalyzing={isAnalyzing}
                  />

                  {/* Strictly Calculated Metrics Cards */}
                  <MetricCards channel={activeChannel} />

                  {/* Mathematically Calculated Channel Score */}
                  <ChannelScoreCard score={activeChannel.score} />

                  {/* Recharts Analytics Charts */}
                  <AnalyticsCharts channel={activeChannel} />

                  {/* Content Strategy & Keyword Analysis Section */}
                  <ContentStrategySection channel={activeChannel} />

                  {/* AI Hashtag, Topic Clusters & Competitor Analysis Section */}
                  <AiHashtagCompetitorSection channel={activeChannel} />

                  {/* Top Videos Table */}
                  <TopVideosTable videos={activeChannel.recentVideos} />

                  {/* Advanced Creator Tools Suite (AI Generator, Revenue Sim, Schedule) */}
                  <CreatorToolsSection channel={activeChannel} />

                  {/* Gemini AI Qualitative Audit */}
                  <AiAuditSection
                    auditResult={aiAuditResult}
                    onRunAudit={handleTriggerAiAudit}
                    isAuditing={isAuditing}
                    channelTitle={activeChannel.title}
                    channel={activeChannel}
                  />
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Chưa chọn kênh YouTube nào</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Hãy nhập URL, Channel ID hoặc @username ở trên để bắt đầu phân tích chi tiết.
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 2: TOOLS SUITE */}
          {activeTab === 'tools' && (
            <CreatorToolsSection channel={activeChannel} />
          )}

          {/* TAB 3: COMPARE */}
          {activeTab === 'compare' && (
            <CompareView
              compareList={compareList}
              onRemoveChannel={handleRemoveFromCompare}
              onRunComparison={handleRunComparison}
              isComparing={isComparing}
              onAnalyzeChannel={(input) => {
                handleAnalyze(input);
              }}
            />
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <FavoritesView
              favorites={favorites}
              onSelectChannel={(input) => {
                handleAnalyze(input);
              }}
              onRemoveFavorite={(channel) => {
                handleToggleFavorite(channel as any);
              }}
            />
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <HistoryView
              history={searchHistory}
              onSelectChannel={(input) => {
                handleAnalyze(input);
              }}
              onRemoveHistory={handleRemoveHistory}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">YouTube Pro Analytics</span>
            <span>— Platform phân tích kênh & AI Audit cá nhân</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Powered by Gemini 3.6 Flash & YouTube Data API v3</span>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={(key) => {
          showToast(key ? 'Đã cập nhật YouTube API Key cá nhân' : 'Đã xóa API Key cá nhân', 'info');
        }}
      />

      {/* Report Export Modal */}
      {isExportModalOpen && activeChannel && (
        <ReportExportModal
          channel={activeChannel}
          aiAuditResult={aiAuditResult}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Full User Guide PDF Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      {/* Toast Popup */}
      <Toast toast={toastMessage} />
    </div>
  );
}
