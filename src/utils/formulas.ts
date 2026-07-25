import { ChannelScore, ChannelScoreCategory, CalculatedMetrics, VideoData, VideoRevenueEstimate } from '../types/youtube';

/**
 * Calculate Estimated Watch Time & Revenue for a single video
 * Benchmark RPM:
 * - Shorts (duration <= 60s): RPM $0.05 / 1k views
 * - Standard videos (1m - 10m): RPM $1.20 / 1k views
 * - Long videos (>= 10m): RPM $2.00 / 1k views
 * 1 USD ≈ 25,000 VND
 */
export function calculateVideoWatchTimeAndRevenue(viewCount: number, durationSeconds: number): {
  estimatedWatchHours: number;
  estimatedRevenue: VideoRevenueEstimate;
} {
  const views = Math.max(0, viewCount || 0);
  const durSec = Math.max(0, durationSeconds || 0);

  let retention = 0.40; // 40% default average view duration
  let minRPM = 0.60;
  let maxRPM = 2.50;
  let avgRPM = 1.20;

  if (durSec > 0 && durSec <= 60) {
    retention = 0.75; // Shorts high retention
    minRPM = 0.02;
    maxRPM = 0.10;
    avgRPM = 0.05;
  } else if (durSec >= 600) {
    retention = 0.35; // Long videos
    minRPM = 1.00;
    maxRPM = 3.80;
    avgRPM = 2.00;
  }

  // Watch hours = (views * durSec * retention) / 3600
  // If durationSeconds is 0 (fallback), assume average 5 mins (300s)
  const effectiveDurSec = durSec > 0 ? durSec : 300;
  const estimatedWatchHours = Math.round((views * effectiveDurSec * retention) / 3600);

  const thousands = views / 1000;
  const minUSD = parseFloat((thousands * minRPM).toFixed(2));
  const maxUSD = parseFloat((thousands * maxRPM).toFixed(2));
  const avgUSD = parseFloat((thousands * avgRPM).toFixed(2));

  const exchangeRate = 25000;
  const minVND = Math.round(minUSD * exchangeRate);
  const maxVND = Math.round(maxUSD * exchangeRate);
  const avgVND = Math.round(avgUSD * exchangeRate);

  return {
    estimatedWatchHours,
    estimatedRevenue: {
      minUSD,
      maxUSD,
      avgUSD,
      minVND,
      maxVND,
      avgVND,
    },
  };
}

/**
 * Check if a video is a YouTube Short (belongs to YouTube Shorts tab)
 * Primary check: explicit videoType ('shorts' vs 'long') or isShort flag or /shorts/ in URL
 * Secondary check: #shorts in title/url
 */
export function isShortVideo(video: {
  isShort?: boolean;
  videoType?: 'long' | 'shorts';
  url?: string;
  title?: string;
  durationSeconds?: number;
}): boolean {
  if (typeof video.isShort === 'boolean') {
    return video.isShort;
  }
  if (video.videoType === 'shorts') return true;
  if (video.videoType === 'long') return false;

  const url = (video.url || '').toLowerCase();
  if (url.includes('/shorts/')) return true;

  const title = (video.title || '').toLowerCase();
  if (title.includes('#shorts') || title.includes('#short') || title.includes('[shorts]')) {
    return true;
  }

  // If title/url explicitly contains 'shorts', and duration <= 60s
  if ((url.includes('shorts') || title.includes('shorts')) && (video.durationSeconds || 0) <= 60) {
    return true;
  }

  // Regular videos in "Video" tab default to false (not a Short)
  return false;
}

/**
 * Format currency USD ($12.50, $1.5K, $1.2M)
 */
export function formatCurrencyUSD(amountUSD: number): string {
  if (amountUSD === undefined || amountUSD === null || isNaN(amountUSD)) return '$0';
  if (amountUSD >= 1_000_000) {
    return `$${(amountUSD / 1_000_000).toFixed(2)}M`;
  }
  if (amountUSD >= 1_000) {
    return `$${(amountUSD / 1_000).toFixed(1)}K`;
  }
  return `$${amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format currency VND (e.g. 500k ₫, 1.2M ₫, 1.5 Tỷ ₫)
 */
export function formatCurrencyVND(amountVND: number): string {
  if (amountVND === undefined || amountVND === null || isNaN(amountVND)) return '0 ₫';
  if (amountVND >= 1_000_000_000) {
    return `${(amountVND / 1_000_000_000).toFixed(2)} Tỷ ₫`;
  }
  if (amountVND >= 1_000_000) {
    return `${(amountVND / 1_000_000).toFixed(1)}M ₫`;
  }
  if (amountVND >= 1_000) {
    return `${(amountVND / 1_000).toFixed(0)}K ₫`;
  }
  return `${amountVND.toLocaleString('vi-VN')} ₫`;
}

/**
 * Format ISO 8601 duration string (e.g. PT1H2M10S or PT15M33S) into HH:MM:SS or MM:SS
 */
export function parseIsoDuration(isoDuration: string): { formatted: string; seconds: number } {
  if (!isoDuration) return { formatted: '00:00', seconds: 0 };

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { formatted: '00:00', seconds: 0 };

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return { formatted: `${hh}:${mm}:${ss}`, seconds: totalSeconds };
  } else {
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return { formatted: `${mm}:${ss}`, seconds: totalSeconds };
  }
}

/**
 * Format large numbers cleanly (1.23M, 456.7K, or localized 1,234,567)
 */
export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString('vi-VN');
}

/**
 * Format full integer with separators
 */
export function formatFullNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return 'N/A';
  return num.toLocaleString('vi-VN');
}

/**
 * Format relative date (e.g. 2 ngày trước, 3 tháng trước)
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 30) return `${diffDays} ngày trước`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} tháng trước`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} năm trước`;
}

/**
 * Calculate Channel Age in Months
 */
export function calculateChannelAgeMonths(publishedAt: string): number {
  if (!publishedAt) return 1;
  const created = new Date(publishedAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;
  return Math.max(1, totalMonths);
}

/**
 * Assign grade based on score and maxScore
 */
function getCategoryGrade(score: number, maxScore: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  const ratio = score / maxScore;
  if (ratio >= 0.9) return 'S';
  if (ratio >= 0.75) return 'A';
  if (ratio >= 0.6) return 'B';
  if (ratio >= 0.45) return 'C';
  if (ratio >= 0.3) return 'D';
  return 'F';
}

/**
 * Calculate overall Tier
 */
function getTier(overall: number): 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' {
  if (overall >= 92) return 'S+';
  if (overall >= 85) return 'S';
  if (overall >= 78) return 'A+';
  if (overall >= 70) return 'A';
  if (overall >= 58) return 'B';
  if (overall >= 45) return 'C';
  return 'D';
}

/**
 * STRICT MATHEMATICAL CALCULATIONS FOR CHANNEL METRICS AND SCORE
 * No random values. Pure deterministic code formulas.
 */
export function calculateChannelMetricsAndScore(
  subscriberCount: number,
  viewCount: number,
  videoCount: number,
  publishedAt: string,
  recentVideos: VideoData[]
): { metrics: CalculatedMetrics; score: ChannelScore } {
  const channelAgeMonths = calculateChannelAgeMonths(publishedAt);
  const subs = Math.max(1, subscriberCount || 0);
  const views = viewCount || 0;
  const videos = Math.max(1, videoCount || 0);

  // 1. Calculate Recent Video Aggregates and Enrich Videos
  let recentTotalViews = 0;
  let recentTotalLikes = 0;
  let recentTotalComments = 0;
  let recentEstimatedWatchHours = 0;
  let recentMinUSD = 0;
  let recentMaxUSD = 0;
  let recentAvgUSD = 0;
  const recentCount = recentVideos.length;

  if (recentCount > 0) {
    recentVideos.forEach((v) => {
      recentTotalViews += v.viewCount || 0;
      recentTotalLikes += v.likeCount || 0;
      recentTotalComments += v.commentCount || 0;

      // Enrich individual video object with Watch Time & Revenue estimates
      const videoCalc = calculateVideoWatchTimeAndRevenue(v.viewCount || 0, v.durationSeconds || 0);
      v.estimatedWatchHours = videoCalc.estimatedWatchHours;
      v.estimatedRevenue = videoCalc.estimatedRevenue;

      recentEstimatedWatchHours += videoCalc.estimatedWatchHours;
      recentMinUSD += videoCalc.estimatedRevenue.minUSD;
      recentMaxUSD += videoCalc.estimatedRevenue.maxUSD;
      recentAvgUSD += videoCalc.estimatedRevenue.avgUSD;
    });
  }

  const exchangeRate = 25000;
  const recentRevenueEstimate: VideoRevenueEstimate = {
    minUSD: parseFloat(recentMinUSD.toFixed(2)),
    maxUSD: parseFloat(recentMaxUSD.toFixed(2)),
    avgUSD: parseFloat(recentAvgUSD.toFixed(2)),
    minVND: Math.round(recentMinUSD * exchangeRate),
    maxVND: Math.round(recentMaxUSD * exchangeRate),
    avgVND: Math.round(recentAvgUSD * exchangeRate),
  };

  // Calculate Channel Total Estimates (from total viewCount)
  // Average duration estimate across recent videos, fallback to 6 minutes (360s)
  let avgVideoDurationSec = 360;
  if (recentCount > 0) {
    const totalSec = recentVideos.reduce((acc, curr) => acc + (curr.durationSeconds || 360), 0);
    avgVideoDurationSec = Math.max(60, Math.round(totalSec / recentCount));
  }
  const totalCalc = calculateVideoWatchTimeAndRevenue(views, avgVideoDurationSec);
  const totalEstimatedWatchHours = totalCalc.estimatedWatchHours;
  const totalRevenueEstimate = totalCalc.estimatedRevenue;

  const recentAvgViews = recentCount > 0 ? Math.round(recentTotalViews / recentCount) : Math.round(views / videos);
  const recentAvgLikes = recentCount > 0 ? Math.round(recentTotalLikes / recentCount) : 0;
  const recentAvgComments = recentCount > 0 ? Math.round(recentTotalComments / recentCount) : 0;
  
  const recentEngagementRate = recentAvgViews > 0 
    ? parseFloat((((recentAvgLikes + recentAvgComments) / recentAvgViews) * 100).toFixed(2))
    : 0;

  // Calculate upload intervals
  let averageUploadIntervalDays = 7;
  let recentVideosIn30Days = 0;
  const now = new Date();

  if (recentCount >= 2) {
    const dates = recentVideos
      .map((v) => new Date(v.publishedAt).getTime())
      .filter((t) => !isNaN(t))
      .sort((a, b) => b - a); // newest first

    if (dates.length >= 2) {
      const timespanDays = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
      averageUploadIntervalDays = Math.max(0.1, parseFloat((timespanDays / (dates.length - 1)).toFixed(1)));
    }

    // Count in last 30 days
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
    recentVideosIn30Days = dates.filter((d) => d >= thirtyDaysAgo).length;
  } else {
    // Fallback based on total channel age
    const totalDays = channelAgeMonths * 30.4;
    averageUploadIntervalDays = parseFloat((totalDays / videos).toFixed(1));
    recentVideosIn30Days = Math.round(30.4 / averageUploadIntervalDays);
  }

  const uploadFrequencyText = averageUploadIntervalDays <= 1 
    ? 'Hàng ngày (>1 video/ngày)' 
    : `${averageUploadIntervalDays} ngày / video`;

  const viewsPerSubscriber = parseFloat((views / subs).toFixed(2));
  const videosPerMonth = parseFloat((videos / channelAgeMonths).toFixed(1));

  // Calculate Monthly & Daily Estimated Revenue
  const estimatedMonthlyVideos = recentVideosIn30Days > 0 
    ? recentVideosIn30Days 
    : Math.max(1, Math.round(30 / (averageUploadIntervalDays || 7)));

  const estimatedMonthlyViews = Math.max(
    recentAvgViews * estimatedMonthlyVideos,
    Math.round(views / Math.max(1, channelAgeMonths))
  );

  const monthlyCalc = calculateVideoWatchTimeAndRevenue(estimatedMonthlyViews, avgVideoDurationSec);
  const monthlyRevenueEstimate = monthlyCalc.estimatedRevenue;

  const estimatedDailyViews = Math.round(estimatedMonthlyViews / 30);
  const dailyCalc = calculateVideoWatchTimeAndRevenue(estimatedDailyViews, avgVideoDurationSec);
  const dailyRevenueEstimate = dailyCalc.estimatedRevenue;

  const metrics: CalculatedMetrics = {
    averageViews: recentAvgViews,
    viewsPerSubscriber,
    videosPerMonth,
    recentVideosPerMonth: recentVideosIn30Days,
    averageUploadIntervalDays,
    uploadFrequencyText,
    channelAgeMonths,
    recentAvgLikes,
    recentAvgComments,
    recentEngagementRate,
    totalEstimatedWatchHours,
    recentEstimatedWatchHours,
    recentRevenueEstimate,
    totalRevenueEstimate,
    monthlyRevenueEstimate,
    dailyRevenueEstimate,
  };

  // ==========================================
  // SCORE FORMULA CALCULATION (MAX 100 POINTS)
  // ==========================================

  // 1. Upload Consistency (Max 15 pts)
  let consistencyScore = 0;
  if (averageUploadIntervalDays >= 1 && averageUploadIntervalDays <= 4) {
    consistencyScore = 15;
  } else if (averageUploadIntervalDays > 4 && averageUploadIntervalDays <= 7) {
    consistencyScore = 13;
  } else if (averageUploadIntervalDays > 7 && averageUploadIntervalDays <= 14) {
    consistencyScore = 10;
  } else if (averageUploadIntervalDays > 14 && averageUploadIntervalDays <= 30) {
    consistencyScore = 7;
  } else if (averageUploadIntervalDays > 30 && averageUploadIntervalDays <= 60) {
    consistencyScore = 4;
  } else {
    consistencyScore = 2;
  }

  const uploadConsistency: ChannelScoreCategory = {
    score: consistencyScore,
    maxScore: 15,
    label: 'Upload Consistency',
    description: `Tần suất đăng video: ~${averageUploadIntervalDays} ngày/video.`,
    grade: getCategoryGrade(consistencyScore, 15),
  };

  // 2. Average Views (Max 20 pts)
  // Based on recent view to subscriber ratio
  const viewToSubRatio = recentAvgViews / subs;
  let avgViewsScore = 0;
  if (viewToSubRatio >= 0.25) {
    avgViewsScore = 20;
  } else if (viewToSubRatio >= 0.15) {
    avgViewsScore = 17;
  } else if (viewToSubRatio >= 0.08) {
    avgViewsScore = 14;
  } else if (viewToSubRatio >= 0.03) {
    avgViewsScore = 10;
  } else if (viewToSubRatio >= 0.01) {
    avgViewsScore = 6;
  } else {
    avgViewsScore = 3;
  }

  const averageViewsCat: ChannelScoreCategory = {
    score: avgViewsScore,
    maxScore: 20,
    label: 'Average Views',
    description: `Tỷ lệ lượt xem trung bình / Sub: ${(viewToSubRatio * 100).toFixed(1)}%.`,
    grade: getCategoryGrade(avgViewsScore, 20),
  };

  // 3. Engagement (Max 20 pts)
  // Based on recentEngagementRate = (Likes + Comments) / Views * 100
  let engagementScore = 0;
  if (recentEngagementRate >= 5.0) {
    engagementScore = 20;
  } else if (recentEngagementRate >= 3.5) {
    engagementScore = 17;
  } else if (recentEngagementRate >= 2.0) {
    engagementScore = 14;
  } else if (recentEngagementRate >= 1.0) {
    engagementScore = 10;
  } else if (recentEngagementRate >= 0.4) {
    engagementScore = 6;
  } else {
    engagementScore = 3;
  }

  const engagementCat: ChannelScoreCategory = {
    score: engagementScore,
    maxScore: 20,
    label: 'Engagement Rate',
    description: `Tỷ lệ tương tác (Thích & Bình luận / View): ${recentEngagementRate}%.`,
    grade: getCategoryGrade(engagementScore, 20),
  };

  // 4. Growth Momentum (Max 15 pts)
  // Evaluates monthly video production and sub size
  let growthScore = 0;
  const recentVolumePoint = Math.min(10, recentVideosIn30Days * 2.5);
  const totalVolumePoint = Math.min(5, (viewsPerSubscriber / 10));
  growthScore = Math.min(15, Math.round(recentVolumePoint + totalVolumePoint));

  const growthCat: ChannelScoreCategory = {
    score: growthScore,
    maxScore: 15,
    label: 'Growth Velocity',
    description: `Sản lượng video gần đây: ${recentVideosIn30Days} video/tháng.`,
    grade: getCategoryGrade(growthScore, 15),
  };

  // 5. Title Quality (Max 10 pts)
  // Evaluate title structure from recent videos
  let titleQualityScore = 7; // default moderate
  if (recentVideos.length > 0) {
    let goodLengthCount = 0;
    let clickbaitSpamCount = 0;

    recentVideos.forEach((v) => {
      const len = v.title.length;
      if (len >= 35 && len <= 80) goodLengthCount++;
      if (/([!]{2,}|\?{2,}|ALL CAPS)/.test(v.title)) clickbaitSpamCount++;
    });

    const goodRatio = goodLengthCount / recentVideos.length;
    titleQualityScore = Math.min(10, Math.max(2, Math.round(goodRatio * 8 + (clickbaitSpamCount === 0 ? 2 : 0))));
  }

  const titleCat: ChannelScoreCategory = {
    score: titleQualityScore,
    maxScore: 10,
    label: 'Title Quality',
    description: `Tối ưu hóa độ dài & cấu trúc tiêu đề video.`,
    grade: getCategoryGrade(titleQualityScore, 10),
  };

  // 6. Thumbnail Quality (Max 10 pts)
  // Checks thumbnail resolution availability
  let thumbnailQualityScore = 8;
  if (recentVideos.length > 0) {
    const maxResCount = recentVideos.filter((v) => v.thumbnail.includes('maxresdefault') || v.thumbnail.includes('hqdefault')).length;
    const ratio = maxResCount / recentVideos.length;
    thumbnailQualityScore = Math.min(10, Math.max(3, Math.round(ratio * 10)));
  }

  const thumbnailCat: ChannelScoreCategory = {
    score: thumbnailQualityScore,
    maxScore: 10,
    label: 'Thumbnail Quality',
    description: `Độ phân giải & độ hoàn thiện hình thu nhỏ (Thumbnail).`,
    grade: getCategoryGrade(thumbnailQualityScore, 10),
  };

  // 7. Content Consistency (Max 10 pts)
  // Evaluate duration regularity
  let contentConsistencyScore = 8;
  if (recentVideos.length >= 3) {
    const durations = recentVideos.map((v) => v.durationSeconds).filter((s) => s > 0);
    if (durations.length >= 3) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance = durations.reduce((acc, curr) => acc + Math.pow(curr - avgDuration, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);
      const relativeStdDev = stdDev / (avgDuration || 1);

      if (relativeStdDev < 0.4) contentConsistencyScore = 10;
      else if (relativeStdDev < 0.7) contentConsistencyScore = 8;
      else if (relativeStdDev < 1.2) contentConsistencyScore = 6;
      else contentConsistencyScore = 4;
    }
  }

  const contentCat: ChannelScoreCategory = {
    score: contentConsistencyScore,
    maxScore: 10,
    label: 'Content Consistency',
    description: `Sự đồng nhất về định dạng và thời lượng video.`,
    grade: getCategoryGrade(contentConsistencyScore, 10),
  };

  const overall = uploadConsistency.score +
    averageViewsCat.score +
    engagementCat.score +
    growthCat.score +
    titleCat.score +
    thumbnailCat.score +
    contentCat.score;

  const score: ChannelScore = {
    uploadConsistency,
    averageViews: averageViewsCat,
    engagement: engagementCat,
    growth: growthCat,
    titleQuality: titleCat,
    thumbnailQuality: thumbnailCat,
    contentConsistency: contentCat,
    overall,
    tier: getTier(overall),
  };

  return { metrics, score };
}

export interface TitleSeoAnalysis {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  length: number;
  hasNumbers: boolean;
  hasPowerWords: boolean;
  hasBrackets: boolean;
  hasEmoji: boolean;
  feedback: string[];
  suggestions: string[];
}

export interface KeywordInsight {
  keyword: string;
  count: number;
  avgViews: number;
  viewMultiplier: number;
}

export interface DayScheduleInsight {
  dayName: string;
  shortName: string;
  count: number;
  avgViews: number;
  isPeakDay: boolean;
}

export interface DurationCategoryInsight {
  category: string;
  label: string;
  range: string;
  count: number;
  totalViews: number;
  avgViews: number;
  totalWatchHours: number;
  estimatedRevenueUSD: number;
  totalDurationSeconds: number;
  avgDurationSeconds: number;
}

/**
 * Format total duration seconds into readable string (e.g. 2h 15m, 14m 30s, 45s)
 */
export function formatTotalDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins > 0 ? mins + 'm' : ''}`;
  }
  if (mins > 0) {
    return `${mins}m ${secs > 0 ? secs + 's' : ''}`;
  }
  return `${secs}s`;
}

/**
 * Analyze YouTube Video Title SEO & Clickability Score
 */
export function analyzeTitleSeo(title: string): TitleSeoAnalysis {
  const cleanTitle = (title || '').trim();
  const length = cleanTitle.length;
  let score = 50;
  const feedback: string[] = [];
  const suggestions: string[] = [];

  if (length >= 35 && length <= 70) {
    score += 20;
    feedback.push('Độ dài tiêu đề hoàn hảo (35 - 70 ký tự), hiển thị trọn vẹn trên điện thoại.');
  } else if (length < 20) {
    score -= 15;
    feedback.push('Tiêu đề quá ngắn (dưới 20 ký tự), thiếu từ khóa tìm kiếm.');
    suggestions.push('Thêm thông tin hoặc từ khóa phụ để tiêu đề rõ ràng hơn.');
  } else if (length > 80) {
    score -= 10;
    feedback.push('Tiêu đề quá dài (trên 80 ký tự), dễ bị ẩn đuôi trên mobile.');
    suggestions.push('Rút gọn các từ thừa, đưa từ khóa chính lên 50 ký tự đầu tiên.');
  } else {
    score += 10;
    feedback.push('Độ dài ở mức khá.');
  }

  const hasNumbers = /\d+/.test(cleanTitle);
  if (hasNumbers) {
    score += 10;
    feedback.push('Chứa con số cụ thể — giúp tăng tỉ lệ nhấp (CTR) từ 15-20%.');
  } else {
    suggestions.push('Thêm con số cụ thể (ví dụ: "Top 5", "trong 24h", "2026") để tăng độ tin cậy.');
  }

  const powerWordsRegex = /(bí mật|sự thật|hướng dẫn|cách|tại sao|mới nhất|cực|đỉnh|khủng|nhanh|dễ|miễn phí|mẹo|chi tiết|bất ngờ|kinh ngạc|so sánh|top|review|audit|secret|how to|vs|best|free|easy|ultimate|worst|fast)/i;
  const hasPowerWords = powerWordsRegex.test(cleanTitle);
  if (hasPowerWords) {
    score += 10;
    feedback.push('Chứa từ khóa kích thích tò mò / hướng dẫn thu hút.');
  } else {
    suggestions.push('Thêm từ hành động hoặc kích thích tò mò (như: Bí mật, Hướng dẫn, Review, Sự thật, Top...).');
  }

  const hasBrackets = /[\[\(【].*?[\]\)】]/.test(cleanTitle);
  if (hasBrackets) {
    score += 5;
    feedback.push('Sử dụng ngoặc bổ trợ giúp phân loại định dạng nội dung.');
  }

  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(cleanTitle);
  if (hasEmoji) {
    score += 5;
    feedback.push('Có biểu tượng Emoji thu hút ánh nhìn.');
  }

  score = Math.min(100, Math.max(10, score));

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'C';
  if (score >= 90) grade = 'S';
  else if (score >= 75) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 45) grade = 'C';
  else grade = 'D';

  return {
    score,
    grade,
    length,
    hasNumbers,
    hasPowerWords,
    hasBrackets,
    hasEmoji,
    feedback,
    suggestions,
  };
}

/**
 * Extract Top Keywords & View Multipliers from Recent Videos
 */
export function extractKeywordPerformance(videos: VideoData[], channelAvgViews: number): KeywordInsight[] {
  if (!videos || videos.length === 0) return [];

  const stopwordsList = [
    'và', 'với', 'trong', 'là', 'bằng', 'về', 'cái', 'như', 'khi', 'có', 'không', 'ở', 'sẽ', 'được', 'ra', 'đã', 'này', 'vẫn', 'đây', 'của', 'cho', 'một', 'những', 'các', 'thì', 'mà', 'từ', 'sự', 'đến', 'lại', 'phải', 'anh', 'em', 'tôi', 'bạn',
    'the', 'and', 'or', 'in', 'on', 'at', 'to', 'a', 'an', 'is', 'for', 'of', 'with', 'by', 'from', 'this', 'that', 'it', 'my', 'your', 'we', 'you', 'video', 'full', 'official', 'clip', 'hd', 'part', 'ep', 'tập'
  ];
  const stopwords = new Set(stopwordsList);

  const kwStats: Record<string, { count: number; totalViews: number }> = {};

  videos.forEach((v) => {
    const words = v.title
      .toLowerCase()
      .replace(/[^\w\sàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopwords.has(w) && !/^\d+$/.test(w));

    const uniqueWords = Array.from(new Set(words));
    uniqueWords.forEach((word) => {
      if (!kwStats[word]) {
        kwStats[word] = { count: 0, totalViews: 0 };
      }
      kwStats[word].count += 1;
      kwStats[word].totalViews += v.viewCount || 0;
    });
  });

  const baseAvg = Math.max(1, channelAvgViews || 1);

  return Object.entries(kwStats)
    .filter(([_, stat]) => stat.count >= 1)
    .map(([keyword, stat]) => {
      const avgViews = Math.round(stat.totalViews / stat.count);
      const viewMultiplier = parseFloat((avgViews / baseAvg).toFixed(2));
      return {
        keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        count: stat.count,
        avgViews,
        viewMultiplier,
      };
    })
    .sort((a, b) => b.avgViews - a.avgViews)
    .slice(0, 12);
}

/**
 * Analyze Upload Publishing Schedule (Day of Week Performance)
 */
export function analyzePublishingSchedule(videos: VideoData[]): DayScheduleInsight[] {
  const daysMap = [
    { dayName: 'Chủ Nhật', shortName: 'CN' },
    { dayName: 'Thứ Hai', shortName: 'T2' },
    { dayName: 'Thứ Ba', shortName: 'T3' },
    { dayName: 'Thứ Tư', shortName: 'T4' },
    { dayName: 'Thứ Năm', shortName: 'T5' },
    { dayName: 'Thứ Sáu', shortName: 'T6' },
    { dayName: 'Thứ Bảy', shortName: 'T7' },
  ];

  const stats = daysMap.map((d) => ({
    ...d,
    count: 0,
    totalViews: 0,
    avgViews: 0,
    isPeakDay: false,
  }));

  videos.forEach((v) => {
    if (v.publishedAt) {
      const date = new Date(v.publishedAt);
      if (!isNaN(date.getTime())) {
        const dayIdx = date.getDay();
        stats[dayIdx].count += 1;
        stats[dayIdx].totalViews += v.viewCount || 0;
      }
    }
  });

  let maxAvgViews = -1;
  let peakIdx = -1;

  stats.forEach((s, idx) => {
    s.avgViews = s.count > 0 ? Math.round(s.totalViews / s.count) : 0;
    if (s.count > 0 && s.avgViews > maxAvgViews) {
      maxAvgViews = s.avgViews;
      peakIdx = idx;
    }
  });

  if (peakIdx !== -1) {
    stats[peakIdx].isPeakDay = true;
  }

  const reordered = [...stats.slice(1), stats[0]];
  return reordered;
}

/**
 * Analyze Video Duration Category Performance
 */
export function analyzeDurationPerformance(videos: VideoData[]): DurationCategoryInsight[] {
  const categories = [
    { category: 'shorts', label: 'YouTube Shorts', range: '≤ 60 giây' },
    { category: 'short_form', label: 'Video Ngắn', range: '1 - 5 phút' },
    { category: 'mid_form', label: 'Video Vừa', range: '5 - 15 phút' },
    { category: 'long_form', label: 'Video Dài', range: '> 15 phút' },
  ];

  const results = categories.map((cat) => ({
    ...cat,
    count: 0,
    totalViews: 0,
    avgViews: 0,
    totalWatchHours: 0,
    estimatedRevenueUSD: 0,
    totalDurationSeconds: 0,
    avgDurationSeconds: 0,
  }));

  videos.forEach((v) => {
    const durSec = v.durationSeconds || 0;
    const calc = calculateVideoWatchTimeAndRevenue(v.viewCount || 0, durSec);
    const watchHours = v.estimatedWatchHours ?? calc.estimatedWatchHours;
    const revUSD = v.estimatedRevenue?.avgUSD ?? calc.estimatedRevenue.avgUSD;

    let targetIdx = 2;
    if (durSec <= 60) targetIdx = 0;
    else if (durSec < 300) targetIdx = 1;
    else if (durSec <= 900) targetIdx = 2;
    else targetIdx = 3;

    results[targetIdx].count += 1;
    results[targetIdx].totalViews += v.viewCount || 0;
    results[targetIdx].totalWatchHours += watchHours;
    results[targetIdx].estimatedRevenueUSD += revUSD;
    results[targetIdx].totalDurationSeconds += durSec;
  });

  results.forEach((r) => {
    r.avgViews = r.count > 0 ? Math.round(r.totalViews / r.count) : 0;
    r.avgDurationSeconds = r.count > 0 ? Math.round(r.totalDurationSeconds / r.count) : 0;
    r.estimatedRevenueUSD = parseFloat(r.estimatedRevenueUSD.toFixed(2));
  });

  return results;
}
