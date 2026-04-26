import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import Bookmarks from './Bookmarks'; // ← NEW IMPORT

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
            children:[
                {
                    path:"/",
                    element:<Feed/>
                },
                {
                    path:"/profile/:id",
                    element:<Profile/>
                },
                // ── NEW ROUTE ──
                {
                    path:"/bookmarks",
                    element:<Bookmarks/>
                }
            ]
        },
        {
            path: "/login",
            element: <Login />
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body;