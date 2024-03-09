import React from 'react';

import { Route, Routes } from 'react-router-dom';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import Homepage from './components/Pages/Homepage';
import { ChatState } from './Context/chatProvider';
import Chats from './components/Pages/Chats';
import './App.css'
export default function App() {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);
  // const [message, setMessage] = useState('');
  // const [showmessages,setShowMessages] = useState([]);
  // const [image,setImage] = useState('');
  // const [showImage,setShowImage] = useState('');
  // useEffect(() => {
  //   // console.log("trying to connect")
  //   function onConnect() {
  //     // console.log("connected bro")
  //     setIsConnected(true);
  //     // console.log("User Connected")
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   function onFooEvent(value) {
  //     setFooEvents(previous => [...previous, value]);
  //   }

  //   socket.on('connection', onConnect);
  //   socket.on('disconnect', onDisconnect);
  //   socket.on('foo', onFooEvent);
  //   socket.on('message',(message)=>{
  //     setShowMessages(previous => [...previous, message]);
  //   })
  //   socket.on('file',(file)=>{
  //     setShowImage(file);
  //   })
  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('foo', onFooEvent);
  //   };
  // }, []);
  const user = ChatState().user;
  // console.log(user);
  return (
    <div className="App">

      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/" element={user?<Homepage/>:<Login/>}/>
        <Route path="/login" element={user?<Homepage/>:<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/chats" element={<Chats/>}/>
      </Routes>
    </div>
  );
}