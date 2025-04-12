import React from 'react'
import ChatSideBar from './ChatSidBar.jsx'
import NoChatSelected from './NoChatSelected.jsx'
import ChatInterface from './ChatInterface.jsx'
import { DoctorChatCommunity } from '../../../store/DoctorGroupStore.js'

const ChatContainer = () => {
    const { setectedUser } = DoctorChatCommunity()
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-gray-300 px-4">
            <div className="flex w-full max-w-6xl h-[80%] bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
                <div className="w-auto bg-gray-100 border-r border-gray-300 rounded-xl pb-5">
                    <ChatSideBar />
                </div>
                <div className="flex  w-full items-center justify-center">
                    {
                        setectedUser ? (<ChatInterface />) : (<NoChatSelected />)
                    }

                </div>
            </div>
        </div>
    )
}

export default ChatContainer
