import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TWEET_API_END_POINT } from '../utils/constant';
import { useSelector } from 'react-redux';
import Tweet from './Tweet';

const Bookmarks = () => {
    const { user, darkMode } = useSelector(store => store.user);
    const [bookmarkedTweets, setBookmarkedTweets] = useState([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await axios.get(`${TWEET_API_END_POINT}/bookmarks/${user?._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setBookmarkedTweets(res.data.tweets);
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        if (user?._id) {
            fetchBookmarks();
        }
    }, [user?._id, user?.bookmarks]); // Re-fetch if bookmarks array changes

    return (
        <div className={`w-[50%] border-l border-r h-screen overflow-y-auto ${darkMode ? 'border-gray-700 bg-black text-white' : 'border-gray-200 bg-white'}`}>
            <div className={`flex items-center pb-2 pt-2 px-4 border-b sticky top-0 z-10 backdrop-blur-md ${darkMode ? 'border-gray-700 bg-black/80' : 'border-gray-200 bg-white/80'}`}>
                <h1 className='text-xl font-bold'>Bookmarks</h1>
            </div>

            <div className="flex flex-col">
                {bookmarkedTweets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <h1 className="text-2xl font-bold mb-2">Save Tweets for later</h1>
                        <p>Don't let the good ones fly away! Bookmark Tweets to easily find them again in the future.</p>
                    </div>
                ) : (
                    bookmarkedTweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
                )}
            </div>
        </div>
    );
};

export default Bookmarks;