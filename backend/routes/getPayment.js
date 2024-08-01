import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();// Adjust this to your Ticket model

router.get('/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Find the ticket in the database by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Respond with the amount from the ticket
    res.json({ amount: ticket.amount });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;

