import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const { userData } = useContext(AppContent)
  const navigate = useNavigate()

  console.log(userData);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      {
        userData?.role === "user" &&
        <div className='flex flex-col lg:flex-row  items-center justify-center gap-10  p-6'>
          <img src={assets.userimg} className='w-96 h-80 lg:h-1/3 ' alt="" />
          <div className='flex flex-col items-center justify-center'>
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : ' Developer'}  <img className='aspect-square w-8 ml-2' src={assets.hand_wave} alt="" /></h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to your app</h2>
            <p className='mb-8 max-w-md '>Let's start with a quick product tore and we will have you up and running in no time!</p>

            <button onClick={() => navigate('/user')} className='border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-200 transition-all'>Get Start</button>
          </div>

        </div>
      }

      {
        userData?.role === "admin" &&
        <>
          <img src={assets.admin} className='lg:w-90 h-60 lg:h-80 rounded-full mb-6' alt="" />
          <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Admin  <img className='aspect-square w-8' src={assets.hand_wave} alt="" /></h1>
          <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to your app</h2>
          <p className='mb-8 max-w-md '>Within the BE_FIT application, you can guide client
            fitness journeys and bring new doctors on board</p>

          <button onClick={() => navigate('/user')} className='border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-200 transition-all'>Get Start</button>

        </>
      }

      {
        userData?.role === "doctor" &&
        <div className='flex flex-col lg:flex-row  items-center justify-center p-5'>
          <img src={assets.doctor} className='w-40 lg:w-80 h-80 lg:h-1/3  ' alt="" />
          <div className='flex flex-col items-center justify-center text-center'>
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Dr. {userData ? userData.name : ' Developer'}  <img className='aspect-square w-8' src={assets.hand_wave} alt="" /></h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to your app</h2>
            <p className='mb-8 max-w-md '>A message from a client awaits, inquiring with care , your reply is now their hope in air.</p>

            <button onClick={() => navigate('/doctor/chatPage')} className='border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-200 transition-all'>Get Start</button>
          </div>

        </div>
      }



    </div >
  )
}

export default Header