import express from 'express';
import { chats } from './data/data.js';
import userRouter from './routes/userRouter.js'
import dotenv from 'dotenv';
import cors from "cors"
import connectDB from './database.js';
import chatRouter from './routes/chatRouter.js';
import messageRouter from './routes/messageRouter.js';
import generateToken from './config/generateToken.js';
import  { Server } from 'socket.io'
import http from 'http'
import path from 'path';
const app = express();
const server = http.createServer(app);
connectDB();
dotenv.config();
// app.get('/', (req, res) => {
//   res.send('<h1>The backend of Tik-Talk Running Here!</h1>');
// });
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use("/users",userRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);
// Deployment Configs
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'Production'){
  app.use(express.static(path.join(__dirname1,"/frontend/build")));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
  });
}
else{
  app.get('/',(req,res)=>{
    res.send("API Running Successfully!");
  })
}
// Deployment Configs
app.get('/chat/:id', (req, res) => {
    const id = req.params.id;
    const chat = chats.find(p => p._id === id);
    console.log(chat)
    res.json(chat);
});
const PORT = process.env.PORT 
const io = new Server(server,{
  pingTimeout:60000,
    cors: {
      origin: "http://localhost:3000"
    }
  });
  io.on('connection', (socket) => {
    console.log('a user connected with ',socket.id);
    socket.on('setup',(userData)=>{
      socket.join(userData._id);
      socket.emit("connected");
    })
    socket.on('join chat',(room)=>{
      socket.join(room);
      console.log("joined room ",room);
    })
    socket.on('typing',(room)=>{
      console.log("typing")
      socket.in(room).emit("typing")
    })
    socket.on('stop typing',(room)=>{
      console.log("stopped typing")
      socket.in(room).emit("stop typing")
    })
    socket.on('new message',(newMessageReceived)=>{
      console.log("New message came ");
      var chat = newMessageReceived.chat;
      if(!chat.users) return console.log('chat.users not defined');
      chat.users.forEach(user => {
        if(user._id === newMessageReceived.sender._id) return ;
        console.log("sending")
        socket.in(user._id).emit("message received",newMessageReceived);
      });
    })
    socket.off("setup",(userData)=>{
      console.log("User Disconnected!");
      socket.leave(userData._id);
    })
  })
server.listen(PORT,()=>{
    console.log("Server Running at Port:8000 ");
})

