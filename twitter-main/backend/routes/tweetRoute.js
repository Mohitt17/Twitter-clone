import express from "express";
import { 
    createTweet, 
    deleteTweet, 
    getAllTweets, 
    getFollowingTweets, 
    likeOrDislike,
    addComment,
    getBookmarks // ← IMPORT NEW FUNCTION
} from "../controllers/tweetController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();
 
router.route("/create").post(isAuthenticated,createTweet);
router.route("/delete/:id").delete(isAuthenticated,deleteTweet);
router.route("/like/:id").put(isAuthenticated,likeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweets);
router.route("/comment/:id").post(isAuthenticated, addComment);

// ── NEW: BOOKMARKS ROUTE ──
router.route("/bookmarks/:id").get(isAuthenticated, getBookmarks);

export default router;