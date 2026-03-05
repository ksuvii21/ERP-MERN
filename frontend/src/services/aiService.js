import axios from 'axios';

// Assuming the Python FastAPI service runs on port 8000
const AI_API_URL = 'http://localhost:8000';

const aiApi = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictSales = async (salesHistory) => {
  const response = await aiApi.post('/predict/sales', { history: salesHistory });
  return response.data;
};

export const predictAttrition = async (employeeData) => {
  const response = await aiApi.post('/predict/attrition', employeeData);
  return response.data;
};

export const detectAnomalies = async (transactions) => {
  const response = await aiApi.post('/analyze/anomalies', transactions);
  return response.data;
};

export default aiApi;