import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  
  const {userData} = useContext(AppContent)
  const navigate = useNavigate()

  console.log(userData);
  
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} className='w-36 h-60 rounded-full mb-6' alt="" />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : ' Developer'}  <img className='aspect-square w-8' src={assets.hand_wave} alt="" /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to your app</h2>
        <p className='mb-8 max-w-md '>Let's start with a quick product tore and we will have you up and running in no time!</p>
        <button onClick={()=>navigate('/user')} className='border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-200 transition-all'>Get Start</button>
    </div>
  ) 
}

export default Header