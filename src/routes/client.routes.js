import express from 'express';
import {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllClients);
router.get('/:id', getClient);
router.post('/', protect, adminOnly, createClient);
router.put('/:id', protect, adminOnly, updateClient);
router.delete('/:id', protect, adminOnly, deleteClient);

export default router;
