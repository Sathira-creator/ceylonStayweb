import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import {Toaster} from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import Loader from './components/Loader';
import { LoadingScreen } from './components/LoadingScreen';
import { useState } from 'react';
import Wallet from './components/hotelOwner/Wallet';
import AddVideo from './pages/hotelOwner/AddVideo';
import FeaturedDestinations from './pages/FeaturedDestinations';
import Charts from './pages/hotelOwner/Charts';
import RevenueChart from './components/hotelOwner/RevenueChart';
import BookingChart from './components/hotelOwner/BookingChart';

const App = () => {

  const isOwnerPath = useLocation().pathname.includes('owner');
  const {showHotelReg, showWallet, showBarChart, setShowBarChart, showPieChart, setShowPieChart, firstLoad, setFirstLoad} = useAppContext();
  const [loading, setLoading] = useState(true);
  


  return (
    <>
      {loading && (
        <LoadingScreen
          onFinish={() => {
            setLoading(false);
            setFirstLoad(false);
          }}
        />
      )}
      
    
        <div className={`transition-opacity duration-700 ${loading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <Toaster/>
          {!isOwnerPath && <Navbar />}
          {showHotelReg && <HotelReg />}
          {showWallet && <Wallet />}
          {showBarChart && < RevenueChart/>}
          {showPieChart && < BookingChart/>}
          <div className='min-h-[70vh]'>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/rooms' element={<AllRooms/>} />
              <Route path='/rooms/:id' element={<RoomDetails/>} />
              <Route path='/my-bookings' element={<MyBookings/>} />
              <Route path='/loader/:nextUrl' element={<Loader/>} />
              <Route path='/featured-destinations' element={<FeaturedDestinations/>} />
              <Route path='/charts' element={<Charts/>} />

              <Route path='/owner' element={<Layout/>}>
                <Route index element={<Dashboard/>} />
                <Route path='add-room' element={<AddRoom/>} />
                <Route path='add-video' element={<AddVideo/>} />
                <Route path='list-room' element={<ListRoom/>} />
                

              </Route>
            </Routes>
        </div>
        <Footer />
        
      </div>
    </>
  )
}

export default App
