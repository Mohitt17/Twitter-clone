import React, { useState } from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa"; // For the filled bookmarked state
import axios from "axios";
import { TWEET_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { bookmarkUpdate } from '../redux/userSlice';
import { timeSince } from "../utils/constant";

const Tweet = ({ tweet }) => {
    const { user, darkMode } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const dm = darkMode;

    // ── COMMENT STATE ──
    const [openComment, setOpenComment] = useState(false);
    const [commentText, setCommentText] = useState("");

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

    // ── NEW: BOOKMARK HANDLER ──
    const isBookmarked = user?.bookmarks?.includes(tweet?._id);

    const bookmarkHandler = async () => {
        try {
            const res = await axios.put(`${USER_API_END_POINT}/bookmark/${tweet?._id}`, { id: user?._id }, { withCredentials: true });
            dispatch(bookmarkUpdate(tweet?._id)); // instantly updates UI via Redux
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to bookmark");
        }
    }

    // ── NEW: COMMENT HANDLER ──
    const commentHandler = async () => {
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/comment/${tweet?._id}`, 
            { text: commentText, id: user?._id }, 
            { withCredentials: true });
            
            if(res.data.success){
                toast.success(res.data.message);
                setCommentText(""); 
                setOpenComment(false); 
                dispatch(getRefresh()); // Refreshes to get updated comment count
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment.");
        }
    }

    // tweet.userDetails[0] has the author info
    const author = tweet?.userDetails?.[0];

    return (
        <div className={`border-b ${dm ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className='flex p-4'>
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
                        
                        {/* ── COMMENT ICON ── */}
                        <div className='flex items-center'>
                            <div onClick={() => setOpenComment(!openComment)} className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-green-900' : 'hover:bg-green-100'}`}>
                                <FaRegComment size="18px" />
                            </div>
                            <p className='text-sm'>{tweet?.comments?.length || 0}</p>
                        </div>
                        
                        {/* ── LIKE ICON ── */}
                        <div className='flex items-center'>
                            <div onClick={() => likeOrDislikeHandler(tweet?._id)} className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-pink-900' : 'hover:bg-pink-100'}`}>
                                <CiHeart size="20px" className={tweet?.like?.includes(user?._id) ? "text-pink-500 font-bold" : ""} />
                            </div>
                            <p className='text-sm'>{tweet?.like?.length}</p>
                        </div>
                        
                        {/* ── BOOKMARK ICON ── */}
                        <div className='flex items-center'>
                            <div onClick={bookmarkHandler} className={`p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-yellow-900' : 'hover:bg-yellow-100'}`}>
                                {isBookmarked ? (
                                    <FaBookmark size="18px" className="text-yellow-500" />
                                ) : (
                                    <CiBookmark size="20px" />
                                )}
                            </div>
                        </div>

                        {/* ── DELETE ICON ── */}
                        {user?._id === tweet?.userId && (
                            <div onClick={() => deleteTweetHandler(tweet?._id)} className={`flex items-center p-2 rounded-full cursor-pointer ${dm ? 'hover:bg-red-900' : 'hover:bg-red-100'}`}>
                                <MdOutlineDeleteOutline size="20px" />
                            </div>
                        )}
                    </div>

                    {/* ── NEW: COMMENT INPUT BOX ── */}
                    {openComment && (
                        <div className={`mt-2 p-3 rounded-xl flex items-center gap-2 ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Post your reply"
                                className={`w-full outline-none bg-transparent text-sm ${dm ? 'text-white placeholder-gray-400' : 'text-black'}`}
                            />
                            <button 
                                onClick={commentHandler} 
                                className='bg-[#1D9BF0] text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50'
                                disabled={!commentText.trim()}
                            >
                                Reply
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Tweet;