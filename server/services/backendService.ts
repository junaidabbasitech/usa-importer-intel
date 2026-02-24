import axios from 'axios';

// Use relative path, works in production
const API_URL = ""; // <- relative, no localhost

export const scrapeTraditionalSources = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/scrape`, {
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
    const response = await axios.get(`${API_URL}/api/health`);
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'error' };
  }
};