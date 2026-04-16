import express from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import gradeRoutes from './gradeRoutes.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'GES API v1.0' }));

router.use('/auth', authRoutes);

// FIX 3: Auth required on ALL data routes — addresses Red Team finding #3 (PII exposure)
// Previously only /api/admin was protected; now every sensitive route requires a valid JWT.
router.use('/students', verifyToken, studentRoutes);
router.use('/grades',   verifyToken, gradeRoutes);

export default router;
