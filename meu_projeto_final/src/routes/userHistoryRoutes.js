import { Router } from 'express';

import {
  createUserHistory,
  getAllUserHistories,
  getUserHistoryById,
  updateUserHistory,
  deleteUserHistory
} from '../controllers/userHistoryController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', protect, getAllUserHistories);

router.get('/:id', protect, getUserHistoryById);

router.post('/', protect, createUserHistory);

router.put('/:id', protect, updateUserHistory);

router.delete('/:id', protect, deleteUserHistory);

export default router;
