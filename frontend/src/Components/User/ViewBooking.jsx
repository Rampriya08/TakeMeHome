import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import UserProfile from './User';

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedMode, setSelectedMode] = useState('Bus'); // Default mode is Bus

  useEffect(() => {
    localStorage.setItem('previousState', JSON.stringify({ route: '/view-booking' }));
    const storedData = localStorage.getItem("TakeMeHome");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUsername(parsedData.username);
      fetchBookings(parsedData.username);
    } else {
      console.log("No data found in local storage.");
    }
  }, []);

  const fetchBookings = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched bookings:', data); // Log the fetched data
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings. Please try again.');
    }
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  
  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error deleting booking. Please try again.');
    }
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-yellow-900 text-white">
        <div className="text-xl font-bold">{username}</div>
        <div className="flex-grow"></div>
        <UserProfile />
      </header>

      {/* Mode Selection Buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => handleModeChange('Bus')}
          className={`p-2 rounded ${selectedMode === 'Bus' ? 'bg-yellow-900 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Bus
        </button>
        <button
          onClick={() => handleModeChange('Train')}
          className={`p-2 rounded ${selectedMode === 'Train' ? 'bg-yellow-900 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Train
        </button>
        <button
          onClick={() => handleModeChange('Plane')}
          className={`p-2 rounded ${selectedMode === 'Plane' ? 'bg-yellow-900 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Plane
        </button>
      </div>

      <br /> <br />

      <div className="flex flex-wrap justify-center gap-4">
        {/* Bus Bookings Section */}
        {selectedMode === 'Bus' && (
          <div className="w-full md:w-1/2 text-white rounded-lg">
            <div className="space-y-4">
              {bookings.filter(b => b.mode === 'Bus').map(booking => (
                <div key={booking._id} className={`p-4 rounded opacity-90 ${booking.paymentStatus === 'Success' ? 'bg-lime-600' : 'bg-rose-700'}`}>
                  <p className="mb-2"><strong>Name:</strong> {booking.name}</p>
                  <p className="mb-2"><strong>Age:</strong> {booking.age}</p>
                  <p className="mb-2"><strong>Source:</strong> {booking.source}</p>
                  <p className="mb-2"><strong>Destination:</strong> {booking.destination}</p>
                  <p className="mb-2"><strong>Amount:</strong> {booking.amount}</p>
                  {booking.paymentStatus === 'Pending' && (
                    <Link to={`/payment/${booking._id}`} className="bg-emerald-500 text-white rounded p-2 inline-block">
                      Pay
                    </Link>
                  )}
                  <div className="flex space-x-2 mt-2">
                   
                    <button onClick={() => handleDelete(booking._id)} className="bg-red-500 text-white rounded p-2">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {bookings.filter(b => b.mode === 'Bus').length === 0 && <p>No bus bookings found.</p>}
            </div>
          </div>
        )}

        {/* Train Bookings Section */}
        {selectedMode === 'Train' && (
          <div className="w-full md:w-1/2">
            <div className="space-y-4">
              {bookings.filter(b => b.mode === 'Train').map(booking => (
                <div key={booking._id} className={`p-4 rounded opacity-90 ${booking.paymentStatus === 'Success' ? 'bg-lime-600' : 'bg-red-800'}`}>
                  <p className="mb-2"><strong>Name:</strong> {booking.name}</p>
                  <p className="mb-2"><strong>Age:</strong> {booking.age}</p>
                  <p className="mb-2"><strong>Source:</strong> {booking.source}</p>
                  <p className="mb-2"><strong>Destination:</strong> {booking.destination}</p>
                  <p className="mb-2"><strong>Amount:</strong> {booking.amount}</p>
                  {booking.paymentStatus === 'Pending' && (
                    <Link to={`/payment/${booking._id}`} className="bg-emerald-500 text-white rounded p-2 inline-block">
                      Pay
                    </Link>
                  )}
                  <div className="flex space-x-2 mt-2">

                    <button onClick={() => handleDelete(booking._id)} className="bg-red-500 text-white rounded p-2">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {bookings.filter(b => b.mode === 'Train').length === 0 && <p>No train bookings found.</p>}
            </div>
          </div>
        )}

        {/* Plane Bookings Section */}
        {selectedMode === 'Plane' && (
          <div className="w-full md:w-1/2">
            <div className="space-y-4">
              {bookings.filter(b => b.mode === 'Plane').map(booking => (
                <div key={booking._id} className={`p-4 rounded opacity-90 ${booking.paymentStatus === 'Success' ? 'bg-lime-600' : 'bg-red-800'}`}>
                  <p className="mb-2"><strong>Name:</strong> {booking.name}</p>
                  <p className="mb-2"><strong>Age:</strong> {booking.age}</p>
                  <p className="mb-2"><strong>Source:</strong> {booking.source}</p>
                  <p className="mb-2"><strong>Destination:</strong> {booking.destination}</p>
                  <p className="mb-2"><strong>Amount:</strong> {booking.amount}</p>
                  {booking.paymentStatus === 'Pending' && (
                    <Link to={`/payment/${booking._id}`} className="bg-emerald-500 text-white rounded p-2 inline-block">
                      Pay
                    </Link>
                  )}
                  <div className="flex space-x-2 mt-2">
                    
                    <button onClick={() => handleDelete(booking._id)} className="bg-red-500 text-white rounded p-2">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {bookings.filter(b => b.mode === 'Plane').length === 0 && <p>No plane bookings found.</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewBooking;
