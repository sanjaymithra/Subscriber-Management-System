import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(error),
)
