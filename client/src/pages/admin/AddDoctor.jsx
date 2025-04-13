import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineAddLink } from "react-icons/md";
import { AppContent } from '../../contexts/AppContext';
import { toast } from 'react-hot-toast';

const AddDoctor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        image: null,
        bio: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [doctorList, setDoctorList] = useState([]);
    const [loading, setLoading] = useState(false);

    const { backendUrl } = useContext(AppContent);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('bio', formData.bio);
        form.append('image', formData.image);

        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/admin/add-doctor`,
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );
            toast.success(data?.message);

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                image: null,
                bio: ''
            });
            setPreviewImage(null);
            setShowAddForm(false);
            GetDoctors();
        } catch (error) {
            console.error("Error adding doctor:", error);
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    const GetDoctors = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/admin/listDoctors`,
                { withCredentials: true }
            );
            console.log(data);

            setDoctorList(data || []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    useEffect(() => {
        GetDoctors();
    }, []);

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-screen relative'>
            <div className='flex items-center justify-center p-6'>
                <h2 className='text-3xl sm:text-5xl font-semibold text-gray-700'>View Doctors List</h2>
            </div>

            {/* Cards Section */}
            <div className='w-full flex flex-wrap items-center justify-center gap-5 p-6  overflow-y-auto'>
                {
                    doctorList && doctorList.length !== 0 ? (
                        doctorList.map((doctor, index) => (
                            <div
                                key={index}
                                className='relative w-[300px] h-[300px] hover:shadow-xl flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow transition-all duration-200'
                            >
                                <div className='flex flex-col items-center gap-4'>
                                    <img
                                        className='rounded-full h-[90px] w-[90px] object-cover'
                                        src={`${backendUrl}/${doctor.image}` || "https://via.placeholder.com/90"}
                                        alt={doctor.name}
                                    />
                                    <div className='w-full text-center'>
                                        <h2 className='text-xl font-semibold text-gray-700'>Dr. {doctor.name}</h2>
                                        <h3 className='text-md text-gray-600'>{doctor.email}</h3>
                                        <p className='text-sm text-gray-500 line-clamp-3'>{doctor.bio}</p>
                                    </div>
                                </div>
                                <div className='absolute top-3 right-3 text-gray-900 cursor-pointer'>
                                    <FaUserDoctor size={25} className='hover:scale-110 transition-transform duration-150' />
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1 className="text-xl font-medium text-gray-600">Doctors Not Found</h1>
                    )
                }
            </div>

            {/* Add Button */}
            <div
                className='absolute bottom-8 right-8 text-gray-700 hover:text-gray-900 animate-bounceFast2 text-3xl lg:text-5xl cursor-pointer'
                onClick={() => setShowAddForm(true)}
            >
                <MdOutlineAddLink className='hover:scale-110 transition-transform duration-150' />
            </div>

            {/* Add Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => {
                            setShowAddForm(false);
                            setFormData({
                                name: '',
                                email: '',
                                password: '',
                                image: null,
                                bio: ''
                            });
                            setPreviewImage(null);
                        }}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-50 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#5d1be5]">Add New Doctor</h2>
                            <button
                                className="text-gray-500 hover:text-red-500 text-xl"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        image: null,
                                        bio: ''
                                    });
                                    setPreviewImage(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <input
                                type="text"
                                name="name"
                                placeholder="Doctor Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                accept="image/*"
                                required
                            />

                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="h-[80px] w-[80px] object-cover rounded-full self-center"
                                />
                            )}

                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>

                            <button
                                type="submit"
                                className={`mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${loading && "opacity-70 pointer-events-none"}`}
                            >
                                {loading ? 'Adding...' : 'Add Doctor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddDoctor;
