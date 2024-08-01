import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const EditProfile = ({ userId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/user/get/${userId}`,{
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setUsername(data.username || "");
          setEmail(data.email || "");
          setGender(data.gender || "");
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/user/${userId}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, gender }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

     
      localStorage.setItem("TakeMeHome", JSON.stringify(data));
      toast.success("Profile updated successfully", { style: { backgroundColor: 'green', color: '#fff' } });
      const previousAppState = JSON.parse(localStorage.getItem('previousState'));

    if (previousAppState) {

      navigate(previousAppState.route);
    } else {

      navigate('/');
    }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-md opacity-80">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Gender
            </label>
            <div className="flex items-center">
              <input
                className="mr-2"
                id="male"
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="text-white mr-4" htmlFor="male">Male</label>
              <input
                className="mr-2"
                id="female"
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="text-white mr-4" htmlFor="female">Female</label>
              <input
                className="mr-2"
                id="other"
                type="radio"
                name="gender"
                value="Other"
                checked={gender === "Other"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="text-white" htmlFor="other">Other</label>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-500 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
