import express from 'express';
import {
  getAllContent,
  getContentBySection,
  updateContent,
  resetContent,
  bulkUpdateContent
} from '../controllers/content.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/:section', getContentBySection);
router.put('/:section', protect, adminOnly, updateContent);
router.post('/reset', protect, adminOnly, resetContent);
router.post('/bulk-update', protect, adminOnly, bulkUpdateContent);

export default router;
