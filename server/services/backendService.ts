import axios from 'axios';

// Points at the backend. In local dev this stays "/api" (Vite proxies to Express).
// In production (e.g. GitHub Pages), set VITE_API_URL at build time to your deployed
// backend URL, e.g. VITE_API_URL=https://your-backend.onrender.com/api
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

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
