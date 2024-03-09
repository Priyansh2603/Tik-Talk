import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
const sendMessage = async(req,res)=>{
    const {content,chatId} = req.body;
    // console.log(req.user);
    if(!content || !chatId){
        // console.log("Invlaid data passed into request");
        return res.sendStatus(400); 
    }
    let newMessage = {
        sender: req.user._id,
        content:content,
        chat : chatId,
    };
    try{
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:'chat.users',
            select: 'name pic email',
        });
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage: message,
        })
        res.json(message);
    }
    catch(e){
        res.status(400);
        throw new Error(e.message);
    }
}
const allMessages = async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
export {sendMessage,allMessages};