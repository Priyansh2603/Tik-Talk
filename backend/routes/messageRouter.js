import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage,allMessages, deleteOneMessage, deleteAllMessages } from '../controllers/messageControllers.js';
 const messageRouter = express.Router();
 messageRouter.route("/sendMessage").post(protect,sendMessage);
 messageRouter.route("/deleteMessage").post(protect,deleteOneMessage);
 messageRouter.route("/deleteAll").post(protect,deleteAllMessages);
 messageRouter.route("/:chatId").get(protect,allMessages);
//  router.route('/login',authUser);
 export default messageRouter;