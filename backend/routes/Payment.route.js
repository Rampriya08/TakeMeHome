import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// Route to update payment status and method
router.post('/pay', async (req, res) => {
  const { ticketId, paymentMethod, paymentStatus } = req.body;

  try {
    // Find the ticket in the database by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update the payment details
    ticket.paymentMethod = paymentMethod;
    ticket.paymentStatus = paymentStatus;

    // Save the updated ticket back to the database
    const updatedTicket = await ticket.save();

    // Respond with the updated ticket details
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;