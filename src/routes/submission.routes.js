import express from 'express';
import {
  createSubmission,
  getAllSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  deleteAllSubmissions
} from '../controllers/submission.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', submissionLimiter, createSubmission);
router.get('/', protect, adminOnly, getAllSubmissions);
router.get('/:id', protect, adminOnly, getSubmission);
router.put('/:id', protect, adminOnly, updateSubmission);
router.delete('/:id', protect, adminOnly, deleteSubmission);
router.delete('/', protect, adminOnly, deleteAllSubmissions);

export default router;
