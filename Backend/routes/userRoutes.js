import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import {
  getAllStores,    
  getAllUsers,      
  updatePassword    
} from '../controllers/userController.js';

const router = express.Router();

router.get('/stores', verifyToken, checkRole(['user']), getAllStores);

router.put('/update-password', verifyToken, checkRole(['user']), updatePassword);

router.get('/list', verifyToken, checkRole(['admin']), getAllUsers);

export default router;
