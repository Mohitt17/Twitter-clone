import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        otherUsers:null,
        profile:null,
        darkMode:false,   // ← NEW
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
        toggleDarkMode:(state)=>{   // ← NEW
            state.darkMode = !state.darkMode;
        }
    }
});

export const {getUser, getOtherUsers, getMyProfile, followingUpdate, toggleDarkMode} = userSlice.actions;
export default userSlice.reducer;