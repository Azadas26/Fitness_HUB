import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContent } from '../contexts/AppContext';
import axios from 'axios';
import { errorAlert, successAlert } from '../../Alermessage';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [isEmailSend, setIsEmailSend] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSend, setIsOtpSend] = useState(false)

  const inputRef = useRef([]);

  axios.defaults.withCredentials = true;

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

  const sendPasswordResetOtp = async (e) => {
    try {
      e.preventDefault()
      const { data } = await axios.post(`${backendUrl}/send-reset-otp`, { email })
      if (data.success) {
        setIsEmailSend(true);
        successAlert(data.message)
      }
    } catch (error) {
      errorAlert(error.response.data.message || error.message);
    }
  }

  const getOtp = (e) => {
    e.preventDefault()
    if (inputRef.current.length === 6) {
      const otparray = (inputRef.current.map(e => e.value)).join('');
      setOtp(otparray);
      setIsOtpSend(true);
    } else {
      errorAlert("Enter correct number of OTP")
    }
  }

  const Hadilenewpasswordsubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${backendUrl}/reset-password`, { email, otp, newpassword:newPassword });
      if(data.success){
        successAlert(data.message);
        navigate('/login')
      }
    } catch (error) {
      errorAlert(error.response.data.message || error.message);
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} className='absolute top-5 left-5 sm:left-20' src={assets.logo} alt="" />

      {
        !isEmailSend &&

        <form onSubmit={sendPasswordResetOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-center text-white text-2xl font-semibold mb-4'>Reset password</h1>
          <p className='text-center mb-4 text-indigo-300'>Enter your registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white ' type="email" placeholder='Email id' required />
          </div>
          <button className='w-full font-semibold rounded-full text-white bg-gradient-to-r from-indigo-500 to-indigo-900 py-2'>Submit</button>
        </form>

      }

      {/* OTP Reset Password */}
      {
        isEmailSend && !isOtpSend &&

        <form onSubmit={getOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-center text-white text-2xl font-semibold mb-4'>Reset password OTP</h1>
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
          <button className='w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white text-md'>Submit</button>
        </form>

      }
      {/* entePaswword */}

      {
        isEmailSend && isOtpSend &&

        <form onSubmit={Hadilenewpasswordsubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-center text-white text-2xl font-semibold mb-4'>Enterthe new password</h1>
          <p className='text-center mb-4 text-indigo-300'>Enter the new password below</p>

          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className='bg-transparent outline-none text-white ' type="password" placeholder='Password' required />
          </div>
          <button className='w-full font-semibold rounded-full text-white bg-gradient-to-r from-indigo-500 to-indigo-900 py-2'>Submit</button>
        </form>

      }
    </div>
  )
}

export default ResetPassword