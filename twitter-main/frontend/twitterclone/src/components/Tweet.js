import React from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { timeSince } from "../utils/constant";

const Tweet = ({ tweet }) => {
    const { user, darkMode } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const dm = darkMode;

    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, { withCredentials: true });
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    // tweet.userDetails[0] has the author info
    const author = tweet?.userDetails?.[0];

    return (
        <div className={`border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className='flex p-4'>
                {/* ← Correct avatar: uses author's profilePhoto with name fallback */}
                <Avatar
                    src={author?.profilePhoto || ""}
                    name={author?.name}
                    size="40"
                    round={true}
                />
                <div className='ml-2 w-full'>
                    <div className='flex items-center'>
                        <h1 className='font-bold text-sm'>{author?.name}</h1>
                        <p className='text-gray-500 text-xs ml-1'>{`@${author?.username} · ${timeSince(tweet?.createdAt)}`}</p>
                    </div>
                    <p className='mt-1 text-sm'>{tweet?.description}</p>
                    <div className='flex justify-between my-3'>
                        <div className='flex items-center'>
                            <div className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-green-900' : 'hover:bg-green-100'}`}>
                                <FaRegComment size="18px" />
                            </div>
                            <p className='text-sm'>0</p>
                        </div>
                        <div className='flex items-center'>
                            <div onClick={() => likeOrDislikeHandler(tweet?._id)} className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-pink-900' : 'hover:bg-pink-100'}`}>
                                <CiHeart size="20px" />
                            </div>
                            <p className='text-sm'>{tweet?.like?.length}</p>
                        </div>
                        <div className='flex items-center'>
                            <div className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-yellow-900' : 'hover:bg-yellow-100'}`}>
                                <CiBookmark size="20px" />
                            </div>
                            <p className='text-sm'>0</p>
                        </div>
                        {user?._id === tweet?.userId && (
                            <div onClick={() => deleteTweetHandler(tweet?._id)} className={`flex items-center p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-red-900' : 'hover:bg-red-100'}`}>
                                <MdOutlineDeleteOutline size="20px" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet;