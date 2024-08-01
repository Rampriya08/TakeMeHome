import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";

const useLogout = () => {
const [loading,setLoding]=useState(false);
const {setAuthUser}=useAuthContext();

const logout=async () =>{
    setLoding(true);
    try {
        const res=await fetch("http://localhost:8000/api/auth/logout",{
            method:"POST",
            headers:{"Content-Type":"application/json"}

        });
        const data= await  res.json();
        if(data.error){
            throw new Error(data.error);
        }

       
        setAuthUser(null);
        toast.success('logout successfully', { style: { backgroundColor: 'green', color: '#fff' } });
    }catch(error){
        toast.error(error.message, { style: { backgroundColor: 'red', color: '#fff' } });
    }finally{
        setLoding(false)
    }
}

  return { loading, logout };
}

export default useLogout