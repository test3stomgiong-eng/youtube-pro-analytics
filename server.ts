import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fetchYouTubeChannelData, searchYouTubeChannels } from './server/youtube.js';
import { auditChannelWithGemini, askGeminiAboutChannel, analyzeHashtagCompetitorStrategy } from './server/gemini.js';
import { SearchHistoryItem, FavoriteChannel } from './src/types/youtube.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent cache for history and favorites (with client sync)
let searchHistory: SearchHistoryItem[] = [
  {
    id: 'h_mrbeast',
    channelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
    title: 'MrBeast',
    customUrl: '@MrBeast',
    avatar: 'https://yt3.googleusercontent.com/fxG32-AIGB1f92eWzyRJHU2532p39A2-O4193539=s176-c-k-c0x00ffffff-no-rj',
    subscriberCount: 365000000,
    searchedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: 'h_mkbhd',
    channelId: 'UCBJycsmduvYEL83R_U4JblQ',
    title: 'Marques Brownlee',
    customUrl: '@mkbhd',
    avatar: 'https://yt3.googleusercontent.com/lkH37D712tiA4R3p430f837381947=s176-c-k-c0x00ffffff-no-rj',
    subscriberCount: 19200000,
    searchedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
  {
    id: 'h_mixi',
    channelId: 'UC2G8pB9138X5xM14v1',
    title: 'MixiGaming',
    customUrl: '@MixiGamingOfficial',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
    subscriberCount: 7500000,
    searchedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
];

let favorites: FavoriteChannel[] = [];

// ===================================
// API ROUTES
// ===================================

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Search matching YouTube channels candidate list
app.post('/api/youtube/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Vui lòng cung cấp từ khóa tìm kiếm' });
    }

    const userApiKey = (req.headers['x-youtube-api-key'] as string) || undefined;
    const candidates = await searchYouTubeChannels(query, userApiKey);

    return res.json({ query, candidates });
  } catch (err: any) {
    console.error('API /api/youtube/search error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi tìm kiếm danh sách kênh' });
  }
});

// Analyze single YouTube channel
app.post('/api/youtube/analyze', async (req, res) => {
  try {
    const { channelInput } = req.body;
    if (!channelInput) {
      return res.status(400).json({ error: 'Vui lòng cung cấp URL, Channel ID hoặc @username' });
    }

    const userApiKey = (req.headers['x-youtube-api-key'] as string) || undefined;
    const channelData = await fetchYouTubeChannelData(channelInput, userApiKey);

    // Save to search history
    const historyItem: SearchHistoryItem = {
      id: `h_${Date.now()}_${channelData.id}`,
      channelId: channelData.id,
      title: channelData.title,
      customUrl: channelData.customUrl,
      avatar: channelData.avatar,
      subscriberCount: channelData.subscriberCount,
      searchedAt: new Date().toISOString(),
    };

    // Prevent duplicates
    searchHistory = [historyItem, ...searchHistory.filter((h) => h.channelId !== channelData.id)].slice(0, 30);

    return res.json(channelData);
  } catch (err: any) {
    console.error('API /api/youtube/analyze error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi hệ thống khi phân tích kênh YouTube' });
  }
});

// Run Qualitative AI Audit using Gemini
app.post('/api/youtube/audit', async (req, res) => {
  try {
    const { channel } = req.body;
    if (!channel || !channel.id) {
      return res.status(400).json({ error: 'Dữ liệu kênh không hợp lệ' });
    }

    const auditResult = await auditChannelWithGemini(channel);
    return res.json(auditResult);
  } catch (err: any) {
    console.error('API /api/youtube/audit error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi thực hiện AI Audit' });
  }
});

// Interactive Ask Gemini AI about channel
app.post('/api/youtube/ai-ask', async (req, res) => {
  try {
    const { channel, question } = req.body;
    if (!channel || !question) {
      return res.status(400).json({ error: 'Thiếu dữ liệu kênh hoặc câu hỏi' });
    }

    const answer = await askGeminiAboutChannel(channel, question);
    return res.json({ answer });
  } catch (err: any) {
    console.error('API /api/youtube/ai-ask error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi hỏi Gemini AI' });
  }
});

// AI Hashtag, Topic Cluster & Competitor Strategy Analysis
app.post('/api/youtube/ai-hashtag-competitor', async (req, res) => {
  try {
    const { channel } = req.body;
    if (!channel) {
      return res.status(400).json({ error: 'Thiếu dữ liệu kênh' });
    }

    const result = await analyzeHashtagCompetitorStrategy(channel);
    return res.json(result);
  } catch (err: any) {
    console.error('API /api/youtube/ai-hashtag-competitor error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi phân tích Hashtag & Đối thủ' });
  }
});

// Compare up to 5 channels
app.post('/api/youtube/compare', async (req, res) => {
  try {
    const { channelInputs } = req.body;
    if (!Array.isArray(channelInputs) || channelInputs.length === 0) {
      return res.status(400).json({ error: 'Danh sách kênh so sánh không hợp lệ' });
    }

    const cleanInputs = channelInputs.slice(0, 5).filter((i) => typeof i === 'string' && i.trim().length > 0);
    const userApiKey = (req.headers['x-youtube-api-key'] as string) || undefined;

    const results = await Promise.allSettled(
      cleanInputs.map((input) => fetchYouTubeChannelData(input, userApiKey))
    );

    const channels = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value);

    // Sort by Channel Score overall descending
    channels.sort((a, b) => b.score.overall - a.score.overall);

    return res.json({ channels });
  } catch (err: any) {
    console.error('API /api/youtube/compare error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi khi so sánh kênh' });
  }
});

// History Endpoints
app.get('/api/history', (_req, res) => {
  return res.json({ history: searchHistory });
});

app.post('/api/history', (req, res) => {
  const { item } = req.body;
  if (item && item.channelId) {
    searchHistory = [item, ...searchHistory.filter((h) => h.channelId !== item.channelId)].slice(0, 30);
  }
  return res.json({ history: searchHistory });
});

app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  searchHistory = searchHistory.filter((h) => h.id !== id && h.channelId !== id);
  return res.json({ history: searchHistory });
});

// Favorites Endpoints
app.get('/api/favorites', (_req, res) => {
  return res.json({ favorites });
});

app.post('/api/favorites/toggle', (req, res) => {
  const { channel } = req.body;
  if (!channel || !channel.id) {
    return res.status(400).json({ error: 'Dữ liệu kênh không hợp lệ' });
  }

  const existingIndex = favorites.findIndex((f) => f.channelId === channel.id);
  if (existingIndex >= 0) {
    // Remove
    favorites.splice(existingIndex, 1);
  } else {
    // Add
    const favItem: FavoriteChannel = {
      id: `fav_${Date.now()}_${channel.id}`,
      channelId: channel.id,
      title: channel.title,
      customUrl: channel.customUrl,
      avatar: channel.avatar,
      subscriberCount: channel.subscriberCount,
      viewCount: channel.viewCount,
      videoCount: channel.videoCount,
      addedAt: new Date().toISOString(),
    };
    favorites.unshift(favItem);
  }

  return res.json({ favorites, isFavorite: existingIndex === -1 });
});

// Popular channels quick list
app.get('/api/youtube/popular', (_req, res) => {
  const popular = [
    { name: 'MrBeast', handle: '@MrBeast', avatar: 'https://yt3.googleusercontent.com/fxG32-AIGB1f92eWzyRJHU2532p39A2-O4193539=s176-c-k-c0x00ffffff-no-rj' },
    { name: 'Marques Brownlee', handle: '@mkbhd', avatar: 'https://yt3.googleusercontent.com/lkH37D712tiA4R3p430f837381947=s176-c-k-c0x00ffffff-no-rj' },
    { name: 'MixiGaming', handle: '@MixiGamingOfficial', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80' },
    { name: 'FAP TV', handle: '@FAPTV', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  ];
  return res.json({ popular });
});

// ===================================
// VITE / STATIC SERVING
// ===================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[YouTube Analytics Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
