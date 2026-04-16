import axios from 'axios';
import type { ImporterSummary, DetailedImporterResult } from '../../types';

// Points at the backend. In local dev this stays "/api" (Vite proxies to Express).
// In production (e.g. GitHub Pages), set VITE_API_URL at build time to your deployed
// backend URL, e.g. VITE_API_URL=https://your-backend.onrender.com/api
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export const searchImportersApi = async (params: { 
  query: string; 
  city: string; 
  state: string; 
  industry: string; 
}): Promise<ImporterSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/search-importers`, {
      params: {
        query: params.query,
        city: params.city,
        state: params.state,
        industry: params.industry
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Search importers API error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch search results. Please try again.');
  }
};

export const fetchDetailedImporterDataApi = async (importerName: string, context?: ImporterSummary): Promise<DetailedImporterResult> => {
  try {
    const response = await axios.get(`${API_URL}/importer-details`, {
      params: {
        name: importerName,
        location: context?.location,
        primaryCommodities: context?.primaryCommodities,
        lastShipmentDate: context?.lastShipmentDate
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Fetch detailed importer data API error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch detailed importer data.');
  }
};

export const searchSimilarImportersApi = async (query: string): Promise<ImporterSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/similar-importers`, {
      params: { query }
    });
    return response.data;
  } catch (error: any) {
    console.error('Search similar importers API error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch similar importers.');
  }
};
