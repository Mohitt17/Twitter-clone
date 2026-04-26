import React, { useState } from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, getUser, toggleDarkMode } from '../redux/userSlice';
import Avatar from "react-avatar";

const LeftSidebar = () => {
    const { user, darkMode } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showMore, setShowMore] = useState(false);
    const dm = darkMode;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            navigate('/login');
            toast.success(res.data.message);
        } catch (error) { console.log(error); }
    }

    const navClass = `flex items-center my-1 px-4 py-2 rounded-full cursor-pointer ${dm ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`;

    return (
        <div className={`w-[20%] flex flex-col h-screen sticky top-0 ${dm ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className='flex-1'>
                <div className='mt-2 mb-1 ml-5'>
                    <img width={"40px"} src="https://upload.wikimedia.org/wikipedia/commons/7/71/Twitter_Logo_Blue_%282%29.png" alt="twitter-logo" />
                </div>
                <div className='my-2'>
                    <Link to="/" className={navClass}><CiHome size="24px" /><h1 className='font-bold text-lg ml-2'>Home</h1></Link>
                    <div className={navClass}><CiHashtag size="24px" /><h1 className='font-bold text-lg ml-2'>Explore</h1></div>
                    <div className={navClass}><IoIosNotificationsOutline size="24px" /><h1 className='font-bold text-lg ml-2'>Notifications</h1></div>
                    <Link to={`/profile/${user?._id}`} className={navClass}><CiUser size="24px" /><h1 className='font-bold text-lg ml-2'>Profile</h1></Link>
                    
                    {/* ── UPDATED BOOKMARKS LINK ── */}
                    <Link to="/bookmarks" className={navClass}>
                        <CiBookmark size="24px" />
                        <h1 className='font-bold text-lg ml-2'>Bookmarks</h1>
                    </Link>

                    <div onClick={logoutHandler} className={navClass}><AiOutlineLogout size="24px" /><h1 className='font-bold text-lg ml-2'>Logout</h1></div>

                    {/* More → Dark mode toggle */}
                    <div className='relative'>
                        <div onClick={() => setShowMore(!showMore)} className={navClass}>
                            <BsThreeDots size="22px" />
                            <h1 className='font-bold text-lg ml-2'>More</h1>
                        </div>
                        {showMore && (
                            <div className={`absolute bottom-14 left-0 w-56 rounded-2xl shadow-2xl border z-50 ${dm ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <div
                                    onClick={() => { dispatch(toggleDarkMode()); setShowMore(false); }}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-2xl font-semibold ${dm ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                                >
                                    {dm ? <MdOutlineLightMode size="20px" /> : <MdOutlineDarkMode size="20px" />}
                                    <span>{dm ? 'Light mode' : 'Dark mode'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className='px-4 py-2 bg-[#1D9BF0] w-full rounded-full text-white font-bold mt-2'>Post</button>
                </div>
            </div>

            {/* Bottom profile card */}
            <div className='mb-4 px-1'>
                <Link to={`/profile/${user?._id}`} className={`flex items-center px-3 py-3 rounded-full cursor-pointer ${dm ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
                    <Avatar src={user?.profilePhoto || ""} name={user?.name} size="40" round={true} />
                    <div className='ml-2 flex-1 min-w-0'>
                        <h1 className='font-bold text-sm truncate'>{user?.name}</h1>
                        <p className='text-gray-500 text-sm truncate'>{`@${user?.username}`}</p>
                    </div>
                    <span className='text-gray-500 font-bold'>···</span>
                </Link>
            </div>
        </div>
    )
}
export default LeftSidebar;