import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Box,  FormControl, IconButton, Input, Spinner, Text,  useMediaQuery,  useToast } from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { getSender, getSenderFull } from '../config/ChatLogics';
import Profile from './Miscelleneous/Profile';
import {BsEyeFill,BsSendFill } from 'react-icons/bs';
import UpdateGroupChatModal from './Miscelleneous/UpdateGroupModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import './styles.css';
import { socket } from '../socket';
import animationData from "../animations/typing.json"
import { Toaster } from 'react-hot-toast';
import Lottie from "react-lottie"; 
var  selectedChatCompare;
export default function SingleChat({ fetchAgain, setFetchAgain }) {
    const [socketConnection, setSocketConnection] = useState(false);
    const { user, selectedChat, setSelectedChat,notifications,setNotifications,unseen,setUnseen } = ChatState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);
    const toast = useToast();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    useEffect(()=>{
        socket.emit("setup",user);
        socket.on("connected",()=>{
            setSocketConnection(true);
            // // console.log("connected with",socket.id)
        })
        socket.on('typing',()=>{setTyping(true)});
        socket.on('stop typing',()=>{setTyping(false)});
        // console.log(user);
    },[])
    async function fetchMessages() {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8000/message/${selectedChat._id}`, config);
            // // console.log(data);
            setNewMessage("");
            setMessages(data);
            setLoading(false);
            socket.emit("join chat",selectedChat._id)
        }
        catch (e) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the Messages!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }
    async function sendMessageButton(){
        socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.post(`${process.env.APP_URL}/message/sendmessage`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                // // console.log(data);
                setNewMessage("");
                socket.emit("new message",data);
                setMessages([...messages, data]);
                setFetchAgain(true);
            }
            catch (e) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the Message!',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
    }
    async function sendMessage(e) {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.post(`${process.env.APP_URL}/message/sendmessage`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                // // console.log(data);
                setNewMessage("");
                socket.emit("new message",data);
                setMessages([...messages, data]);
                setFetchAgain(true);
            }
            catch (e) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the Message!',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
    }
    function typingHandler(e) {
        setNewMessage(e.target.value);
        if(!socketConnection) return;
        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
            var currTime = new Date().getTime();
            var timeDifference = currTime-lastTypingTime;
            if(timeDifference >= timerLength && typing){
                socket.emit('stop typing',selectedChat._id)
                setTyping(false);
            }
        },timerLength)
    }
    const removeNotificationsForSelectedChat = () => {
        if (selectedChatCompare) {
            const updatedNotifications = notifications.filter(notification => {
                return notification.chat._id !== selectedChatCompare._id;
            });
            setNotifications(updatedNotifications);
        }
    };
    useEffect(() => { 
        fetchMessages();
        selectedChatCompare = selectedChat;
        removeNotificationsForSelectedChat();
     }, [selectedChat])
     // console.log(notifications,"----------")
     useEffect(()=>{
        socket.on("message received", newMessageReceived => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                const hasNotification = notifications.some(notification => {
                    return notification.chat._id === newMessageReceived.chat._id;
                });
                setFetchAgain(true);
                if (!hasNotification) {
                    setNotifications([newMessageReceived, ...notifications]);
                    
                    setUnseen([newMessageReceived.chat._id,...unseen]);
                }
                // removeNotificationsForSelectedChat();
            } else {
                setMessages(prevMessages => [...prevMessages, newMessageReceived]);
            }
        });
        socket.on("typing",()=>{setIsTyping(true)})
        socket.on("stop typing",()=>{setIsTyping(false)})
     })
    return (< >
    <Toaster/>
        {!selectedChat ? (
            <Box fontSize={'3xl'} display={'flex'} width={'100%'} height={'100%'} alignItems={'center'} justifyContent={"center"}>Please Select the user to start the chat</Box>
        ) : (<Box height={'100%'} width={'100%'} display={'flex'} flexDir={'column'} maxHeight={'100%'}>
            <Text fontSize={{ base: '28px', md: '30px' }}
                pb={3}
                px={2}
                width={'100%'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={{ base: 'space-between' }}
                alignItems={'center'}
            >
                <IconButton display={{ base: 'flex', md: 'none' }}
                    icon={<IoMdArrowBack />}
                    onClick={() => { setSelectedChat("") }} />
                {selectedChat && !selectedChat.isGroupChat ? (<>
                    <Text fontSize={{sm:'26px',md:'34px'}}>{getSender(user, selectedChat.users)}</Text>
                    <Profile user={
                        getSenderFull(user, selectedChat.users)
                    }><IconButton display={'flex'}
                        icon={<BsEyeFill size={'24'} />}
                        /></Profile>

                </>) : (<>

                    <Text fontSize={{ base: '24px', md: '34px' }}>{selectedChat.chatName}</Text>
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    {/* */}
                </>)}
            </Text>
            <Box sx={{backgroundImage:'url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")'}}
                display="flex"
                flexDir={'column'}
                justifyContent={'flex-end'}
                p={1}
                bg="#a8a8e8"
                w="100%"
                height={'100%'}
                borderRadius="lg"
                overflow={'hidden'}
                >

                {loading ? <Spinner
                    size={'xxl'}
                    width={24}
                    height={24}
                    alignSelf={'center'}
                    margin={'auto'}
                    color='black'
                /> : (
                <div className="messages">
                    <ScrollableChat messages={messages} />
                </div>
                )}
                    {isTyping?<div style={{display:'flex',alignItems:'center'}}>
                  <Avatar width={38} height={38} src={user && user.picture} />      
                  <Lottie
                    options={defaultOptions}
                    height={25}
                    width={60}
                    
                    style={{ marginBottom: 15,marginTop:10, marginLeft: 5,borderRadius:'80px',padding:'20',backgroundColor:'black',color:'gray',filter:'invert(20%)' }}
                  /></div>:<></>}
                <FormControl style={{ display: 'flex', marginBottom: 0 }} onKeyDown={sendMessage} isRequired mt={2}>
                    <Input variant="filled" bg="gray.100" border={'0.5px solid black'} color={'black'} placeholder="Type here..." onChange={typingHandler} value={newMessage} />
                    <IconButton display={'flex'} ml={1} border={'0.5px solid black'} icon={<BsSendFill size={18} />} onClick={sendMessageButton} />
                </FormControl>
            </Box>
        </Box>)}
    </>
    )
}
