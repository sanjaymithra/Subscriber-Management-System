const rawApiUrl = import.meta.env.VITE_API_URL ?? '/api'
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '')

export const API_BASE_URL = normalizedApiUrl.endsWith('/v1') ? normalizedApiUrl : `${normalizedApiUrl}/v1`
