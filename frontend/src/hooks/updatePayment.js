import { useState } from 'react';
import toast from 'react-hot-toast';

const useUpdatePayment = () => {
  const [loading, setLoading] = useState(false);

  const updatePayment = async (paymentData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/updatePayment/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Failed to update payment. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, updatePayment };
};

export default useUpdatePayment;
