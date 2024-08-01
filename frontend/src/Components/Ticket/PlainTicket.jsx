import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useConversation from '../../zustand/getTicket';
import usePlainBook from '../../hooks/usePlainBook';

const BookPlaneTicketPage = () => {
  const location = useLocation();
  const { source, destination, distance } = location.state || {};
  const { plainBook } = usePlainBook();
  const TicketId = useConversation((state) => state.TicketId);
  const setTicketId = useConversation((state) => state.setTicketId);
  const today = new Date();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    age: '',
    gender: '',
    date: '',
    source: source || '',
    destination: destination || '',
    timing: '',
    amount: (distance / 1000) * 10, // Default amount calculation
    paymentMethod: 'credit card',
    paymentStatus: 'Pending',
    flightClass: 'Economy',
    passportNumber: '',
    mealPreference: 'None',
    mode: 'Plane'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("TakeMeHome");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const username = parsedData.username;
      console.log("Username:", username);
      setFormData((prevFormData) => ({ ...prevFormData, username }));
    } else {
      console.log("No data found in local storage.");
    }
  }, []);

  useEffect(() => {
    if (TicketId) {
      // Wait for 10 seconds before navigating to payment page
      const timer = setTimeout(() => {
        navigate(`/payment/${TicketId}`);
      }, 5000);

      // Clear the timer if the component unmounts before the timeout
      return () => clearTimeout(timer);
    }
  }, [TicketId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    
    // Update amount based on flightClass
    let newAmount = formData.amount;
    if (name === 'flightClass') {
      switch (value) {
        case 'Economy':
          newAmount = (distance / 1000) * 10;
          break;
        case 'Business':
          newAmount = (distance / 1000) * 20;
          break;
        case 'First Class':
          newAmount = (distance / 1000) * 30;
          break;
        default:
          newAmount = (distance / 1000) * 10; // Default value
      }
    }

    setFormData({ ...formData, [name]: value, amount: newAmount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);
    
    if (selectedDate < today) {
      toast.error('Please select a future date.');
      return; // Stop form submission if the date is invalid
    }
    try {
      // Start plane booking process
      await toast.promise(
        plainBook(formData),
        {
          loading: 'Booking...',
          success: <b>Booked Successfully!</b>,
          error: <b>Could not save.</b>,
        },
        {
          success: {
            className: 'bg-green-500 text-white',
          },
          error: {
            className: 'bg-red-500 text-white',
          },
        }
      );

      // Get TicketId from local storage or response
      const storedTicket = localStorage.getItem("Ticket");
      if (storedTicket) {
        const parsedTicket = JSON.parse(storedTicket);
        setTicketId(parsedTicket._id);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to book plane ticket. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-4xl opacity-90">
        <h2 className="text-white text-2xl mb-6">Book Plane Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-white">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Gender:</label>
            <div className="flex mt-1">
              <label className="text-white mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="text-white mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-white">Source:</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today} // Set the minimum date to today
              required
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Timing:</label>
            <select
              name="timing"
              value={formData.timing}
              onChange={handleChange}
              required
              className="mt-1 p-2 rounded border border-gray-300"
            >
              <option value="">Select a time</option>
              <option value="6:00 AM">6:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="6:00 PM">6:00 PM</option>
              <option value="12:00 AM">12:00 AM</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white">Class:</label>
            <select
              name="flightClass"
              value={formData.flightClass}
              onChange={handleChange}
              required
              className="mt-1 p-2 rounded border border-gray-300"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white">Passport Number:</label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
              required
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Meal Preference:</label>
            <select
              name="mealPreference"
              value={formData.mealPreference}
              onChange={handleChange}
              required
              className="mt-1 p-2 rounded border border-gray-300"
            >
              <option value="None">None</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-white">Amount:</label>
            <input
              type="text"
              name="amount"
              value={formData.amount.toFixed(2)}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <button type="submit" className="p-2 bg-green-600 text-white rounded">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookPlaneTicketPage;
