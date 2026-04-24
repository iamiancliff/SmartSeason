// src/server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.ts';
import fieldRoutes from './routes/field.routes.ts';
import userRoutes from './routes/user.routes.ts';
import dashboardRoutes from './routes/dashboard.routes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again after 15 minutes.' },
});
app.use(limiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS allowed for: ${FRONTEND_URL}`);
});
