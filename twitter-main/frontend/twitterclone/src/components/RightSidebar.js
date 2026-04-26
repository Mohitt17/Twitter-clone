import React from 'react'
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';

// Static trending data — replace with API call if you add a trends endpoint
const TRENDS = [
    { category: "Sports · Trending", tag: "#IPL2025", posts: "125K" },
    { category: "Technology · Trending", tag: "#ReactJS", posts: "48.2K" },
    { category: "India · Trending", tag: "#Mumbai", posts: "32.1K" },
    { category: "Sports · Trending", tag: "#ViratKohli", posts: "210K" },
    { category: "Trending in India", tag: "#BCCI", posts: "19.4K" },
];

const RightSidebar = ({ otherUsers }) => {
    return (
        <div className='w-[25%] py-2'>
            {/* Search Bar */}
            <div className='flex items-center p-2 bg-gray-100 rounded-full outline-none w-full mb-4'>
                <CiSearch size="20px" />
                <input
                    type="text"
                    className='bg-transparent outline-none px-2 w-full'
                    placeholder='Search'
                />
            </div>

            {/* Trending Section */}
            <div className='bg-gray-100 rounded-2xl mb-4'>
                <h1 className='font-bold text-xl px-4 pt-4 pb-2'>What's happening</h1>
                {TRENDS.map((trend, index) => (
                    <div
                        key={index}
                        className='flex items-start justify-between px-4 py-3 hover:bg-gray-200 cursor-pointer transition-colors'
                    >
                        <div>
                            <p className='text-gray-500 text-xs'>{trend.category}</p>
                            <h2 className='font-bold text-sm'>{trend.tag}</h2>
                            <p className='text-gray-500 text-xs'>{trend.posts} posts</p>
                        </div>
                        <div className='text-gray-400 text-lg cursor-pointer hover:text-gray-600'>···</div>
                    </div>
                ))}
                <div className='px-4 py-3 text-[#1D9BF0] hover:bg-gray-200 cursor-pointer rounded-b-2xl text-sm'>
                    Show more
                </div>
            </div>

            {/* Who to Follow */}
            <div className='bg-gray-100 rounded-2xl'>
                <h1 className='font-bold text-xl px-4 pt-4 pb-2'>Who to follow</h1>
                {otherUsers?.map((user) => (
                    <div key={user?._id} className='flex items-center justify-between px-4 py-3 hover:bg-gray-200 transition-colors'>
                        <div className='flex items-center'>
                            <Avatar
                                src={user?.profilePhoto || ""}
                                name={user?.name}
                                size="40"
                                round={true}
                            />
                            <div className='ml-2'>
                                <h1 className='font-bold text-sm'>{user?.name}</h1>
                                <p className='text-gray-500 text-xs'>{`@${user?.username}`}</p>
                            </div>
                        </div>
                        <Link to={`/profile/${user?._id}`}>
                            <button className='px-4 py-1 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors'>
                                Profile
                            </button>
                        </Link>
                    </div>
                ))}
                <div className='px-4 py-3 text-[#1D9BF0] hover:bg-gray-200 cursor-pointer rounded-b-2xl text-sm'>
                    Show more
                </div>
            </div>

            {/* Footer links */}
            <div className='mt-4 px-2 flex flex-wrap gap-x-2 gap-y-1'>
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility", "Ads info", "More"].map((link) => (
                    <span key={link} className='text-gray-500 text-xs hover:underline cursor-pointer'>
                        {link}
                    </span>
                ))}
                <span className='text-gray-500 text-xs'>© 2025 X Clone</span>
            </div>
        </div>
    )
}

export default RightSidebar