import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../contexts/AppContext';
import axios from 'axios';
import { errorAlert, successAlert } from '../../Alermessage';

const NavBar = () => {
    const navigate = useNavigate();
    const {backendUrl,
        setIsLoggedin,
        userData,
        setUserData,
         } = useContext(AppContent);

    const logout = async ()=>{
        try {
            const {data} = await axios.get(`${backendUrl}/logout`,{withCredentials:true});
            navigate('/login')
            setIsLoggedin(false)
            setUserData(false)
        } catch (error) {
            errorAlert(error.message)
        }
    }

  

    return (
        <div className='w-full flex justify-between items-center p-4 px-6 sm:px-16 absolute top-0  z-50'>
            {/* Logo */}
            <img src={assets.logo} alt="Logo" className='w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />

            {/* User Section */}
            {userData ? (
                <div className='relative group'>
                    <div className='w-10 h-10 flex font-bold justify-center items-center rounded-full bg-black text-white cursor-pointer'>
                        {userData.name.slice(0, 2).toUpperCase()}
                    </div>
                    {/* Dropdown */}
                    <div className=' hidden group-hover:flex flex-col absolute right-0  bg-white shadow-lg border rounded-lg'>
                        <ul className='text-black text-sm list-none m-0 p-2'>
                            

                            <li onClick={()=>logout()} className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                </div>
            ) : (
                /* Login Button */
                <button
                    onClick={() => navigate('/login')}
                    className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-200 transition-all'
                >
                    Login
                    <img src={assets.arrow_icon} alt="Arrow" className='w-4 h-4' />
                </button>
            )}
        </div>
    );
};

export default NavBar;
