import React from 'react'
import Logout from './Logout'
import MapComponent from './MapComponent'
import LocationAccess from '../Access/LocationAccess'
import UserProfile from '../User/User'

const Home = () => {
  return (
<>      
<header className="flex justify-between items-center p-4 bg-yellow-900 text-white">
        <div className="text-xl font-bold">Take Me Home</div>
        <div className="flex-grow"></div>
        <UserProfile />
      </header>
    <div>
      <LocationAccess />

    </div>
    </>

  )
}

export default Home