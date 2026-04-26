import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../redux/userSlice";

const useGetProfile = (id) => {
    const dispatch = useDispatch();
    // ← re-run whenever a tweet is created/deleted/liked
    const { refresh } = useSelector(store => store.tweet);

    useEffect(()=>{
        const fetchMyProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`,{
                    withCredentials:true
                });
                dispatch(getMyProfile(res.data.user));
            } catch (error) {
                console.log(error);
            }
        }
        fetchMyProfile();
    },[id, refresh]);   // ← added refresh dependency
};
export default useGetProfile;