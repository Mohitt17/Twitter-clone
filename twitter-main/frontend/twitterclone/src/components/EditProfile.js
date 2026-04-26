import React, { useState, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import Avatar from "react-avatar";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUser } from '../redux/userSlice';

const EditProfile = ({ user, onClose }) => {
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [website, setWebsite] = useState(user?.website || "");
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "");
    const [bannerPhoto, setBannerPhoto] = useState(user?.bannerPhoto || "");
    const [profilePreview, setProfilePreview] = useState(user?.profilePhoto || "");
    const [bannerPreview, setBannerPreview] = useState(user?.bannerPhoto || "");
    const [loading, setLoading] = useState(false);

    const profileInputRef = useRef();
    const bannerInputRef = useRef();
    const dispatch = useDispatch();

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePreview(reader.result);
            setProfilePhoto(reader.result); // base64 — adjust if your backend expects a file upload
        };
        reader.readAsDataURL(file);
    };

    const handleBannerPhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerPreview(reader.result);
            setBannerPhoto(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const saveHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.put(
                `${USER_API_END_POINT}/update/${user?._id}`,
                { name, bio, website, profilePhoto, bannerPhoto },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                dispatch(getUser(res.data.user));
                toast.success("Profile updated!");
                onClose();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
            console.log(error);
        }
        setLoading(false);
    };

    return (
        // Backdrop
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
            <div className='bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-xl'>

                {/* Modal Header */}
                <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
                    <div className='flex items-center gap-6'>
                        <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full'>
                            <IoMdClose size="22px" />
                        </button>
                        <h1 className='font-bold text-lg'>Edit profile</h1>
                    </div>
                    <button
                        onClick={saveHandler}
                        disabled={loading}
                        className='px-5 py-1.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60'
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* Banner Photo */}
                <div className='relative h-36 bg-gray-300 cursor-pointer' onClick={() => bannerInputRef.current.click()}>
                    {bannerPreview ? (
                        <img src={bannerPreview} alt="banner" className='w-full h-full object-cover' />
                    ) : (
                        <div className='w-full h-full bg-gray-300' />
                    )}
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
                        <CiCamera size="28px" className='text-white' />
                    </div>
                    <input ref={bannerInputRef} type="file" accept="image/*" className='hidden' onChange={handleBannerPhotoChange} />
                </div>

                {/* Profile Photo */}
                <div className='relative px-4 -mt-10 mb-4'>
                    <div
                        className='relative w-20 h-20 cursor-pointer rounded-full border-4 border-white'
                        onClick={() => profileInputRef.current.click()}
                    >
                        <Avatar
                            src={profilePreview || ""}
                            name={user?.name}
                            size="76"
                            round={true}
                        />
                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full'>
                            <CiCamera size="22px" className='text-white' />
                        </div>
                        <input ref={profileInputRef} type="file" accept="image/*" className='hidden' onChange={handleProfilePhotoChange} />
                    </div>
                </div>

                {/* Form Fields */}
                <div className='px-4 pb-6 space-y-4'>
                    {/* Name */}
                    <div className='border border-gray-300 rounded-md px-3 pt-2 pb-1 focus-within:border-blue-500 transition-colors'>
                        <label className='text-xs text-gray-500'>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                            className='w-full outline-none text-base mt-0.5'
                        />
                        <p className='text-right text-xs text-gray-400'>{name.length}/50</p>
                    </div>

                    {/* Bio */}
                    <div className='border border-gray-300 rounded-md px-3 pt-2 pb-1 focus-within:border-blue-500 transition-colors'>
                        <label className='text-xs text-gray-500'>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={160}
                            rows={3}
                            className='w-full outline-none text-base mt-0.5 resize-none'
                            placeholder='Tell the world about yourself'
                        />
                        <p className='text-right text-xs text-gray-400'>{bio.length}/160</p>
                    </div>

                    {/* Website */}
                    <div className='border border-gray-300 rounded-md px-3 pt-2 pb-1 focus-within:border-blue-500 transition-colors'>
                        <label className='text-xs text-gray-500'>Website</label>
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className='w-full outline-none text-base mt-0.5'
                            placeholder='https://yourwebsite.com'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;