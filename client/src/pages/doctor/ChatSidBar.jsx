import React, { useContext, useEffect } from 'react';
import { Users } from 'lucide-react';
import { DoctorChatCommunity } from '../../../store/DoctorGroupStore';
import { AppContent } from '../../contexts/AppContext';

const ChatSideBar = () => {
    const { backendUrl } = useContext(AppContent);
    const { getClients, doctorClients, setectedUser, setSelectedUser } = DoctorChatCommunity()

    useEffect(() => {
        getClients(backendUrl)
    }, []);

    return (
        <div>
            <aside className="h-screen w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
                <div className="border-b border-base-300 w-full p-5 bg-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 ">
                        <Users className="size-6 " />
                        <span className="font-medium hidden lg:block">Client</span>
                    </div>
                </div>

                <div className="overflow-y-auto w-full py-3">
                    {doctorClients && doctorClients.length !== 0 ? (
                        doctorClients.map((user, index) => (
                            <button
                                key={user._id}
                                onClick={() => { setSelectedUser(user) }}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300
                                    ${setectedUser?._id === user._id ? "bg-gray-400 rounded-lg" : ""}
                                    transition-colors border-b-2 border-gray-100 hover:bg-gray-200`}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <img
                                        src="https://secure.gravatar.com/avatar/b7a4eb213e510ef4604901a2159339b7/?s=256&d=https://images.binaryfortress.com/General/UnknownUser1024.png"
                                        alt={user.name}
                                        className="size-12 object-cover border rounded-full"
                                    />
                                </div>
                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.name}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">No Users Found</div>
                    )}


                </div>
            </aside>
        </div>
    )
};

export default ChatSideBar;
