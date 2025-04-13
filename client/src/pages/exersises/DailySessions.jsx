import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContent } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { TbClockCancel } from "react-icons/tb";
import { FaX } from 'react-icons/fa6';
import { FaTrash } from "react-icons/fa";
import { BiSolidBookAdd } from "react-icons/bi";
import { GoSmiley } from "react-icons/go";
import { LuTimerReset } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PiMaskSadLight } from "react-icons/pi";

const DailySessions = () => {
    const [toggles, setToggles] = useState([]); // Initially empty
    //const [toggles, setToggles] = useState(Array(10).fill(false)); 
    const [showMessagePopup, setShowMessagePopup] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showFormPopup, setShowFormPopup] = useState(false);
    const [formData, setFormData] = useState({
        workoutName: "",
        instruction1: "",
        instruction2: "",
        instruction3: "",
        repetitions: "",
        description: "",
        workoutImage: null,
        workoutGif: null,
    });
    const [daySelectedIndex, setDaySelectedIndex] = useState(1)
    const [Drefresh, setDrefresh] = useState(false)
    const [workoutList, setWorkoutList] = useState(null)
    const [completepersentage, setCompletionPersantage] = useState(0)


    const { userData, backendUrl, refresh, setRefresh } = useContext(AppContent);

    const navigate = useNavigate();


    const handleToggle = async (e, index, wrkId) => {
        e.stopPropagation();
        const updatedToggles = [...toggles];
        updatedToggles[index] = !updatedToggles[index];
        setToggles(updatedToggles);

        try {
            const { data } = await axios.get(
                `${backendUrl}/setUserTasks/${wrkId}/${daySelectedIndex}`, { withCredentials: true }
            );
            console.log("setUserTasks", data);
            if (data?.message === "Pending") {
                toast(`Task ${(index + 1)} marked as pending 💤`, {
                    icon: "⏳",
                });

            } else {
                toast.success("Now Task " + (index + 1) + " " + data?.message)
            }

            const truethValues = updatedToggles.filter(item => item === true);

            const completionPercentage = (truethValues.length / workoutList.workouts.length) * 100;

            console.log("Boyyyeeee", completionPercentage);


            setCompletionPersantage(completionPercentage)

        } catch (error) {
            console.log(error);

        }
    };

    const handleCardClick = (index) => {
        setSelectedIndex(index);
        setShowMessagePopup(true);
    };


    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Prevent NaN by setting a fallback
    const safeCompletion = isNaN(completepersentage) ? 0 : completepersentage;
    const strokeDashoffset = circumference - (safeCompletion / 100) * circumference;

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    useEffect(() => {
        //console.log("userData userData", userData);
        getUserWorkoutList(daySelectedIndex)
        //console.log("Selected index changed to:", daySelectedIndex);
    }, [daySelectedIndex, Drefresh]);



    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("workoutName", formData.workoutName);
            formDataToSend.append("instruction1", formData.instruction1);
            formDataToSend.append("instruction2", formData.instruction2);
            formDataToSend.append("instruction3", formData.instruction3);
            formDataToSend.append("repetitions", formData.repetitions);
            formDataToSend.append("description", formData.description);
            if (formData.workoutImage) {
                formDataToSend.append("workoutImage", formData.workoutImage);
            }
            if (formData.workoutGif) {
                formDataToSend.append("workoutGif", formData.workoutGif);
            }

            const { data } = await axios.post(
                `${backendUrl}/admin/addWorkoutList/${daySelectedIndex}`,
                formDataToSend,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setFormData({
                workoutName: "",
                instruction1: "",
                instruction2: "",
                instruction3: "",
                repetitions: "",
                description: "",
                workoutImage: null,
                workoutGif: null,
            });

            toast.success(data?.message);
            setDrefresh(!Drefresh);
            setShowFormPopup(false);

        } catch (error) {
            console.log(error);
        }
    };


    const userchoosenDau = async (index) => {
        setDaySelectedIndex(index)

        try {
            const { data } = await axios.patch(
                `${backendUrl}/updateWorkPage/${index}`, {}, { withCredentials: true }
            );
            //  console.log(data);

        } catch (error) {
            console.log(error);

        }

    }

    const getUserWorkoutList = async (page) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/getUserWorkoutList/${page}`,
                { withCredentials: true }
            );

            if (!data?.success) {
                console.log("Workout not found or error:", data);
                setWorkoutList(null); // optional: clear previous workouts
                setToggles([]);
                setCompletionPersantage(0);
                return;
            }

            setWorkoutList(data.workouts);

            const workouts = data?.workouts?.workouts || [];
            const activedToggles = workouts.map(item => !!item.isActived);
            const completedCount = activedToggles.filter(Boolean).length;
            const completionPercentage = (completedCount / workouts.length) * 100;

            setToggles(activedToggles);
            setCompletionPersantage(completionPercentage);

            console.log("Toggles:", activedToggles);
            console.log("Completion %:", completionPercentage.toFixed(2));

        } catch (error) {
            console.error("Error fetching workouts:", error);
            // Optionally show a toast
            toast.error("Failed to load workout list");
        }
    };



    const deleteWorkout = async (day, id) => {
        //console.log("Day", day, "ID", id);
        try {
            const { data } = await axios.patch(
                `${backendUrl}/admin/deletWorkout`, { day: day, Id: id }, { withCredentials: true }
            );
            // console.log("Deleteee, data");
            setDrefresh(!Drefresh)
            toast.success(data?.message)

        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {
        setDaySelectedIndex(userData?.wrkpage)
        getUserWorkoutList(userData?.wrkpage)
        //e.log("Selected index changed to:", daySelectedIndex);
    }, []);

    return (
        <div className='flex flex-col items-center justify-center px-4 text-gray-800 relative p-6'>
            {/* Greeting Section */}
            <div className='relative w-auto flex flex-col items-center justify-center h-auto mt-10 lg:mt-20'>
                <div className='text-center flex flex-col items-center justify-center'>
                    <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Hey {userData?.role === "admin" ? "Admin" : userData.name}, Welcome to {userData?.role === "admin" ? "Mannaging" : "Daily"}  Session</h2>
                    <p className='text-gray-600 mb-8 max-w-xl italic text-sm sm:text-base'>
                        {userData?.role === "admin" ? '"Here you can add or delete user workout details, upload the workout name, repetitions, description, workout image, and workout GIF. A white background leads to a better user experience."' :
                            '"Every time you show up and give your best, you’re proving to yourself that you’re capable of so much more than you ever imagined."'}
                    </p>
                </div>
                {
                    userData?.role === "user" && (
                        <div className='mt-6'>
                            <div className="w-[130px] h-[130px] relative flex items-center justify-center text-center">
                                <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                                    {/* Background circle */}
                                    <circle
                                        stroke="#e5e7eb"
                                        fill="transparent"
                                        strokeWidth={stroke}
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                    />
                                    {/* Foreground progress circle */}
                                    <circle
                                        stroke="#ff5520"
                                        fill="transparent"
                                        strokeWidth={stroke}
                                        strokeLinecap="round"
                                        strokeDasharray={`${circumference} ${circumference}`}
                                        strokeDashoffset={strokeDashoffset}
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                    />
                                </svg>
                                {/* Percentage text */}
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#5d1be5]">
                                    {`${Math.round(safeCompletion)}%`}
                                </div>
                            </div>
                        </div>
                    )
                }


            </div>

            <div className='h-[50px] px-5 flex items-center justify-center gap-3 my-5 w-full lg:w-[1380px] relative '>
                <div
                    className='h-full w-12 sm:w-16  bg-gradient-to-r from-[#ffff] absolute left-0 
                    flex items-center justify-center z-10 cursor-pointer hover:scale-125'
                    onClick={scrollLeft}
                >
                    <IoIosArrowBack size={35} className='text-[#5d1be5]' />
                </div>

                <div
                    ref={scrollRef}
                    className='flex items-center gap-6 overflow-x-auto max-w-7xl hide-scrollbar px-2 ml-5 sm:ml-0'
                >
                    {Array(30).fill().map((_, index) => (
                        <div
                            key={index}
                            className={`w-[10px] lg:w-[30px] px-3 lg:px-4 py-1 lg:py-2 rounded-full bg-[#ff5520] flex items-center justify-center 
            text-[16px] ${daySelectedIndex === index + 1 ? "border-4 border-[#5d1be5]" : ""} text-white  cursor-pointer font-extrabold whitespace-nowrap`}
                            onClick={() => {
                                userchoosenDau(index + 1)
                            }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                <div
                    className='h-full w-12 sm:w-16 p-2 bg-gradient-to-l from-[#ffff] absolute right-0 flex items-center
                     justify-center z-10 cursor-pointer hover:scale-125'
                    onClick={scrollRight}
                >
                    <IoIosArrowForward size={35} className='text-[#5d1be5]' />
                </div>
            </div>

            {/* Workout Sessions List */}
            <div className='w-full h-auto flex flex-col items-center justify-center p-5  gap-9' >

                <div className=' max-w-5xl lg:max-w-7xl w-full  flex items-center'>
                    <h1 className='text-lg sm:text-3xl font-semibold text-[#5d1be5]'>Day {daySelectedIndex}</h1>
                </div>
                {
                    workoutList && workoutList?.workouts && workoutList?.workouts.length != 0 ? <>
                        {workoutList?.workouts.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className='relative w-full cursor-pointer max-w-5xl lg:max-w-7xl h-auto bg-gray-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-6 hover:bg-gray-200 mb-5 opacity-0 animate-show'
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {/* Image */}
                                <div className="flex-shrink-0">
                                    <img className='w-[250px] h-[150px] rounded-xl object-cover' src={`${backendUrl}/uploads/workouts/${item?.workoutImage}`} alt="Pushup" />
                                </div>

                                {/* Middle Content */}
                                <div className='flex-1 w-[250px] h-[150px] bg-white rounded-xl flex flex-col items-center justify-center relative p-4'>
                                    <h2 className='text-md sm:text-[22px] font-extrabold mb-2 text-center' style={{ letterSpacing: "5px", wordSpacing: "8px" }}>
                                        {item?.name}
                                    </h2>
                                    <p className='text-gray-500 text-[12px] sm:text-sm max-w-[800px] italic text-center line-clamp-3 lg:line-clamp-2'>
                                        {item?.description}
                                    </p>
                                    <div className='pt-8 lg:pt-5 w-full'>
                                        <TbClockCancel size={22} color='gray' className='absolute bottom-3 left-3' />
                                        <div className='absolute bottom-3 right-3'>
                                            <p className='text-gray-500 font-bold text-xs sm:text-sm'>{item?.rep}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Toggle */}
                                <div className='w-[250px] md:w-[180px] h-[150px] rounded-xl bg-white flex flex-col items-center justify-center p-2'>
                                    <h2 className='text-lg sm:text-xl font-semibold mb-4'>Task {index + 1}</h2>
                                    <div className="flex items-center justify-center">
                                        {
                                            userData?.role != "admin" ? (
                                                <button
                                                    onClick={(e) => handleToggle(e, index, item?._id)}
                                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${toggles[index] ? 'bg-purple-700' : 'bg-gray-400'
                                                        }`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${toggles[index] ? 'translate-x-6' : ''
                                                        }`} />
                                                </button>
                                            ) : (
                                                <button disabled
                                                    onClick={(e) => handleToggle(e, index)}
                                                    className={`opacity-20 w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${toggles[index] ? 'bg-purple-700' : 'bg-gray-400'
                                                        }`}
                                                >
                                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${toggles[index] ? 'translate-x-6' : ''
                                                        }`} />
                                                </button>
                                            )
                                        }

                                    </div>
                                </div>

                                {/* Trash Icon (for user role) */}
                                {userData?.role === "admin" && (
                                    <div
                                        className='absolute top-4 right-4 font-extrabold cursor-pointer text-red-500 z-50'
                                        onClick={(e) => {
                                            e.stopPropagation(); // ⛔ stop click from bubbling to parent
                                            deleteWorkout(daySelectedIndex, item._id);
                                        }}
                                    >
                                        <FaTrash className='hover:scale-110' size={16} />
                                    </div>
                                )}
                            </div>
                        ))}

                    </> :
                        <>
                            <div className='flex items-center justify-between gap-7 '>
                                <h2 className='text-xl sm:text-3xl font-semibold' style={{ letterSpacing: "5px" }}>Nothing Found</h2>
                                <PiMaskSadLight size={40} />
                            </div>
                        </>
                }
                {
                    userData?.role === "admin" &&
                    <div onClick={() => setShowFormPopup(true)} className='absolute bottom-1 lg:bottom-5 right-8 cursor-pointer  lg:right-10  text-[40px] lg:text-[46px] pt-6 lg:pt-2 text-[#5d1be5]'>
                        <BiSolidBookAdd className='hover:scale-110 ' />
                    </div>
                }

            </div>

            {/* Message Popup Modal */}
            {showMessagePopup && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center z-50 ">
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowMessagePopup(false)}></div>

                    <div className="relative bg-gray-50 rounded-2xl shadow-xl p-6 w-[90%] max-w-3xl z-50 animate-fadeIn overflow-y-auto ">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-red-500">Task {selectedIndex + 1}</h2>
                            <button className="text-gray-500 hover:text-red-500 text-xl" onClick={() => setShowMessagePopup(false)}>✕</button>
                        </div>
                        <div className="mx-auto p-4 text-center bg-white">
                            <h2 className="text-3xl font-bold text-[#5d1be5]">{workoutList?.workouts[selectedIndex].name}</h2>
                        </div>
                        <div className='w-full flex flex-col lg:flex-row items-center justify-center bg-white'>
                            <div className='w-[70%] lg:w-[50%] p-3'>
                                <img src={`${backendUrl}/uploads/workouts/${workoutList?.workouts[selectedIndex].workoutGif}`} className='w-full h-auto' alt="Push-up" />
                            </div>
                            <div className='w-[70%] lg:w-[50%] p-3 flex flex-col items-center justify-center gap-5'>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-600">Instructions</h2>
                                </div>
                                <div>
                                    <ol className='list-decimal list-inside text-gray-400 space-y-3'>
                                        {
                                            workoutList?.workouts[selectedIndex].inst.map((inItem, index) => (
                                                <li className='line-clamp-2' key={index}>{index + 1}. {inItem}</li>
                                            ))
                                        }
                                    </ol>
                                </div>
                                <div className='w-full flex items-center justify-between'>
                                    <h2 className='text-xl font-bold text-gray-500 line-clamp-1'>
                                        {workoutList?.workouts[selectedIndex].rep}
                                    </h2>
                                    <LuTimerReset size={20} color='gray' />
                                </div>
                                <div>
                                    <h2 className='text-xs  italic text-gray-500 flex items-center justify-center gap-3' style={{ letterSpacing: "2px" }}>
                                        Have a nice day,Thank you <GoSmiley />
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {showFormPopup && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowFormPopup(false)}></div>
                    <form
                        onSubmit={handleSubmit}
                        className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-2xl z-50 animate-fadeIn space-y-4"
                        encType="multipart/form-data"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-gray-700">Customize Workout</h2>
                            <div className="flex items-center justify-center gap-20">
                                <h2 className="text-lg font-bold text-gray-700 flex">TAB NO. {daySelectedIndex}</h2>
                                <button type="button" className="text-gray-500 hover:text-red-500 text-xl" onClick={() => setShowFormPopup(false)}>✕</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <label className="lg:font-extrabold">Workout Name</label>
                                <input name="workoutName" value={formData.workoutName} onChange={handleInputChange} placeholder="Workout Name" className="w-full border p-2 rounded-lg" required />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <label className="lg:font-extrabold">Workout Image</label>
                                <input name="workoutImage" type="file" onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                            </div>
                        </div>

                        <input name="instruction1" value={formData.instruction1} onChange={handleInputChange} placeholder="Instruction 1" className="w-full border p-2 rounded-lg" required />
                        <input name="instruction2" value={formData.instruction2} onChange={handleInputChange} placeholder="Instruction 2" className="w-full border p-2 rounded-lg" required />
                        <input name="instruction3" value={formData.instruction3} onChange={handleInputChange} placeholder="Instruction 3" className="w-full border p-2 rounded-lg" required />
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Workout Description" className="w-full lg:h-[100px] border p-2 rounded-lg" required />

                        <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <label className="lg:font-extrabold">Repetitions</label>
                                <input name="repetitions" value={formData.repetitions} onChange={handleInputChange} placeholder="Repetitions (e.g., 15 / 3)" className="w-full border p-2 rounded-lg" required />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <label className="lg:font-extrabold">Workout GIF</label>
                                <input name="workoutGif" type="file" onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DailySessions;
