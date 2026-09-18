import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AdminActivity from '../models/AdminActivity.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gangster_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const addresses = address ? [{
      street: address.street || '',
      city: address.city || '',
      state: address.state || 'Maharashtra',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      isDefault: true
    }] : [];

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer',
      addresses
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Customer login
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        adminAlias: user.adminAlias,
        addresses: user.addresses,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Login (Shoeb Khan / Shan Khan)
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password, adminAlias } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const effectiveAdminName = adminAlias || user.adminAlias || user.name;

    // Log admin login activity
    await AdminActivity.create({
      adminName: effectiveAdminName,
      adminEmail: user.email,
      action: 'ADMIN_LOGIN',
      entityType: 'AUTH',
      details: `${effectiveAdminName} logged into Admin Management Console`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: `Admin access granted. Welcome, ${effectiveAdminName}!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        adminAlias: effectiveAdminName,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        adminAlias: user.adminAlias,
        addresses: user.addresses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile & addresses
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.body.address) {
      const { street, city, state, pincode, landmark } = req.body.address;
      if (user.addresses && user.addresses.length > 0) {
        user.addresses[0] = {
          street: street || user.addresses[0].street,
          city: city || user.addresses[0].city,
          state: state || user.addresses[0].state,
          pincode: pincode || user.addresses[0].pincode,
          landmark: landmark || user.addresses[0].landmark,
          isDefault: true
        };
      } else {
        user.addresses.push({
          street, city, state: state || 'Maharashtra', pincode, landmark, isDefault: true
        });
      }
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
