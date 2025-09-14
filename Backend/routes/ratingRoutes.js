import express from 'express';
import { rateStore } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/rate', verifyToken, checkRole(['user']), rateStore);

export default router;
