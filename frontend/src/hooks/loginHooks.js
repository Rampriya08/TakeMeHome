import { useState } from "react";
import toast from "react-hot-toast"
import { useAuthContext } from "../context/authContext";
const UseLogin=() =>{
  const {setAuthUser}=useAuthContext();

    const [loading,setLoading]=useState("false")

const login=async({username,password}) =>{
    const success=handleInput({username,password})
    if(!success) return;
    setLoading(false);
    try{
        const res =await fetch("http://localhost:8000/api/auth/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password})
        })
        const data = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
      localStorage.setItem("TakeMeHome",JSON.stringify(data));
      setAuthUser(data);
        console.log(data)
        toast.success('login successfully', { style: { backgroundColor: 'green', color: '#fff' } });
    }catch(error){
        toast.error(error.message, { style: { backgroundColor: 'red', color: '#fff' } });
    }
    finally{
        setLoading(false)
    }
}
return {loading,login}
}
export default UseLogin

function handleInput({username,password}){
    if(!username || !password){
        toast.error("Please fill all the feilds")
        return false
    }
    return true;
}
