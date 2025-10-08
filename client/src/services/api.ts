import axios from 'axios';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export const api = axios.create({
  baseURL: COINGECKO_API_BASE,
  headers: {
    'Accept': 'application/json',
  }
});
