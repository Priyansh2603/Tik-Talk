import express from 'express';
// import { allUsers } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import {accessChat,fetchChats, addGroup, createGroupChats, removeGroup, renameGroup } from '../controllers/chatControllers.js';
 const router = express.Router();
 router.route("/").post(protect,accessChat);
 router.route("/").get(protect,fetchChats);
 router.route("/group").post(protect,createGroupChats);
 router.route("/rename").put(protect,renameGroup);
 router.route("/groupremove").put(protect,removeGroup);
 router.route("/groupadd").put(protect,addGroup);
//  router.route('/login',authUser);
const chatRouter = router;
export default chatRouter;