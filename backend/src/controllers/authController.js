const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Password validation
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Create user
      const user = await User.create(email, password, name);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: user.toPublic(),
        token
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        res.status(400).json({ error: 'Email already registered' });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.json({
        message: 'Login successful',
        user: user.toPublic(),
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: user.toPublic() });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user
      user.update({ name });

      res.json({
        message: 'Profile updated successfully',
        user: user.toPublic()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
};

module.exports = authController;
