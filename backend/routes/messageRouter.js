import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage,allMessages } from '../controllers/messageControllers.js';
 const messageRouter = express.Router();
 messageRouter.route("/sendMessage").post(protect,sendMessage);
 messageRouter.route("/:chatId").get(protect,allMessages);
//  router.route('/login',authUser);
 export default messageRouter;