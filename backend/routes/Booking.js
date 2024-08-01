import express from 'express';
import Ticket from '../models/Ticket.js';

const router = express.Router();

// Fetch bookings by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const bookings = await Ticket.find({ username });

    if (!bookings) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedBooking = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
