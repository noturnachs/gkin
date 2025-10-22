const db = require('../config/db');

/**
 * Get user profile information
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT id, username, role, email, avatar_url, created_at, last_active FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * Update user profile information
 * @param {Request} req - Express request object  
 * @param {Response} res - Express response object
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, username } = req.body;
    
    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (username && username.trim()) {
      updates.push(`username = $${paramCount}`);
      values.push(username.trim());
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    
    // Add user ID as last parameter
    values.push(userId);
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}, last_active = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING id, username, role, email, avatar_url, created_at, last_active
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle unique constraint violations
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};