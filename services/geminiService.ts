
import { GoogleGenAI } from "@google/genai";
import type { ImporterSummary, DetailedImporterResult, Source } from '../types';

/**
 * Clean JSON string from model response for parsing.
 */
const cleanJsonString = (text: string): string => {
    let jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    } else {
        return "{}";
    }
    return jsonText;
};

/**
 * Extract grounding URLs and titles from the API response candidate.
 */
const extractSources = (response: any): Source[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      uri: chunk.web.uri,
      title: chunk.web.title || chunk.web.uri
    }));
};

/**
 * Resilient wrapper for API operations with backoff.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3, initialDelay: number = 1000): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error: any) {
            attempt++;
            if (attempt >= maxRetries) throw error;
            const delay = initialDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Max attempts exceeded.");
}

export const searchImporters = async (params: { query: string; city: string; state: string; industry: string; }): Promise<ImporterSummary[]> => {
  const { query, city, state, industry } = params;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toISOString().split('T')[0];

  try {
      const aiSearchPrompt = `
      TODAY'S DATE: ${today}
      Act as a high-precision Trade Intelligence Scraper. 
      SCRAPE & ANALYZE the absolute latest manifest records (strictly 2024-2025) for: "${query}" ${city ? `in ${city}` : ''} ${state ? `, ${state}` : ''} ${industry ? `Sector: ${industry}` : ''}.
      
      MANDATORY SOURCES:
      1. https://www.importyeti.com/
      2. usatradeonline.census.gov
      3. dataweb.usitc.gov
      4. portexaminer.com
      
      CRITICAL INSTRUCTION:
      - If you find entities with identical spelling but DIFFERENT CASING (e.g., "APPLE INC" vs "apple inc"), treat them as distinct entries if they appear as separate records.
      - RANK 1: Entities that EXACTLY match "${query}" (case-insensitive).
      - RANK 2: Entities whose names include "${query}".
      - RANK 3: Related trade sector players.
      
      Return a JSON array where entities matching "${query}" come FIRST.
      `;

      const aiSearchResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: aiSearchPrompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
      });

      const sources = extractSources(aiSearchResponse);

      const cleaningPrompt = `
      Extract the Consignee (CNEE) entities from the following text into a valid JSON structure.
      Structure: { "importers": [ { "importerName": "Name", "location": "City, State", "primaryCommodities": "...", "lastShipmentDate": "YYYY-MM-DD", "source": "Source" } ] }
      
      IMPORTANT: KEEP case-distinct duplicates if they represent different registry profiles.
      Sorting: Exact/Partial matches for "${query}" MUST be at the top.
      Data: ${aiSearchResponse.text}
      `;

      const finalResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: cleaningPrompt,
      });

      const parsed = JSON.parse(cleanJsonString(finalResponse.text));
      return (parsed.importers || []).map((imp: any) => ({
        ...imp,
        sources
      }));
  } catch (error: any) {
      console.error("Error in searchImporters:", error);
      return [];
  }
};

export const fetchDetailedImporterData = async (importerName: string, context?: ImporterSummary): Promise<DetailedImporterResult> => {
  const today = new Date().toISOString().split('T')[0];
  
  const fetchTask = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `TODAY'S DATE: ${today}.
    Act as a Master Trade Auditor. Exhaustively SCRAPE data for: '${importerName}' from https://www.importyeti.com/ and CBP logs.
    
    REQUIRED OUTPUT DETAIL:
    - MINIMUM 20 manifest records for 2024-2025.
    - EVERY record MUST have Carrier, Container ID, HS Code, and BOL.
    - Detailed sections for Risk, Trends, Suppliers, and Global Partners.
    
    JSON SCHEMA (STRICT):
    {
      "importerName": "${importerName}",
      "location": "...",
      "lastShipmentDate": "YYYY-MM-DD",
      "information": "Comprehensive audit summary.",
      "insights": ["Vector 1", "Vector 2", "Vector 3"],
      "shipmentCounts": { "lastMonth": 45, "lastQuarter": 120, "lastYear": 540 },
      "shipmentHistory": [ 
        { 
          "date": "2025-XX-XX", 
          "shipper": "Shipper", 
          "origin": "Country", 
          "portOfDischarge": "Port", 
          "commodity": "Description", 
          "volume": "XX TEUs", 
          "carrier": "Carrier", 
          "bolNumber": "BOL...", 
          "hsCode": "HS...", 
          "containerNumber": "CNTR..." 
        } 
      ],
      "shipmentVolumeHistory": [ { "year": 2025, "volume": 140 }, { "year": 2024, "volume": 520 } ],
      "topTradePartners": [ { "country": "Country", "tradeVolume": "XX%", "insights": "..." } ],
      "topCommodityFlows": [ { "name": "Item", "percentage": "+X%", "averagePrice": "$X", "marketTrend": "UP" } ],
      "topSuppliers": [ { "name": "...", "location": "...", "product": "...", "otherCompanies": ["A", "B"] } ],
      "contact": { "phone": "...", "email": "...", "website": "...", "address": "..." },
      "riskAssessment": { "financialStability": "Stable", "regulatoryCompliance": "High", "geopoliticalRisk": "Low" }
    }`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });

    const jsonText = cleanJsonString(response.text || "{}");
    const parsedData = JSON.parse(jsonText);
    
    return {
      parsedData: {
        ...parsedData,
        sources: extractSources(response)
      }
    };
  };

  try {
    return await withRetry(fetchTask);
  } catch (error: any) {
    throw new Error("Audit failed: " + error.message);
  }
};

export const searchSimilarImporters = async (query: string): Promise<ImporterSummary[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const prompt = `CURRENT DATE: ${today}. Find competitors for: "${query}". Return JSON: { "importers": [ { "importerName": "Name", "location": "...", "primaryCommodities": "...", "lastShipmentDate": "..." } ] }`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
    });
    const parsed = JSON.parse(cleanJsonString(response.text));
    return (parsed.importers || []).map((imp: any) => ({ ...imp }));
  } catch (error) {
    return [];
  }
};
