import express from 'express';
import {
  getAllContent,
  getContentBySection,
  updateContent,
  resetContent,
  bulkUpdateContent
} from '../controllers/content.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { cacheControl } from '../middleware/cache.js';

const router = express.Router();

// Public routes with caching (5 minutes)
router.get('/', cacheControl(300), getAllContent);
router.get('/:section', cacheControl(300), getContentBySection);
router.put('/:section', protect, adminOnly, updateContent);
router.post('/reset', protect, adminOnly, resetContent);
router.post('/bulk-update', protect, adminOnly, bulkUpdateContent);

export default router;
