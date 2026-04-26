import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    },
    // ── NEW: COMMENTS FIELD ──
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            }
        }
    ]
    // ─────────────────────────
},{timestamps:true});

export const Tweet = mongoose.model("Tweet", tweetSchema);