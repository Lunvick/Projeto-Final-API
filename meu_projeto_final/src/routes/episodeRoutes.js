import { Router } from 'express';

import {
  createEpisode,
  getAllEpisodes,
  getEpisodeById,
  updateEpisode,
  deleteEpisode
} from '../controllers/episodeController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getAllEpisodes);

router.get('/:id', protect, getEpisodeById);

router.post('/', protect, createEpisode);

router.put('/:id', protect, updateEpisode);

router.delete('/:id', protect, deleteEpisode);

export default router;
