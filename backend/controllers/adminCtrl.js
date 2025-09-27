// backend/controllers/adminCtrl.js

const User = require('../models/User');

// List all users in the system
exports.listUsers = async (req, res) => {
  try {
    // Find all users and send back non-sensitive information
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error('Error listing users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle the verification status of a user
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the boolean 'isVerified' field
    user.isVerified = !user.isVerified;
    await user.save();

    // Send back the updated user data (without the password hash)
    const { passwordHash, ...updatedUser } = user.toObject();
    res.json(updatedUser);
    
  } catch (err) {
    console.error('Error verifying user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};