export interface VideoRevenueEstimate {
  minUSD: number;
  maxUSD: number;
  avgUSD: number;
  minVND: number;
  maxVND: number;
  avgVND: number;
}

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string; // ISO or formatted
  durationSeconds: number;
  url: string;
  videoType?: 'long' | 'shorts';
  isShort?: boolean;
  titleQualityScore?: number;
  estimatedWatchHours?: number;
  estimatedRevenue?: VideoRevenueEstimate;
}

export interface ChannelScoreCategory {
  score: number; // calculated score
  maxScore: number; // max possible
  label: string;
  description: string;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ChannelScore {
  uploadConsistency: ChannelScoreCategory; // 0 - 15
  averageViews: ChannelScoreCategory;       // 0 - 20
  engagement: ChannelScoreCategory;         // 0 - 20
  growth: ChannelScoreCategory;             // 0 - 15
  titleQuality: ChannelScoreCategory;       // 0 - 10
  thumbnailQuality: ChannelScoreCategory;   // 0 - 10
  contentConsistency: ChannelScoreCategory; // 0 - 10
  overall: number;                           // 0 - 100
  tier: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface CalculatedMetrics {
  averageViews: number;             // Total views / total videos OR avg of recent videos
  viewsPerSubscriber: number;       // Total views / subscribers
  videosPerMonth: number;           // Total videos / channel age in months
  recentVideosPerMonth: number;     // Number of videos published in last 30 days
  averageUploadIntervalDays: number; // Avg days between recent uploads
  uploadFrequencyText: string;      // e.g. "2.5 ngày / video"
  channelAgeMonths: number;         // Channel age in months
  recentAvgLikes: number;
  recentAvgComments: number;
  recentEngagementRate: number;     // (Avg Likes + Avg Comments) / Avg Views * 100
  totalEstimatedWatchHours: number; // Estimated total watch hours for channel
  recentEstimatedWatchHours: number; // Estimated watch hours for recent videos
  recentRevenueEstimate: VideoRevenueEstimate; // Revenue estimate for recent videos
  totalRevenueEstimate: VideoRevenueEstimate;  // Revenue estimate for all channel views
  monthlyRevenueEstimate: VideoRevenueEstimate; // Revenue estimate per month
  dailyRevenueEstimate: VideoRevenueEstimate;   // Revenue estimate per day
}

export interface ChannelData {
  id: string;
  title: string;
  customUrl: string;
  description: string;
  avatar: string;
  banner: string;
  country: string;
  publishedAt: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  uploadsPlaylistId: string;
  recentVideos: VideoData[];
  calculatedMetrics: CalculatedMetrics;
  score: ChannelScore;
  analyzedAt: string;
}

export interface AiAuditSection {
  title: string;
  summary: string;
  bulletPoints: string[];
}

export interface AiAuditResult {
  channelId: string;
  channelTitle: string;
  strengths: string[];
  weaknesses: string[];
  seoAnalysis: {
    scoreEvaluation: string;
    keywordsObserved: string[];
    improvements: string[];
  };
  titleAnalysis: {
    evaluation: string;
    suggestedTitles: string[];
  };
  thumbnailAnalysis: {
    evaluation: string;
    recommendations: string[];
  };
  scheduleStrategy: {
    evaluation: string;
    optimalDays: string;
  };
  contentNicheStrategy?: {
    positioning: string;
    shortsVsLongAdvice: string;
    targetAudience: string;
  };
  monetizationAdvice?: {
    adRevenuePotential: string;
    otherRevenueSources: string[];
  };
  actionableRecommendations: string[];
  generatedAt: string;
}

export interface ChannelSearchResult {
  id: string;
  title: string;
  customUrl: string;
  avatar: string;
  description: string;
  subscriberCount?: number;
  videoCount?: number;
}

export interface SearchHistoryItem {
  id: string;
  channelId: string;
  title: string;
  customUrl: string;
  avatar: string;
  subscriberCount: number;
  searchedAt: string;
}

export interface HashtagCompetitorStrategy {
  mainKeywords: string[];
  recommendedHashtags: {
    tag: string;
    type: 'broad' | 'niche' | 'trending';
    estimatedReach: string;
    whyUse: string;
  }[];
  topicClusterIdeas: {
    topic: string;
    description: string;
    opportunityScore: string;
  }[];
  competitorInsights: {
    topCompetitorFormats: string;
    contentGapsToExploit: string[];
    winningTitlePatterns: string[];
  };
  generatedAt: string;
}

export interface FavoriteChannel {
  id: string;
  channelId: string;
  title: string;
  customUrl: string;
  avatar: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  addedAt: string;
}

export interface CompareChannelSummary {
  channel: ChannelData;
  score: ChannelScore;
  rank: number;
}
