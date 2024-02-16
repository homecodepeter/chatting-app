import express from "express"
import { getAllFriendList, getAllUser, getSearchUser, AddFriendToYourList, getUser } from "../Controller/user.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/all/:id", getAllUser);
router.get("/:id/friends", getAllFriendList);
router.post("/searchuser", getSearchUser)
router.patch("/:id/:friendId", AddFriendToYourList);

export default router;