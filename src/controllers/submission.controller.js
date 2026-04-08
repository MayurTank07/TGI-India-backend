import Submission from '../models/Submission.model.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Create new submission
// @route   POST /api/submissions
// @access  Public
export const createSubmission = async (req, res, next) => {
  try {
    const { source, firstName, lastName, email, phone, category, city, message } = req.body;

    const submission = await Submission.create({
      source,
      firstName,
      lastName,
      email,
      phone,
      category,
      city,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
export const getAllSubmissions = async (req, res, next) => {
  try {
    const { source, status } = req.query;

    const filter = {};
    if (source && source !== 'All Sources') filter.source = source;
    if (status) filter.status = status;

    const submissions = await Submission.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private/Admin
export const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(new AppError('Submission not found', 404));
    }

    // Mark as read if unread
    if (submission.status === 'unread') {
      submission.status = 'read';
      submission.readAt = new Date();
      await submission.save();
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id
// @access  Private/Admin
export const updateSubmission = async (req, res, next) => {
  try {
    const { status } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(new AppError('Submission not found', 404));
    }

    if (status) {
      submission.status = status;
      if (status === 'read' && !submission.readAt) {
        submission.readAt = new Date();
      }
    }

    await submission.save();

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(new AppError('Submission not found', 404));
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all submissions
// @route   DELETE /api/submissions
// @access  Private/Admin
export const deleteAllSubmissions = async (req, res, next) => {
  try {
    await Submission.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All submissions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
