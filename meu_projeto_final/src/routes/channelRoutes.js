import { Router } from 'express';

import {
  createChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel
} from '../controllers/channelController.js'


import { protect } from '../middlewares/authMiddleware.js';

import {
  channelSchema,
  updateChannelSchema
} from '../schemas/channelSchema.js';

import { idParamsSchema } from '../schemas/paramsSchema.js';

const router = Router();

router.get('/', getAllChannels);

router.get('/:id', protect, getChannelById);

router.post('/', protect, createChannel);

router.put('/:id', protect, updateChannel);

router.delete('/:id', protect, deleteChannel);

export default router;
