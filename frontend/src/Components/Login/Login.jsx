import React, { useState } from 'react'
import UseLogin from '../../hooks/loginHooks.js'
import toast from 'react-hot-toast';

const Login = () => {
  const {loading,login} =UseLogin();
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const handleClick=async(e)=>{
    

    e.preventDefault();
    await login({username,password})

    
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-md opacity-80">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Login</h2>
      <form>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
        </div>
       
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-gray-500  hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleClick}
           >
            Login
          </button>
          

        </div>
      </form>
    </div>
  </div>
  )
}

export default Login