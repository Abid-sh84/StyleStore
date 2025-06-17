import User from '../models/userModel.js';
import { MockUserModel } from '../utils/mockUserService.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';

// Helper function to determine if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1; // 1 means connected
};

// Helper function to get the appropriate User model
const getUserModel = () => {
  if (isMongoConnected()) {
    console.log('Using MongoDB User model');
    return User;
  } else {
    console.log('Using Mock User model (MongoDB not connected)');
    return MockUserModel;
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const UserModel = getUserModel();

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword?.(password))) {
      // Generate JWT token
      generateToken(res, user._id);

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password } = req.body;
    const UserModel = getUserModel();

    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    try {
      // Check if user already exists
      const userExists = await UserModel.findOne({ email });

      if (userExists) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      console.log('Attempting to create user');
      const user = await UserModel.create({
        name,
        email,
        password,
      });

      if (user) {
        console.log('User created successfully:', user._id);
        // Generate JWT token
        generateToken(res, user._id);

        return res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false,
          },
        });
      } else {
        console.log('Failed to create user, returned null');
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (dbError) {
      console.error('Database error during registration:', dbError);
      return res.status(500).json({ message: `Database error: ${dbError.message}` });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.address) {
        user.address = req.body.address;
      }
      
      if (req.body.phone) {
        user.phone = req.body.phone;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          address: updatedUser.address,
          phone: updatedUser.phone,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const users = await UserModel.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
    
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address
      };
    }
    
    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address,
      phone: updatedUser.phone,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};