import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT, TWEET_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import EditProfile from './EditProfile';
import { timeSince } from '../utils/constant';
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";

const Profile = () => {
    const { user, profile, darkMode } = useSelector(store => store.user);
    const { id } = useParams();
    useGetProfile(id);
    const dispatch = useDispatch();
    const [showEditModal, setShowEditModal] = useState(false);
    const dm = darkMode;

    const followAndUnfollowHandler = async () => {
        if (user.following.includes(id)) {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) { toast.error(error.response.data.message); }
        } else {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) { toast.error(error.response.data.message); }
        }
    };

    const deleteTweetHandler = async (tweetId) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${tweetId}`);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) { toast.error(error?.response?.data?.message); }
    };

    const likeHandler = async (tweetId) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${tweetId}`, { id: user?._id }, { withCredentials: true });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) { console.log(error); }
    };

    const isOwnProfile = profile?._id === user?._id;

    return (
        <>
            <div className={`w-[50%] border-l border-r overflow-y-auto ${dm ? 'border-gray-700 bg-black text-white' : 'border-gray-200 bg-white text-black'}`}>

                {/* Sticky Header */}
                <div className={`flex items-center py-2 px-4 sticky top-0 z-10 backdrop-blur ${dm ? 'bg-black bg-opacity-80' : 'bg-white bg-opacity-90'}`}>
                    <Link to="/" className={`p-2 rounded-full ${dm ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-4'>
                        <h1 className='font-bold text-lg leading-tight'>{profile?.name}</h1>
                        <p className='text-gray-500 text-sm'>{profile?.tweets?.length ?? 0} posts</p>
                    </div>
                </div>

                {/* Banner */}
                <div className='h-40 relative overflow-hidden'>
                    {profile?.bannerPhoto
                        ? <img src={profile.bannerPhoto} alt="banner" className='w-full h-full object-cover' />
                        : <div className='w-full h-full bg-gradient-to-r from-blue-400 to-blue-600' />
                    }
                </div>

                {/* Avatar + Edit/Follow */}
                <div className='flex items-end justify-between px-4 -mt-10 mb-2'>
                    <div className='border-4 border-white dark:border-black rounded-full'>
                        <Avatar
                            src={profile?.profilePhoto || ""}
                            name={profile?.name}
                            size="80"
                            round={true}
                        />
                    </div>
                    {isOwnProfile ? (
                        <button
                            onClick={() => setShowEditModal(true)}
                            className={`px-4 py-1.5 rounded-full border font-semibold text-sm transition-colors ${dm ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-400 hover:bg-gray-100'}`}
                        >
                            Edit profile
                        </button>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            className='px-4 py-1.5 bg-black text-white rounded-full font-semibold text-sm hover:bg-gray-800'
                        >
                            {user.following.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className='px-4 mb-3'>
                    <h1 className='font-bold text-xl'>{profile?.name}</h1>
                    <p className='text-gray-500 text-sm mb-1'>{`@${profile?.username}`}</p>
                    {profile?.bio && <p className='text-sm mb-2'>{profile.bio}</p>}
                    {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noreferrer" className='text-[#1D9BF0] text-sm hover:underline'>
                            🌐 {profile.website}
                        </a>
                    )}
                    <div className='flex gap-4 mt-2 text-sm'>
                        <span><strong>{profile?.following?.length ?? 0}</strong> <span className='text-gray-500'>Following</span></span>
                        <span><strong>{profile?.followers?.length ?? 0}</strong> <span className='text-gray-500'>Followers</span></span>
                    </div>
                </div>

                {/* Posts Tab */}
                <div className={`border-b px-4 pb-2 ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className='font-bold border-b-4 border-blue-500 pb-2 text-sm'>Posts</span>
                </div>

                {/* User's Tweets */}
                {profile?.tweets?.length === 0 && (
                    <p className='text-center text-gray-500 mt-10'>No posts yet.</p>
                )}
                {profile?.tweets?.map((tweet) => (
                    <div key={tweet._id} className={`border-b px-4 py-3 ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className='flex gap-3'>
                            <Avatar
                                src={profile?.profilePhoto || ""}
                                name={profile?.name}
                                size="40"
                                round={true}
                            />
                            <div className='flex-1'>
                                <div className='flex items-center gap-1 flex-wrap'>
                                    <span className='font-bold text-sm'>{profile?.name}</span>
                                    <span className='text-gray-500 text-xs'>{`@${profile?.username} · ${timeSince(tweet?.createdAt)}`}</span>
                                </div>
                                <p className='text-sm mt-1'>{tweet?.description}</p>
                                <div className='flex gap-6 mt-2'>
                                    <div className='flex items-center gap-1 cursor-pointer text-gray-500 hover:text-green-500'>
                                        <FaRegComment size="16px" /><span className='text-xs'>0</span>
                                    </div>
                                    <div onClick={() => likeHandler(tweet._id)} className='flex items-center gap-1 cursor-pointer text-gray-500 hover:text-pink-500'>
                                        <CiHeart size="18px" /><span className='text-xs'>{tweet?.like?.length ?? 0}</span>
                                    </div>
                                    {isOwnProfile && (
                                        <div onClick={() => deleteTweetHandler(tweet._id)} className='flex items-center cursor-pointer text-gray-500 hover:text-red-500'>
                                            <MdOutlineDeleteOutline size="18px" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showEditModal && <EditProfile user={user} onClose={() => setShowEditModal(false)} />}
        </>
    );
};

export default Profile;