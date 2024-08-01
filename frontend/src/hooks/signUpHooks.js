import toast from "react-hot-toast";
import { useState } from 'react';
import { useAuthContext } from "../context/authContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  
  const signup = async ({ username, email, password, gender }) => {
    const success = handleInputErrors({ username, email, password, gender });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, gender }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("TakeMeHome", JSON.stringify(data));
      setAuthUser(data);
      console.log(data);

      toast.success('Registered successfully', { style: { backgroundColor: 'green', color: '#fff' } });
    }catch(error){

        toast.error(error.message, { style: { backgroundColor: 'red', color: '#fff' } });
    } finally {
      setLoading(false);
    }
  }

  return { loading, signup }
}

export default useSignup;

function handleInputErrors({ username, email, password, gender }) {
  if (!username || !password || !email || !gender) {
    toast.error("Please fill all the fields");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
