import { useContext, useEffect, useRef, useState } from "react";
import { DoctorChatCommunity } from "../../../store/DoctorGroupStore";
import { AppContent } from "../../contexts/AppContext";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const ChatInterface = () => {
    const [messageInput, setMessageInput] = useState('')

    const messageEndRef = useRef(null);
    const { setectedUser, getClientMessages, ClientMessages, sendMessage } = DoctorChatCommunity()
    const { backendUrl } = useContext(AppContent);



    useEffect(() => {
        console.log("Azad checking", setectedUser?._id);

        if (setectedUser?._id) {
            getClientMessages(setectedUser?._id, backendUrl)
        }
    }, [setectedUser?._id, getClientMessages])


    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [ClientMessages]);

    return (
        <div className="flex-1 flex flex-col justify-center overflow-auto h-full relative py-2">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 pt-10 h-full ">
                {ClientMessages && ClientMessages?.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isdoctor === true ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-3 py-2 rounded-2xl max-w-xs w-fit my-2
                                ${msg.isdoctor != true
                                    ? "bg-blue-400 text-white rounded-bl-sm"
                                    : "bg-gray-200 text-gray-800 rounded-br-sm"
                                }`}
                        >
                            <h2 className="text-sm lg:text-lg">
                                {
                                    msg.message
                                }
                            </h2>


                        </div>
                    </div>
                ))}

                {/* Scroll Anchor */}
                <div ref={messageEndRef} />
            </div>
            <div className="mt-4 flex gap-2 pl-5">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            await sendMessage(backendUrl, messageInput, setectedUser?._id)
                            setMessageInput('')
                        }
                    }}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    className="text-sm bg-[#ff5520] text-white px-4 py-2 rounded-full"
                    onClick={async () => {
                        await sendMessage(backendUrl, messageInput, setectedUser?._id)
                        setMessageInput('')
                    }}
                >
                    <IoMdSend />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
