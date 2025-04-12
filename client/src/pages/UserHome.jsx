import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { MdOutlineDoubleArrow, MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import toast from 'react-hot-toast';
import axios from 'axios';
import { AppContent } from '../contexts/AppContext';
import { TbMessages } from "react-icons/tb";
import { evaluvateBMIRatio } from '../../utils/useBMICompair';
import { GoDot } from "react-icons/go";
import { CiDumbbell } from "react-icons/ci";
import { LiaDumbbellSolid } from "react-icons/lia";
import { IoMdSend } from "react-icons/io";
import { FiRefreshCcw } from "react-icons/fi";
import { SiWelcometothejungle } from "react-icons/si";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaViadeo } from "react-icons/fa6";
import { PiFolderStarDuotone } from "react-icons/pi";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const [bmiClick, setBmiClick] = useState(false);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [showMessagePopup, setShowMessagePopup] = useState(false);
    const [bmiDetails, setBMIDetails] = useState(null);
    const [bmiError, setBmiError] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [chatmMssage, setChatMessage] = useState([]);
    const [doctorName, setDoctorName] = useState(null);
    const [chatInput, setChatInput] = useState('')

    const scrollRef = useRef();
    const navigate = useNavigate()

    const { backendUrl, userData, refresh, setRefresh } = useContext(AppContent);

    const CalculatBMI = async () => {
        try {
            const ogheight = Number(height);
            const ogweight = Number(weight);

            const heightInMeters = ogheight / 100;
            const bmi = ogweight / (heightInMeters * heightInMeters);



            if (bmi > 60) {
                toast.error("Invalid credentials entered", { position: "top-right" })
                setBmiError(true);
                return;
            }

            if (height !== null && weight !== null && !isNaN(ogheight) && !isNaN(ogweight)) {
                const { data } = await axios.patch(
                    `${backendUrl}/updateBMIratio`,
                    { height: ogheight, weight: ogweight },
                    { withCredentials: true }
                );

                setBmiClick(false);
                setRefresh(!refresh);
                setRerender(!rerender)
                toast.success(data?.message, { position: "top-left" });
            } else {
                toast.error("Please enter valid height and weight");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const setBMIObject = () => {
        // 🟡 
        if (userData?.bmi === null || userData?.bmi === undefined) {
            setBmiError(true);
            return;
        }

        const result = evaluvateBMIRatio(userData?.bmi);
        console.log("result", result);
        if (result === "error") {
            console.log("Erorrr");
            setBmiError(true)
        } else {
            console.log("NOerorr");
            setBmiError(false)
            setBMIDetails(result)
        }
        //setBMIDetails(result)

    }

    useEffect(() => {
        setBMIObject();
    }, [userData, rerender]);

    useEffect(() => {
        console.log("rerender calling");

    }, [bmiError, bmiDetails, rerender]);


    const watchDailySessions = () => {
        if (userData?.bmi === null || userData?.bmi === undefined) {
            toast.error("Calculate your BMI ratio")
            return;
        } else {
            navigate('/dailySessions')
        }
    }

    const assignDoctor = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/assignDoctor`, { withCredentials: true })

        } catch (error) {
            console.log(error);
            setShowMessagePopup(false)
            toast.error(error.response.data.message || error.message);
        }
        return;
    }

    const getDeoctorMessages = async () => {
        try {

            const { data } = await axios.get(`${backendUrl}/getDoctorMessages`, { withCredentials: true })

            console.log("DoctorChats", data);
            setDoctorName(data?.messageDetails?.doctorId?.name)
            console.log("mmmm", data?.messageDetails?.messages);

            setChatMessage(data?.messageDetails?.messages)

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || error.message);
        }
    }

    const sendMessage = async () => {
        try {

            if (chatInput === '') {
                toast.error("Input Box empty")
            }

            const { data } = await axios.patch(`${backendUrl}/sendDoctorMessages`, { message: chatInput }, { withCredentials: true })

            setChatInput('')
            setChatMessage([...chatmMssage, data?.text])
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatmMssage]);



    return (
        <div className='w-full flex flex-col justify-center items-center bg-[#fffdfc] hide-scrollbar'>

            {/* Hero Section */}
            <div className='flex flex-col lg:flex-row justify-center items-center relative h-screen animate-fadeIn gap-5 lg:gap-0' >
                <div className='flex lg:w-[50%] w-full justify-center lg:justify-end items-center '>
                    <div className='flex flex-col gap-5 '>
                        <p className='text-[32px] lg:text-[46px] font-extrabold tracking-[8px]'
                            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", wordSpacing: "6px", letterSpacing: "5px" }}>
                            Health Nutrition & <br /> Fitness Program
                        </p>
                        <h2 className='text-gray-500'>
                            Health isn’t just about fitness; it’s about balance, sleep, <br /> mindset, and nourishment too
                        </h2>
                        <div onClick={watchDailySessions} className='flex items-center justify-center lg:justify-start gap-2 mt-3'>
                            <img className='w-[45px] h-[45px] cursor-pointer hover:scale-110' src={assets.play_button} alt="button" />
                            <h2 className='text-gray-500 text-[17px]'>Watch Daily Sessions</h2>
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-[50%] h-auto lg:h-[80vh] flex items-center lg:items-end flex-col justify-center ml-3'>
                    <img className='w-[350px] lg:w-full' src={assets.bg_fit} alt="Fitness" />
                </div>
                <div className='bg-white flex flex-row lg:flex-col justify-center items-center lg:items-start gap-5 lg:gap-0 w-auto h-[50px] lg:h-[100px] shadow-lg rounded-xl p-4 absolute bottom-0 lg:bottom-36'>
                    <p className='text-[23px] text-[#5d1be5] font-extrabold'>450+</p>
                    <h2 className='text-gray-500'>Daily Diet Plan For Health</h2>
                </div>
                <div className='flex flex-col justify-center w-auto p-4 absolute bottom-10 animate-bounceFast'>
                    <MdOutlineKeyboardDoubleArrowDown size={45} className='text-gray-300' />
                </div>
            </div>

            {/* BMI Section */}
            <div className='flex py-5 lg:py-0 flex-col lg:flex-row justify-center items-center relative gap-7 lg:gap-0'>
                <div className="w-[20px] h-[20px] bg-[#5d1be5] rounded-full absolute top-5 lg:top-0 left-5 lg:left-0"></div>
                <div className='p-6 lg:p-0 mt-20 lg:mt-0 flex w-full lg:w-[50%] justify-center items-end'>
                    <div className='flex flex-col gap-6 justify-center lg:justify-start items-center lg:items-start text-center lg:text-start'>
                        <p className='text-[32px]  lg:text-[36px] font-extrabold'
                            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", wordSpacing: "6px", letterSpacing: "5px" }}>
                            Let's Be A Part Of Health Session
                        </p>
                        <h2 className='text-[20px] font-extrabold tracking-[8px]'
                            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", wordSpacing: "6px", letterSpacing: "5px" }}>
                            What Is BMI Ratio?
                        </h2>
                        <h2 className='text-gray-500 max-w-sm lg:max-w-lg'>
                            BMI (Body Mass Index) is a number that tells you whether your weight
                            is healthy based on your height. It's a quick way to screen for underweight,
                            healthy weight, overweight, or obesity.
                        </h2>

                        <div className='flex items-center gap-2 cursor-pointer ' onClick={() => setBmiClick(!bmiClick)}>
                            <h2 className='text-[#ff5520] flex items-center justify-center gap-1 hover:scale-105'>
                                Calculate your BMI
                                <span className={`${bmiClick ? 'rotate-90' : ''}`}>
                                    <MdOutlineDoubleArrow className='animate-moveRight' />
                                </span>
                            </h2>
                        </div>

                        {bmiClick && (
                            <div className='flex animate-fadeIn'>
                                <div className='flex flex-col gap-8 lg:gap-4 items-center justify-center w-full h-[200px] bg-gray-50 text-center p-4 rounded-xl shadow-md transform transition duration-500 scale-95 hover:scale-100 opacity-0 animate-show'>
                                    <p className='text-[15px] lg:text-[20px] font-extrabold'>Calculate Your BMI Ratio</p>
                                    <div className='flex flex-col gap-8'>
                                        <div className='flex justify-center items-center gap-6'>
                                            <div className='flex justify-center items-center gap-4'>
                                                <h2 className='text-[13px] lg:text-[16px] text-gray-600'>Enter Your Height&nbsp;&nbsp;:</h2>
                                                <input onChange={(e) => setHeight(e.target.value)} value={height} className='border border-[#ff5520] h-9 w-9 rounded-lg text-center' type="text" placeholder='.cm' />
                                            </div>
                                            <div className='flex justify-center items-center gap-4'>
                                                <h2 className='text-[13px] lg:text-[16px] text-gray-600'>Enter Your Weight&nbsp;&nbsp;:</h2>
                                                <input onChange={(e) => setWeight(e.target.value)} value={weight} className='border border-[#ff5520] h-9 w-9 rounded-lg text-center' type="text" placeholder='.kg' />
                                            </div>
                                            <div>
                                                <button onClick={CalculatBMI} className='rounded-lg hover:text-white'>
                                                    <CiSearch className='hover:text-[#5d1be5] text-[#ff5520] h-8 w-8 font-extrabold' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BMI Result */}
                <div className=' w-full lg:w-[50%] h-auto lg:h-[80vh] flex items-center flex-col justify-center gap-6'>
                    {
                        userData?.bmi ? (
                            <div className='text-center  lg:p-0 animate-fadeIn   '>
                                {
                                    !bmiError && bmiDetails ? (
                                        // <h2 className='text-[25px] font-extrabold' style={{ wordSpacing: "4px" }}>
                                        //     Your BMI Ratio is {userData?.bmi}
                                        // </h2>
                                        <div className='rounded-[60px] bg-[#f3f3f3]  shadow-2xl flex flex-col gap-6 border-2 border-[#ff5520]  m-5 lg:m-0 px-8  py-6 '>
                                            <div>
                                                <p className='text-[#5d1be5] text-[35px] font-extrabold' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
                                                    {bmiDetails?.type}, BMI {userData?.bmi}, {bmiDetails?.bodySize}
                                                </p>

                                            </div>

                                            <div>
                                                <div className="flex justify-start p-2 ">
                                                    <div className=" text-gray-500 border-2 border-[#5d1be5] px-4 py-2 rounded-full rounded-br-sm w-full  text-sm shadow">
                                                        <p className=' italic max-w-md text-[15px]' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
                                                            {bmiDetails?.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=' flex flex-col items-center justify-center gap-3'>
                                                <p className=' text-[#5d1be5] text-[25px] font-extrabold' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>

                                                    Diet Recommendations
                                                </p>
                                                {
                                                    bmiDetails?.diet.map((items, index) => (
                                                        <p key={index} className='flex items-center justify-center gap-3 text-gray-500'>
                                                            <LiaDumbbellSolid className='text-[#ff5520] font-extrabold' />
                                                            {items}
                                                        </p>
                                                    ))
                                                }

                                            </div>
                                            <div className=' flex flex-col items-center justify-center gap-3'>
                                                <p className=' text-[#5d1be5] text-[25px] font-extrabold' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>

                                                    Exercise Recommendations
                                                </p>
                                                {
                                                    bmiDetails?.exercise.map((items, index) => (
                                                        <p key={index} className='flex items-center justify-center gap-3 text-gray-500'>
                                                            <CiDumbbell className='text-[#ff5520] font-extrabold' />
                                                            {items}
                                                        </p>
                                                    ))
                                                }


                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>

                                            </div>
                                            <div className='p-2 flex flex-col items-center justify-center'>
                                                <p className='text-[#ff5520] text-[25px] font-extrabold'>Invalid credentials entered </p>
                                                <img className='h-[300px] lg:h-[400px] w-[300px] lg:w-[380px]' src={assets.bmi_error} alt="BMI_Error" />
                                                <p onClick={() => {
                                                    setRerender(!rerender)
                                                    setBmiClick(false)

                                                }} className='flex items-center justify-center gap-2 cursor-pointer text-[#ff5520] text-[12px] font-extrabold'>Refresh the page <FiRefreshCcw /></p>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        ) : (
                            <img className='h-[300px] lg:h-[400px] w-[300px] lg:w-[380px]' src={assets.sad} alt="Sad face" />
                        )
                    }
                </div>
            </div>

            <div className='flex flex-col items-center justify-center w-full px-4 py-10 '>
                <div className='flex flex-wrap justify-center gap-16 max-w-7xl w-full'>

                    {/* CARD 1 */}
                    <div className='w-[80%] sm:w-[80%] md:w-[45%] lg:w-[30%] hover:scale-105 bg-[#f3f3f3] p-5 flex flex-col justify-between gap-7'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-outfit text-gray-900 text-[20px] font-extrabold'>Fithub</h2>
                            <p className='text-gray-400 text-[11px] font-extrabold tracking-widest'>SKIP</p>
                        </div>
                        <div>
                            <img src={assets.welcome} className='w-full h-[430px] object-contain' alt="welcome" />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-4 text-center'>
                            <h2 className='font-outfit text-gray-900 text-[30px] font-extrabold tracking-widest' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Welcome</h2>
                            <p className='text-gray-400 text-[13px]'>
                                Discover new fitness updates every <br /> day with <span className='text-gray-900 font-extrabold'>Fitness Hub</span>
                            </p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <SiWelcometothejungle size={26} />
                            <p className='text-[10px] font-extrabold text-gray-600 tracking-widest'>LET'S GO</p>
                            <div className="scale-x-150">
                                <IoIosArrowRoundForward className="text-3xl" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className='w-[80%] sm:w-[80%] md:w-[45%] lg:w-[30%] hover:scale-105 bg-[#f3f3f3] p-5 flex flex-col justify-between gap-7'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-outfit text-gray-900 text-[20px] font-extrabold'>Fithub</h2>
                            <p className='text-gray-400 text-[11px] font-extrabold tracking-widest'>SKIP</p>
                        </div>
                        <div>
                            <img src={assets.welcome2} className='w-full h-[430px] object-contain' alt="welcome2" />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-4 text-center'>
                            <h2 className='font-outfit text-gray-900 text-[30px] font-extrabold tracking-widest' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Browse</h2>
                            <p className='text-gray-400 text-[13px]'>
                                We connect you to the best training programs to help you achieve a perfect lifestyle
                            </p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <FaViadeo size={26} />
                            <p className='text-[10px] font-extrabold text-gray-600 tracking-widest'>LET'S GO</p>
                            <div className="scale-x-150">
                                <IoIosArrowRoundForward className="text-3xl" />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3 */}
                    <div className='w-[80%] sm:w-[80%] md:w-[45%] lg:w-[30%] hover:scale-105 bg-[#f3f3f3] p-5 flex flex-col justify-between gap-7'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-outfit text-gray-900 text-[20px] font-extrabold'>Fithub</h2>
                            <p className='text-gray-400 text-[11px] font-extrabold tracking-widest'>SKIP</p>
                        </div>
                        <div>
                            <img src={assets.welcome3} className='w-full h-[430px] object-contain' alt="welcome3" />
                        </div>
                        <div className='flex flex-col items-center justify-center gap-4 text-center'>
                            <h2 className='font-outfit text-gray-900 text-[30px] font-extrabold tracking-widest' style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>Ready, Set...</h2>
                            <p className='text-gray-400 text-[13px]'>Find the perfect fit for you</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <PiFolderStarDuotone size={26} />
                            <p className='text-[10px] font-extrabold text-gray-600 tracking-widest'>LET'S GO</p>
                            <div className="scale-x-150">
                                <IoIosArrowRoundForward className="text-3xl" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className='w-full'>
                <footer className="bg-gray-900 text-gray-300 py-10 px-6 mt-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                        {/* Left - Logo and Name */}
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white">Fithub</h2>
                            <p className="text-sm mt-1">Your fitness journey starts here</p>
                        </div>

                        {/* Middle - Navigation Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="hover:text-white transition">Home</a>
                            <a href="#" className="hover:text-white transition">Programs</a>
                            <a href="#" className="hover:text-white transition">About</a>
                            <a href="#" className="hover:text-white transition">Contact</a>
                        </div>

                        {/* Right - Social Icons */}
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white"><FaFacebookF /></a>
                            <a href="#" className="hover:text-white"><FaInstagram /></a>
                            <a href="#" className="hover:text-white"><FaTwitter /></a>
                        </div>
                    </div>

                    {/* Bottom - Copyright */}
                    <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
                        &copy; {new Date().getFullYear()} Fithub. All rights reserved.
                    </div>
                </footer>
            </div>


            {/* Floating Message Icon */}
            {

                userData?.role === "user" && <div
                    className='h-[50px] w-[50px] rounded-full fixed right-3 lg:right-10 bottom-10 flex items-center justify-center animate-bounceFast2 cursor-pointer z-50'
                    onClick={async () => {
                        setShowMessagePopup(true)
                        await assignDoctor()
                        getDeoctorMessages()
                    }}
                >
                    <TbMessages
                        className='w-full h-full text-[#5d1be5] scale-x-[-1]'
                        style={{ textShadow: "12px 12px 24px rgba(0, 0, 0, 0.3)" }}
                    />
                </div>
            }


            {/* Popup Modal */}
            {showMessagePopup && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setShowMessagePopup(false)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-50 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#5d1be5]">Chat With Doctor</h2>
                            <button
                                className="text-gray-500 hover:text-red-500 text-xl"
                                onClick={() => setShowMessagePopup(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className=" max-w-md mx-auto p-4 border text-center rounded-xl shadow-lg bg-gray-50">

                            <h2 className="text-center text-xl font-bold mb-4">Dr. {doctorName}</h2>
                            <p className='text-gray-400 text-xs italic font-extrabold mb-4'>Here you can ask this doctor about your BMI count, diet, health condition, workout plan, etc.
                                He will reply when he is available.</p>

                            <div className="h-[300px] max-h-[300px] overflow-y-scroll hide-scrollbar space-y-3 px-4 py-2 ">
                                {chatmMssage.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.isdoctor != true ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`px-3 py-2 rounded-2xl max-w-xs w-fit ${msg.isdoctor != true
                                                ? "bg-blue-400 text-white rounded-br-sm"
                                                : "bg-gray-200 text-gray-800 rounded-bl-sm"
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}

                                {/* Scroll-to-bottom anchor */}
                                <div ref={scrollRef} />
                            </div>


                            {/* Input Area (Optional Static Version) */}
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    onChange={(e) => setChatInput(e.target.value)}
                                    value={chatInput}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendMessage();
                                        }
                                    }}
                                    className="flex-1 px-3 py-1 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    className="text-sm bg-[#ff5520] text-white px-2 py-1 rounded-full"
                                    onClick={sendMessage}
                                >
                                    <IoMdSend />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHome;
