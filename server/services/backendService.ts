import axios from 'axios';

// Use the VITE_API_URL for production, or empty string for relative paths in dev
const API_URL = "/api";

export const scrapeTraditionalSources = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/scrape`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Backend scrape error:', error);
    throw error;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'error' };
  }
};
