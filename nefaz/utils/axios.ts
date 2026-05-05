import axios from 'axios';


export const sefazApi = axios.create({
  
  baseURL: process.env.EXPO_PUBLIC_URL_API_SEFAZ,
  timeout: 10000,
  headers: {
    'Content-Type': 'text/html',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  },
});


sefazApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API da SEFAZ:', error.message);

    return Promise.reject(error);
  }
);