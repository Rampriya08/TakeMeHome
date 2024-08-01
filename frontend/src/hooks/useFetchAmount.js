import { useState, useEffect } from 'react';
import useConversation from '../zustand/getTicket';

const useFetchAmount = (ticketId) => {
  const amountT = useConversation((state) => state.amountT);
  const setAmountT = useConversation((state) => state.setAmountT);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/payment/${ticketId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch amount');
        }
        const data = await response.json();
        setAmountT(data.amount);
      } catch (error) {
        setError(error.message);
      }
    };

    if (ticketId) {
      fetchAmount();
    }
  }, [ticketId, setAmountT]);

  useEffect(() => {
    console.log("AmountT updated to:", amountT);
  }, [amountT]);

  return { amountT, error };
};

export default useFetchAmount;
