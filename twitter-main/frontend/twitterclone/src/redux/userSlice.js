import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        otherUsers:null,
        profile:null,
        darkMode:false,   
    },
    reducers:{
        getUser:(state,action)=>{
            state.user = action.payload;
        },
        getOtherUsers:(state,action)=>{
            state.otherUsers = action.payload;
        },
        getMyProfile:(state,action)=>{
            state.profile = action.payload;
        },
        followingUpdate:(state,action)=>{
            if(state.user.following.includes(action.payload)){
                state.user.following = state.user.following.filter((itemId)=>itemId !== action.payload);
            }else{
                state.user.following.push(action.payload);
            }
        },
        toggleDarkMode:(state)=>{   
            state.darkMode = !state.darkMode;
        },
        // ── NEW: BOOKMARK REDUCER ──
        bookmarkUpdate:(state,action)=>{
            if(state.user.bookmarks.includes(action.payload)){
                // Remove bookmark if it already exists
                state.user.bookmarks = state.user.bookmarks.filter((itemId)=>itemId !== action.payload);
            } else {
                // Add bookmark
                state.user.bookmarks.push(action.payload);
            }
        }
    }
});

// Make sure to export bookmarkUpdate here!
export const {getUser, getOtherUsers, getMyProfile, followingUpdate, toggleDarkMode, bookmarkUpdate} = userSlice.actions;
export default userSlice.reducer;