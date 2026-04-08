import Content from '../models/Content.model.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all content
// @route   GET /api/content
// @access  Public
export const getAllContent = async (req, res, next) => {
  try {
    const contents = await Content.find();

    // Transform to match frontend structure
    const contentObj = {};
    contents.forEach(item => {
      const keys = item.section.split('.');
      if (keys.length === 1) {
        contentObj[keys[0]] = item.data;
      } else {
        if (!contentObj[keys[0]]) contentObj[keys[0]] = {};
        contentObj[keys[0]][keys[1]] = item.data;
      }
    });

    res.status(200).json({
      success: true,
      content: contentObj
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content by section
// @route   GET /api/content/:section
// @access  Public
export const getContentBySection = async (req, res, next) => {
  try {
    const content = await Content.findOne({ section: req.params.section });

    if (!content) {
      return next(new AppError('Content section not found', 404));
    }

    res.status(200).json({
      success: true,
      content: content.data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content section
// @route   PUT /api/content/:section
// @access  Private/Admin
export const updateContent = async (req, res, next) => {
  try {
    const { section } = req.params;
    const { data } = req.body;

    if (!data) {
      return next(new AppError('Please provide content data', 400));
    }

    let content = await Content.findOne({ section });

    if (content) {
      // Update existing
      content.data = data;
      content.version += 1;
      content.updatedBy = req.user._id;
      await content.save();
    } else {
      // Create new
      content = await Content.create({
        section,
        data,
        updatedBy: req.user._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      content: content.data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset content to defaults
// @route   POST /api/content/reset
// @access  Private/Admin
export const resetContent = async (req, res, next) => {
  try {
    // Delete all content
    await Content.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'Content reset to defaults. Frontend will use default values.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update content
// @route   POST /api/content/bulk-update
// @access  Private/Admin
export const bulkUpdateContent = async (req, res, next) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return next(new AppError('Please provide updates array', 400));
    }

    const promises = updates.map(async ({ section, data }) => {
      let content = await Content.findOne({ section });
      
      if (content) {
        content.data = data;
        content.version += 1;
        content.updatedBy = req.user._id;
        return content.save();
      } else {
        return Content.create({
          section,
          data,
          updatedBy: req.user._id
        });
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: 'Content updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
