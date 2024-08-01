import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  date: { type: Date, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  timing: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  mode: { type: String, required: true },
  tclass: { type: String },
  seatPreference: { type: String },
  flightClass: { type: String },
  passportNumber: { type: String },
  mealPreference: { type: String }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
