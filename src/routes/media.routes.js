import express from 'express';
import {
  uploadImage,
  uploadImageByUrl,
  getAllMedia,
  getMedia,
  deleteMedia,
  updateMedia
} from '../controllers/media.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, adminOnly, upload.single('image'), uploadImage);
router.post('/upload-url', protect, adminOnly, uploadImageByUrl);
router.get('/', protect, adminOnly, getAllMedia);
router.get('/:id', protect, adminOnly, getMedia);
router.put('/:id', protect, adminOnly, updateMedia);
router.delete('/:id', protect, adminOnly, deleteMedia);

export default router;
