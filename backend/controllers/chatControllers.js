import { populate } from "dotenv";
import { Chat } from "../models/chatModel.js";
import User from "../models/userModel.js";

const accessChat = async(req,res)=>{
    // console.log("Chat Creating!");
    const { userId } = req.body;
    // // console.log(req);
    if(!userId){
        res.sendStatus(400)
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq: req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ],
    }).populate("users","-password").populate("latestMessage");
    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select: 'name pic email',
    })
    // console.log(isChat)
    if(isChat.length>0){
        res.status(200).send(isChat);
    }
    else{
        var chatData = {
            chatName:'sender',
            isGroupChat: false,
            users:[req.user._id,userId],
        };
        try{
            const createdChat = await Chat.create(chatData);
            const FullChat =  await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            // console.log(FullChat);
            res.status(200).send(FullChat);
        }catch(e){

        }
    }
}
const fetchChats = async(req,res)=>{
    if(!req.user){console.log("No token" ,req.user)
     return;};
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}
const createGroupChats = async(req,res)=>{
    // console.log(req.body.users,"and",req.body.name);
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:'Please fill the required details to create a group'});
    }
    const {users} = req.body;
    if(users.length<2){
        // console.log("Same name")
        return res.status(400).send({message:"More than 2 users can form a group!"})
    }
    const isExisting = await Chat.findOne({chatName:req.body.name
        ,users:users});
    // console.log(isExisting);
    if(isExisting) return res.status(500).send({message: "Group Already Exist!"})
    users.push(req.user);
    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users:users,
            isGroupChat: true,
            groupAdmin:req.user,
        });
        const FullGroupChat =  await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).send(FullGroupChat);
    }catch(e){
        res.status(400).send(e.message);
    }
}
const renameGroup = async(req,res)=>{
    const {chatId, chatName} = req.body;
    const updateChat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!updateChat){
        res.status(400).send({message:'Chat Not Found!'});
    }
    else{
        res.status(200).send(updateChat);
    }
}
const addGroup = async(req,res)=>{
    const {chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push:{users:userId}
        },{
            new:true
        }).populate("users","-password").populate("groupAdmin","-password");
        if(!added){
            res.status(400).send({message:'Chat Not Found!'});
        }
        else{
            res.status(200).send(added);
        }
}
const removeGroup = async(req,res)=>{
    const {chatId,userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,
        {
            $pull:{users:userId}
        },{
            new:true
        }).populate("users","-password").populate("groupAdmin","-password");
        if(!removed){
            res.status(400).send({message:'Chat Not Found!'});
        }
        else{
            res.status(200).send(removed);
        }
}
export {accessChat,fetchChats,createGroupChats,renameGroup,addGroup,removeGroup}