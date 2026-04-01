import express from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import gradeRoutes from './gradeRoutes.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'GES API v1.0' }));

router.use('/auth', authRoutes);

// VULNERABILITY 3: Access control mis-enforcement by URL pattern.
// The developer protected /api/admin/* with verifyToken, thinking that was enough.
// But /api/students/* and /api/grades/* are completely open — no auth required.
// Red team can read and modify ALL student data without ever logging in.
router.use('/admin', verifyToken, (req, res) => {
  res.json({ message: 'Zone admin', user: req.user });
});

router.use('/students', studentRoutes);
router.use('/grades', gradeRoutes);

export default router;
