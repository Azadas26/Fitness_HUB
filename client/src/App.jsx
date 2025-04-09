import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

// Import your page components
import Home from './pages/Home';
import FirstPage from './pages/FirstPage';
import Login from './pages/Login';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';
import UserHome from './pages/UserHome';
import FirstPageDoctor from './pages/doctor/FirstPageDoctor';
import AdminHome from './pages/admin/AdminHome';
import DoctorRoot from './pages/doctor/DoctorRoot';
import AdminRoot from './pages/admin/AdminRoot';


import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import DailySessions from './pages/exersises/DailySessions';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Toaster />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProtectedRoute allowedRoles={['user']}/>}>
            <Route path="/" element={<Home />}>
              <Route index element={<FirstPage />} />
              <Route path="user" element={<UserHome />} /> 
              <Route path="dailySessions" element={<DailySessions />} />
            </Route>

          </Route>

          <Route path="login" element={<Login />} />
          <Route path="email-verify" element={<EmailVerification />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />


          {/* User Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['user']} />}>

          </Route> */}

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorRoot />}>
              <Route path="firstPage" element={<FirstPageDoctor />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminRoot />}>
              <Route index element={<AdminHome />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
