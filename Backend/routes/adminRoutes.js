// routes/adminRoutes.js
import express from 'express';
import {
  createUserOrAdmin,
  createStore,
  getAllUsers,
  getAdminsOnly,
  getAllStoresWithStats,
  getSystemStats,
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/create-user', verifyToken, checkRole(['admin']), createUserOrAdmin);
// router.post('/create-user', createUserOrAdmin);
router.post('/create-store', verifyToken, checkRole(['admin']), createStore);
// router.post('/create-store', createStore);

router.get('/users', verifyToken, checkRole(['admin']), getAllUsers);
router.get('/admins', verifyToken, checkRole(['admin']), getAdminsOnly);
router.get('/stores', verifyToken, checkRole(['admin']), getAllStoresWithStats);
router.get('/stats', verifyToken, checkRole(['admin']), getSystemStats);

export default router;
 