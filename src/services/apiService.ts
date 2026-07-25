import { ChannelData, AiAuditResult, SearchHistoryItem, FavoriteChannel, ChannelSearchResult, HashtagCompetitorStrategy } from '../types/youtube';

const API_BASE = '/api';

function getCustomApiKeyHeader(): Record<string, string> {
  const customKey = localStorage.getItem('custom_yt_api_key');
  if (customKey) {
    return { 'x-youtube-api-key': customKey };
  }
  return {};
}

export async function searchChannels(query: string): Promise<ChannelSearchResult[]> {
  const res = await fetch(`${API_BASE}/youtube/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getCustomApiKeyHeader(),
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Lỗi khi tìm kiếm danh sách kênh.');
  }

  return data.candidates || [];
}

export async function analyzeChannel(channelInput: string): Promise<ChannelData> {
  const res = await fetch(`${API_BASE}/youtube/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getCustomApiKeyHeader(),
    },
    body: JSON.stringify({ channelInput }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể lấy thông tin kênh YouTube.');
  }

  return data;
}

export async function runAiAudit(channel: ChannelData): Promise<AiAuditResult> {
  const res = await fetch(`${API_BASE}/youtube/audit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể khởi chạy Gemini AI Audit.');
  }

  return data;
}

export async function askGeminiAi(channel: ChannelData, question: string): Promise<string> {
  const res = await fetch(`${API_BASE}/youtube/ai-ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel, question }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể gửi câu hỏi tới Gemini AI.');
  }

  return data.answer || '';
}

export async function fetchHashtagCompetitorStrategy(channel: ChannelData): Promise<HashtagCompetitorStrategy> {
  const res = await fetch(`${API_BASE}/youtube/ai-hashtag-competitor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Không thể lấy chiến lược Hashtag & Đối thủ từ AI.');
  }

  return data;
}

export async function compareChannels(channelInputs: string[]): Promise<ChannelData[]> {
  const res = await fetch(`${API_BASE}/youtube/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getCustomApiKeyHeader(),
    },
    body: JSON.stringify({ channelInputs }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Lỗi khi so sánh các kênh.');
  }

  return data.channels || [];
}

export async function fetchSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    const data = await res.json();
    return data.history || [];
  } catch {
    // Fallback to localStorage if offline
    const local = localStorage.getItem('yt_search_history');
    return local ? JSON.parse(local) : [];
  }
}

export async function deleteSearchHistoryItem(id: string): Promise<SearchHistoryItem[]> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return data.history || [];
}

export async function fetchFavorites(): Promise<FavoriteChannel[]> {
  try {
    const res = await fetch(`${API_BASE}/favorites`);
    const data = await res.json();
    return data.favorites || [];
  } catch {
    const local = localStorage.getItem('yt_favorites');
    return local ? JSON.parse(local) : [];
  }
}

export async function toggleFavoriteChannel(channel: ChannelData): Promise<{ favorites: FavoriteChannel[]; isFavorite: boolean }> {
  const res = await fetch(`${API_BASE}/favorites/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Lỗi khi cập nhật danh sách yêu thích.');
  }

  return data;
}

export async function fetchPopularChannels(): Promise<{ name: string; handle: string; avatar: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/youtube/popular`);
    const data = await res.json();
    return data.popular || [];
  } catch {
    return [
      { name: 'MrBeast', handle: '@MrBeast', avatar: 'https://yt3.googleusercontent.com/fxG32-AIGB1f92eWzyRJHU2532p39A2-O4193539=s176-c-k-c0x00ffffff-no-rj' },
      { name: 'Marques Brownlee', handle: '@mkbhd', avatar: 'https://yt3.googleusercontent.com/lkH37D712tiA4R3p430f837381947=s176-c-k-c0x00ffffff-no-rj' },
    ];
  }
}
