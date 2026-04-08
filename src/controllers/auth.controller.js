import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { AppError } from '../middleware/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      valid: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide current and new password', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - send OTP to admin email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Please provide an email address', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('No account found with that email', 404));
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before storing
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Save hashed OTP and expiry (10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send OTP via email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #7A1CC2; margin-bottom: 16px;">Password Reset OTP</h2>
        <p style="color: #333; font-size: 15px;">You requested a password reset for the TG India Admin Panel.</p>
        <div style="background: #f3e8ff; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #666; font-size: 13px;">Your verification code is:</p>
          <h1 style="color: #7A1CC2; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 13px;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || email,
        subject: 'TG India Admin - Password Reset OTP',
        html
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to registered email'
      });
    } catch (emailError) {
      // Clear OTP if email fails
      user.resetOtp = undefined;
      user.resetOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error('Email send error:', emailError);
      return next(new AppError('Failed to send email. Please try again later.', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError('Please provide email and OTP', 400));
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() }
    }).select('+resetOtp +resetOtpExpire');

    if (!user) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    // Generate a short-lived reset token (5 min)
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Clear the OTP
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public (with resetToken)
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return next(new AppError('Please provide reset token and new password', 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return next(new AppError('Invalid or expired reset token. Please restart the process.', 400));
    }

    if (decoded.purpose !== 'password-reset') {
      return next(new AppError('Invalid reset token', 400));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};
