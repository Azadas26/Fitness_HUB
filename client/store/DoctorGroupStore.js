import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

// We must pass backendUrl from within a component or wrap the store in a hook
export const DoctorChatCommunity = create((set, get) => ({
    doctorClients: [],
    ClientMessages: [],
    setectedUser:null,

    getClients: async (backendUrl) => {
        try {
            const res = await axios.get(`${backendUrl}/doctor/getClients`, { withCredentials: true });
            set({
                doctorClients: res.data?.getClients
            });
        } catch (error) {
            toast.error(error.message);
        }
    },
    setSelectedUser: (user) => {
        console.log("Selected Userrr Group:", user);
        set({ setectedUser: user });
    },
    getClientMessages: async (userId, backendUrl) => {
        try {

            if (!userId) return;
            console.log('Fetching messages for projectId:', userId);
            const { data } = await axios.get(`${backendUrl}/doctor/getClientMessage/${userId}`, { withCredentials: true });

            set({ ClientMessages: data?.chat_messages.messages || [] });

        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message || "Failed to fetch messages");
        }
    },
    sendMessage: async (backendUrl, message, setectedUserId) => {
        const { ClientMessages } = get();
        try {
            if (message === '')
                return toast.error("Input box empty");

            const { data } = await axios.patch(`${backendUrl}/doctor/SendMessage/${setectedUserId}`, { message }, { withCredentials: true });

            set({
                ClientMessages: [...ClientMessages, {
                    message: data?.message,
                    isdoctor: true
                }]
            }); // Use data instead of res
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    }

}));
