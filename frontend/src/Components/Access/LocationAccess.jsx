import React from 'react';
import { Link } from 'react-router-dom';

const LocationAccess = () => {
  return (
    <div className="flex items-center justify-center w-screen min-h-screen">
      <div className=" card bg-yellow-900 p-4 rounded-lg shadow-md w-1/4 opacity-80">

        <div className="card-body items-center text-center  font-bold  text-white p-2">
          <h2 className="card-title text-white  py-2">Location Access!</h2>
          <p>We are using your current location.</p>
          <div className="card-actions justify-end p-4">
          <Link to='/allowAccess' >    <button className="bg-gray-500 text-green-500 hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-3">Accept</button></Link>

          <Link to='/denyAccess' >               <button className="bg-gray-500 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Deny</button> </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationAccess;
