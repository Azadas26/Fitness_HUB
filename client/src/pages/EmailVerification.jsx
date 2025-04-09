import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContent } from '../contexts/AppContext';
import { errorAlert, successAlert } from '../../Alermessage';

const EmailVerification = () => {
  const navigate = useNavigate();

  const inputRef = useRef([]);

  const { backendUrl, isLoggedin, userData } = useContext(AppContent)

  const handileInput = (e, index) => {
    if (e.target.value > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }

  const handlePast = (e) => {
    const past = e.clipboardData.getData('text');
    const pastarray = past.split('')
    pastarray.forEach((cha, index) => {
      inputRef.current[index].value = cha;
    })
  }

  const onsubmitEmailverify = async (e) => {
    try {
      e.preventDefault()
      const otp = (inputRef.current.map(e => e.value)).join('')
      const { data } = await axios.post(`${backendUrl}/verify-email`, { otp }, { withCredentials: true });
      if (data.success) {
        successAlert(data.message);
        navigate('/')
      }

    } catch (error) {
      errorAlert(error.response.data.message || error.message);
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [userData, isLoggedin])

  const SendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/send-otp`, { withCredentials: true })
      if (data.success) {
        successAlert(data.message)
        navigate("/email-verify")
      }
    } catch (error) {
      errorAlert(error.response.data.message || error.message);
      navigate('/login')
    }
  }

  useEffect(() => {
    SendVerificationOtp()
  }, [])


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} className='absolute top-5 left-5 sm:left-20' src={assets.logo} alt="" />
      <form onSubmit={onsubmitEmailverify} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-center text-white text-2xl font-semibold mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-4 text-indigo-300'>Enter the 6-digit code send to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePast}>
          {
            Array(6).fill(0).map((_, index) => {
              return (
                <div>
                  <input ref={e => inputRef.current[index] = e}
                    onInput={e => handileInput(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    className='rounded-md w-9 sm:w-12 h-9 sm:h-12 bg-[#333A5C] outline-none text-white text-center text-xl' type="text" maxLength={1} key={index} required />
                </div>
              )
            })
          }
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white text-lg'>Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerification