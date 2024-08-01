import express from 'express';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Fetch bookings by username
router.post('/:id',async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, gender } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      user.username = username || user.username;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      if (password) {
        user.password = await bcryptjs.hash(password, 10);
      }
  
      const updatedUser = await user.save();
  
      return res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        gender: updatedUser.gender,
      });
    } catch (error) {
      console.log("Error in updateUser Controller", error.message);
      res.status(500).json({ error: `Internal Server Error ${error}` });
    }
  });
  router.get('/get/:id',async (req, res) => {
    try {
        const { id } = req.params;
    
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    console.log(user)
        
    
        // Respond with the amount from the ticket
        res.json(user);
      } catch (error) {
        console.error('Error retrieving ticket:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

  
export default router
  