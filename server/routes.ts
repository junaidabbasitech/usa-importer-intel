
import { Router } from 'express';
import { ShipmentScraper } from './scraper.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

export default router;
