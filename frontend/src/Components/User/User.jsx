import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import useLogout from '../../hooks/logoutHooks';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const {loading,logout} = useLogout();
  useEffect(() => {
    const storedData = localStorage.getItem('TakeMeHome');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUsername(parsedData.username);
    } else {
      console.log('No data found in local storage.');
    }
  }, []);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };


  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center cursor-pointer">
        <FaUserCircle className="text-4xl text-white" />
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="block px-4 py-2 text-sm text-gray-700">
              {username}
            </div>
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Home
            </Link>
            <Link
              to="/view-booking"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              View Booking
            </Link>
            <Link
              to="/edit-profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Edit Profile
            </Link >
            <Link to='/signup'>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Logout
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
