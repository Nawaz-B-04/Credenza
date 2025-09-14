import express from 'express';
import {
  storeLogin,
  storeRatingsStats,
  updateStorePassword,
} from '../controllers/storeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/store-login', storeLogin);
router.get('/ratings', verifyToken, checkRole(['store']), storeRatingsStats);
router.put('/update-password', verifyToken, checkRole(['store']), updateStorePassword);

export default router;
