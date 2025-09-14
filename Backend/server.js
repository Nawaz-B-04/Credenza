// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);           // /api/register, /api/login
app.use('/api/admin', adminRoutes);    // /api/admin/*
app.use('/api/store', storeRoutes);    // /api/store/store-login, etc.
app.use('/api', ratingRoutes);         // /api/rate
app.use('/api/users', userRoutes);        

// Root check
app.get('/', (req, res) => {
  res.send('Store Rating Backend API is running ✅');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
 