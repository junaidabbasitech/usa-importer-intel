
import axios from "axios";
import * as cheerio from "cheerio";

export interface RawLead {
  importer: string;
  cnee?: string;
  commodity?: string;
  hsCode?: string;
  origin?: string;
  destination?: string;
  lastShipmentDate?: string;
  weight?: string;
  containerCount?: string;
  source: string;
  url?: string;
}

export class ShipmentScraper {
  
  static async scrapePortExaminer(query: string): Promise<RawLead[]> {
    const url = `https://portexaminer.com/search.php?search-field-1=consignee&search-term-1=${encodeURIComponent(query)}`;
    // In a real backend, we could use puppeteer or axios if not blocked
    return []; 
  }

  static async scrapeImportYeti(query: string): Promise<RawLead[]> {
    const url = `https://www.importyeti.com/search?q=${encodeURIComponent(query)}`;
    const leads: RawLead[] = [];
    try {
      const resp = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(resp.data);
      $(".company-result").each((i, el) => {
        leads.push({
          importer: $(el).find(".company-name").text().trim(),
          commodity: $(el).find(".product-list").text().trim(),
          source: "ImportYeti",
          url
        });
      });
    } catch (e) {
        console.warn("ImportYeti scrape failed:", e);
    }
    return leads;
  }

  static async scrapeAlibabaBuyers(keyword: string): Promise<RawLead[]> {
    const url = `https://www.alibaba.com/trade/search?keywords=${encodeURIComponent(keyword)}`;
    const leads: RawLead[] = [];
    try {
        const resp = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(resp.data);
        $(".supplier-card").each((i, el) => {
            leads.push({
                importer: $(el).find(".supplier-name").text().trim(),
                commodity: keyword,
                source: "Alibaba Buyers",
                url
            });
        });
    } catch (e) {
        console.warn("Alibaba scrape failed:", e);
    }
    return leads;
  }
}
