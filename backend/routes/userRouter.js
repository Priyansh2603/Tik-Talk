import express from 'express';
import { allUsers, authLogin, authRegister, getUser } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
 const userRouter = express.Router();
 userRouter.route("/").get(protect,allUsers);
 userRouter.route('/login').post(authLogin);
 userRouter.route('/register').post(authRegister);
 userRouter.route('/getuser').get(protect,getUser);
 export default userRouter;