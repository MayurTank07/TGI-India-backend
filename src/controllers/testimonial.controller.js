import Testimonial from '../models/Testimonial.model.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getAllTestimonials = async (req, res, next) => {
  try {
    const { category, isActive } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const testimonials = await Testimonial.find(filter).sort({ category: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    res.status(200).json({
      success: true,
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res, next) => {
  try {
    const { category, text, name, role, image, imagePublicId, order, isActive } = req.body;

    const testimonial = await Testimonial.create({
      category,
      text,
      name,
      role,
      image,
      imagePublicId,
      order,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    const { category, text, name, role, image, imagePublicId, order, isActive } = req.body;

    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    // If image is being updated and old one was on Cloudinary, delete it
    if (image && image !== testimonial.image && testimonial.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(testimonial.imagePublicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }

    testimonial.category = category || testimonial.category;
    testimonial.text = text || testimonial.text;
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.image = image || testimonial.image;
    testimonial.imagePublicId = imagePublicId !== undefined ? imagePublicId : testimonial.imagePublicId;
    testimonial.order = order !== undefined ? order : testimonial.order;
    testimonial.isActive = isActive !== undefined ? isActive : testimonial.isActive;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    // Delete image from Cloudinary if exists
    if (testimonial.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(testimonial.imagePublicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
