import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { errorAlert } from "../../Alermessage";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/is-auth`, { withCredentials: true });
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user-details`, { withCredentials: true });
      console.log("Userdata",data);
      
      if (data.success) {
        setUserData(data.user);
      } else {
        errorAlert(data.message);
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, [refresh]);

  return (
    <AppContent.Provider value={{ backendUrl, isLoggedin, setIsLoggedin, userData, setUserData, 
    getUserData, loading,setLoading,refresh, setRefresh }}>
      {children}
    </AppContent.Provider>
  );
};
