import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

router.post('/busBook', async (req, res) => {
  try {
    const { username, name, age, gender, date, source, destination, timing, amount, paymentMethod, paymentStatus,mode } = req.body;
    
    // Validate request data
    if (!username || !name || !age || !gender || !date || !source || !destination || !timing || !amount || !paymentMethod || !paymentStatus) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // Create new bus ticket instance
    const newTicket = new Ticket({
      username,
      name,
      age,
      gender,
      date,
      source,
      destination,
      timing,
      amount,
      paymentMethod,
      paymentStatus,
      mode
    });

    // Save to database
    const savedTicket = await newTicket.save();
    
    // Respond with the saved ticket details
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/trainBook', async (req, res) => {
  try {
    const { username, name, age, gender, date, source, destination, timing, tclass, seatPreference, amount, paymentMethod, paymentStatus, mode } = req.body;
    
    // Validate request data
    if (!username || !name || !age || !gender || !date || !source || !destination || !timing || !tclass || !seatPreference || !amount || !paymentMethod || !paymentStatus) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // Create new train ticket instance
    const newTicket = new Ticket({
      username,
      name,
      age,
      gender,
      date,
      source,
      destination,
      timing,
      tclass,
      seatPreference,
      amount,
      paymentMethod,
      paymentStatus,
      mode
    });

    // Save to database
    const savedTicket = await newTicket.save();
    
    // Respond with the saved ticket details
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error booking train ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/plainBook', async (req, res) => {
  try {
    const { username, name, age, gender, date, source, destination, timing, flightClass, passportNumber, mealPreference, amount, paymentMethod, paymentStatus, mode } = req.body;
    
    // Validate request data
    if (!username || !name || !age || !gender || !date || !source || !destination || !timing || !flightClass || !passportNumber || !mealPreference || !amount || !paymentMethod || !paymentStatus) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // Create new plane ticket instance
    const newTicket = new Ticket({
      username,
      name,
      age,
      gender,
      date,
      source,
      destination,
      timing,
      flightClass,
      passportNumber,
      mealPreference,
      amount,
      paymentMethod,
      paymentStatus,
      mode
    });

    // Save to database
    const savedTicket = await newTicket.save();
    
    // Respond with the saved ticket details
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error booking plane ticket:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;

