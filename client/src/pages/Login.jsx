import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../contexts/AppContext';
import axios from 'axios'
import { errorAlert, successAlert } from '../../Alermessage';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const { backendUrl, setIsLoggedin, getUserData, isLoggedin, userData } = useContext(AppContent)
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Registration = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/register`, { name, email, password })
        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate('/')
        } else {
          errorAlert(data.message);
        }
      } else {

        const { data } = await axios.post(`${backendUrl}/login`, { email, password });


        if (data.success) {
          setIsLoggedin(true);
          toast.success(data.message)
          getUserData()
          navigate('/')
        } else {
          errorAlert(data.message);
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.details) {

        errorAlert(error.response.data.error.details[0].message)
      }
      else {
        errorAlert(error.response.data.message);

      }
    }

  }

  useEffect(() => {
    isLoggedin && userData && navigate('/')
  }, [userData, isLoggedin])


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img className='absolute left-5 sm:left-20 top-5 w-16 sm:w-16 cursor-pointer' src={assets.mainlogo} alt="" />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-[90%] sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-sm text-center mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={Registration}>
          {
            state === 'Sign Up' && (
              <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt="" />
                <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-none ' type="text" placeholder='Full Name' required />
              </div>
            )
          }

          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-transparent outline-none ' type="email" placeholder='Email id' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='bg-transparent outline-none ' type="password" placeholder='Password' required />
          </div>

          {
            state !== 'Sign Up' && <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer hover:underline underline-offset-1'>Forgot pasword</p>
          }

          <button className='w-full p-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
        {
          state === 'Sign Up' ? (<p className='text-gray-400 mt-4 text-center tex-xs'>Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-blue-400 underline cursor-pointer'>Login here</span>
          </p>
          ) : (<p className='text-gray-400 mt-4 text-center tex-xs'>Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-blue-400 underline cursor-pointer'>Sign up</span>
          </p>)
        }

      </div>

    </div>
  )
}

export default Login