import Client from '../models/Client.model.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
export const getAllClients = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const clients = await Client.find(filter).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    res.status(200).json({
      success: true,
      client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create client
// @route   POST /api/clients
// @access  Private/Admin
export const createClient = async (req, res, next) => {
  try {
    const { name, logo, logoPublicId, order, isActive } = req.body;

    const client = await Client.create({
      name,
      logo,
      logoPublicId,
      order,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
export const updateClient = async (req, res, next) => {
  try {
    const { name, logo, logoPublicId, order, isActive } = req.body;

    let client = await Client.findById(req.params.id);

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    // If logo is being updated and old one was on Cloudinary, delete it
    if (logo && logo !== client.logo && client.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(client.logoPublicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }

    client.name = name || client.name;
    client.logo = logo || client.logo;
    client.logoPublicId = logoPublicId !== undefined ? logoPublicId : client.logoPublicId;
    client.order = order !== undefined ? order : client.order;
    client.isActive = isActive !== undefined ? isActive : client.isActive;

    await client.save();

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return next(new AppError('Client not found', 404));
    }

    // Delete image from Cloudinary if exists
    if (client.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(client.logoPublicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
