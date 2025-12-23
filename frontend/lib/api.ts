import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function apiGet(url: string) {
  const res = await api.get(url);
  return res.data;
}

export async function apiPost(url: string, data: any) {
  const res = await api.post(url, data);
  return res.data;
}
