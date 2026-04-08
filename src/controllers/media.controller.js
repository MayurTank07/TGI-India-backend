import Media from '../models/Media.model.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/media/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tgi-recruitment',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save to database
    const media = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      uploadedBy: req.user._id,
      usedIn: req.body.usedIn || ''
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      media: {
        id: media._id,
        url: media.url,
        publicId: media.publicId,
        width: media.width,
        height: media.height
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image via URL
// @route   POST /api/media/upload-url
// @access  Private/Admin
export const uploadImageByUrl = async (req, res, next) => {
  try {
    const { url, usedIn } = req.body;

    if (!url) {
      return next(new AppError('Please provide image URL', 400));
    }

    // Upload to Cloudinary from URL
    const result = await cloudinary.uploader.upload(url, {
      folder: 'tgi-recruitment',
      resource_type: 'image',
    });

    // Save to database
    const media = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      uploadedBy: req.user._id,
      usedIn: usedIn || ''
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      media: {
        id: media._id,
        url: media.url,
        publicId: media.publicId,
        width: media.width,
        height: media.height
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media
// @route   GET /api/media
// @access  Private/Admin
export const getAllMedia = async (req, res, next) => {
  try {
    const { usedIn } = req.query;
    
    const filter = {};
    if (usedIn) filter.usedIn = usedIn;

    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'email');

    res.status(200).json({
      success: true,
      count: media.length,
      media
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single media
// @route   GET /api/media/:id
// @access  Private/Admin
export const getMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id).populate('uploadedBy', 'email');

    if (!media) {
      return next(new AppError('Media not found', 404));
    }

    res.status(200).json({
      success: true,
      media
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return next(new AppError('Media not found', 404));
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err);
    }

    // Delete from database
    await media.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update media metadata
// @route   PUT /api/media/:id
// @access  Private/Admin
export const updateMedia = async (req, res, next) => {
  try {
    const { usedIn } = req.body;

    const media = await Media.findById(req.params.id);

    if (!media) {
      return next(new AppError('Media not found', 404));
    }

    if (usedIn !== undefined) media.usedIn = usedIn;

    await media.save();

    res.status(200).json({
      success: true,
      message: 'Media updated successfully',
      media
    });
  } catch (error) {
    next(error);
  }
};
