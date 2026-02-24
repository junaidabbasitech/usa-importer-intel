import axios from 'axios';

const API_URL = process.env.VITE_API_URL || ""; // <- relative path works in production

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