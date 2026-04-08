import Team from '../models/Team.model.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getAllTeamMembers = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const team = await Team.find(filter).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: team.length,
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return next(new AppError('Team member not found', 404));
    }

    res.status(200).json({
      success: true,
      member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, image, imagePublicId, linkedin, twitter, order, isActive } = req.body;

    const member = await Team.create({
      name,
      role,
      image,
      imagePublicId,
      linkedin,
      twitter,
      order,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, role, image, imagePublicId, linkedin, twitter, order, isActive } = req.body;

    let member = await Team.findById(req.params.id);

    if (!member) {
      return next(new AppError('Team member not found', 404));
    }

    // If image is being updated and old one was on Cloudinary, delete it
    if (image && image !== member.image && member.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(member.imagePublicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }

    member.name = name || member.name;
    member.role = role || member.role;
    member.image = image || member.image;
    member.imagePublicId = imagePublicId !== undefined ? imagePublicId : member.imagePublicId;
    member.linkedin = linkedin || member.linkedin;
    member.twitter = twitter || member.twitter;
    member.order = order !== undefined ? order : member.order;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return next(new AppError('Team member not found', 404));
    }

    // Delete image from Cloudinary if exists
    if (member.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(member.imagePublicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
