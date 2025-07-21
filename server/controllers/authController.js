//server/controllers/authController.js

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { useInvite } from './inviteController.js';

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser && adminUser.role !== 'admin') {
      // If admin exists but role is not admin, update it
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Admin role updated');
    } else if (!adminUser) {
      // Create new admin if doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      await User.create({
        name: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error managing admin user:', error);
  }
};

// Call this when the server starts
createDefaultAdmin();

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    console.log('Register endpoint hit:', req.body);

    const { name, email, password, role, inviteCode } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration not allowed' });
    }

    let userRole = 'citizen';
    if (role === 'officer') {
      if (!inviteCode) {
        return res.status(403).json({ message: 'Officers require an invitation code' });
      }
      // Validate invite code
      const inviteResult = await useInvite(inviteCode, email, null); // null for userId, will update after user is created
      if (!inviteResult.valid) {
        return res.status(403).json({ message: inviteResult.message });
      }
      userRole = 'officer';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      role: userRole
    });

    // If officer, update invite with userId
    if (userRole === 'officer' && inviteCode) {
      await useInvite(inviteCode, email, user._id);
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User role:', user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
