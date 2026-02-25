import axios from 'axios';
import type { ImporterSummary, DetailedImporterResult } from '../../types';

// Use the VITE_API_URL for production, or empty string for relative paths in dev
const API_URL = import.meta.env.VITE_API_URL || '';

export const searchImportersApi = async (params: { 
  query: string; 
  city: string; 
  state: string; 
  industry: string; 
}): Promise<ImporterSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/search-importers`, {
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
    const response = await axios.get(`${API_URL}/api/importer-details`, {
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
    const response = await axios.get(`${API_URL}/api/similar-importers`, {
      params: { query }
    });
    return response.data;
  } catch (error: any) {
    console.error('Search similar importers API error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch similar importers.');
  }
};
