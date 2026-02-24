import { Router } from 'express';
import { ShipmentScraper } from './scraper.js';
import { searchImporters } from './services/geminiService.js'; // ✅ server-side only

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Traditional scraping
router.get('/scrape', async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const [yetiLeads, alibabaLeads] = await Promise.all([
      ShipmentScraper.scrapeImportYeti(query),
      ShipmentScraper.scrapeAlibabaBuyers(query)
    ]);

    res.json({
      results: [...yetiLeads, ...alibabaLeads],
      count: yetiLeads.length + alibabaLeads.length
    });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: 'Failed to perform scrape' });
  }
});

// ✅ Gemini AI importer search
router.get('/search-importers', async (req, res) => {
  try {
    const { query, city = '', state = '', industry = '' } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await searchImporters({
      query: String(query),
      city: String(city),
      state: String(state),
      industry: String(industry)
    });

    res.json(results);
  } catch (error: any) {
    console.error('/search-importers error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;