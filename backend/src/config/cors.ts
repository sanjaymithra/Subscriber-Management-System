import type { CorsOptions } from 'cors'
import { env } from './env.js'

const allowedOrigins = Array.from(
  new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    'https://subscriber-management-system.vercel.app',
    env.CLIENT_URL,
  ]),
)

export const corsOptions: CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}
