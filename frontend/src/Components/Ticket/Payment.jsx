import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useConversation from '../../zustand/getTicket';
import useFetchAmount from '../../hooks/useFetchAmount';
import useUpdatePayment from '../../hooks/updatePayment';

const PaymentPage = () => {
  const { ticketId } = useParams();
  const [payData, setPayData] = useState({
    username: '',
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    ticketId: ticketId 
  });

  const { updatePayment,loading } = useUpdatePayment()
  const { resetTicketId } = useConversation();
  const { amountT, error } = useFetchAmount(ticketId);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("TakeMeHome");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const username = parsedData.username;
      setPayData((prevFormData) => ({ ...prevFormData, username }));
    } else {
      console.log("No data found in local storage.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSkip = () => {
    toast.error('Payment skipped', { style: { backgroundColor: 'red', color: '#fff' } });
    localStorage.removeItem("Ticket");
    resetTicketId();
    const previousAppState = JSON.parse(localStorage.getItem('previousState'));

    if (previousAppState) {
      navigate(previousAppState.route);
    } else {
      navigate('/');
    }
  };

  const handlePay = async () => {
    try {
      const updatedPayData = { ...payData, paymentStatus: 'Success' };
      await updatePayment(updatedPayData);
      localStorage.removeItem("Ticket");
      resetTicketId();
    toast.success('Payment successfully', { style: { backgroundColor: 'green', color: '#fff' } });
    const previousAppState = JSON.parse(localStorage.getItem('previousState'));

    if (previousAppState) {
      navigate(previousAppState.route);
    } else {
      navigate('/');
    }

    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const amountToShow = amountT !== null ? amountT.toFixed(2) : '';

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-4xl opacity-90 ">
        <h2 className="text-gray-900 text-2xl mb-6">Payment Details</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-white">Username:</label>
            <input
              type="text"
              value={payData.username}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Amount:</label>
            <input
              type="text"
              value={amountToShow}
              readOnly
              className="mt-1 p-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Payment Type:</label>
            <select
              name="paymentMethod"
              value={payData.paymentMethod}
              onChange={handleChange}
              className="mt-1 p-2 rounded border border-gray-300"
            >
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button onClick={handleSkip} className="p-2 bg-red-600 text-white rounded">
              Skip
            </button>
            <button onClick={handlePay} className="p-2 bg-green-600 text-white rounded">
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
