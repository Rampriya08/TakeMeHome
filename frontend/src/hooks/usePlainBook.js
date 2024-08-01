import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import useConversation from "../zustand/getTicket";

const usePlainBook = () => {
  const [loading, setLoading] = useState(false);
  const setAmountT = useConversation((state) => state.setAmountT);
  const setTicketId = useConversation((state) => state.setTicketId);
  const amountT = useConversation((state) => state.amountT);
  const TicketId = useConversation((state) => state.TicketId);

  const plainBook = async (formData) => {
    const { username, name, age, gender, date, source, destination, timing, flightClass, passportNumber, mealPreference, amount, paymentMethod, paymentStatus, mode } = formData;

    // Update amountT state
    setAmountT(amount);

    // Validate form data
    const success = handleInputErrors({ username, name, age, gender, date, source, destination, timing, flightClass, passportNumber, mealPreference, amount });
    if (!success) return;

    // Start loading state
    setLoading(true);

    try {
      // Send a POST request to book plane ticket
      const res = await fetch("http://localhost:8000/api/Tickets/plainBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, age, gender, date, source, destination, timing, flightClass, passportNumber, mealPreference, amount, paymentMethod, paymentStatus, mode }),
      });

      // Check if request was successful
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Parse response JSON
      const data = await res.json();

      // Check for errors in response
      if (data.error) {
        throw new Error(data.error);
      }

      // Update TicketId state with returned _id
      setTicketId(data._id);

      // Store booked ticket data in localStorage
      localStorage.setItem("Ticket", JSON.stringify(data));
      console.log("Booking successful");
    } catch (error) {
      // Handle booking errors
      console.error("Error during plane booking:", error);
      toast.error("Failed to book plane ticket. Please try again.");
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Log amountT on component mount or update
  useEffect(() => {
    console.log("AmountT updated to:", amountT);
  }, [amountT]);

  // Log TicketId on component mount or update
  useEffect(() => {
    console.log("TicketId updated to:", TicketId);
  }, [TicketId]);

  // Return loading state, plainBook function, amountT state, and TicketId state
  return { loading, plainBook, amountT, TicketId };
};

export default usePlainBook;

// Function to validate input errors
function handleInputErrors({ username, name, age, gender, date, source, destination, timing, flightClass, passportNumber, mealPreference, amount }) {
  if (!username || !name || !age || !gender || !date || !source || !destination || !timing || !flightClass || !passportNumber || !mealPreference || !amount) {
    toast.error("Please fill all the fields");
    return false;
  }
  return true;
}
