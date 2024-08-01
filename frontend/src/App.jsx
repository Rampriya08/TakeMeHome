import { useState } from 'react';
import SignUp from './Components/SignUP/SignUp';
import Login from './Components/Login/Login';
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Components/Home/Home';
import { useAuthContext } from './context/authContext';
import MapComponent from './Components/Home/MapComponent';
import DenyAccess from './Components/Home/DenyAccess';
import BookBusTicket from './Components/Ticket/BusTicket';
import PaymentPage from './Components/Ticket/Payment';
import useConversation from './zustand/getTicket';
import BookTrainTicketPage from './Components/Ticket/TrainTicket';
import BookPlaneTicketPage from './Components/Ticket/PlainTicket';
import ViewBooking from './Components/User/ViewBooking';
import EditProfile from './Components/User/EditProfile';

function App() {
  const { authUser } = useAuthContext();
  const TicketId = useConversation((state) => state.TicketId);
  const user = JSON.parse(localStorage.getItem("TakeMeHome"));

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to="/signup" />} />
          <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
          <Route path='/allowAccess' element={<MapComponent />} />
          <Route path='/denyAccess' element={<DenyAccess />} />
          <Route path='/book-bus-ticket' element={<BookBusTicket />} />
          <Route path='/book-train-ticket' element={<BookTrainTicketPage />} />
          <Route path='/book-plane-ticket' element={<BookPlaneTicketPage />} />
          <Route path='/view-booking' element={<ViewBooking />} />
          <Route path='/edit-profile' element={<EditProfile  userId={user._id} />} />


          <Route path={`/payment/:ticketId`} element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
