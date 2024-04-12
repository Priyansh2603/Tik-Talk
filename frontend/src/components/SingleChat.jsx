import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Box,  FormControl, Icon, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text,  useMediaQuery,  useToast } from '@chakra-ui/react';
import { IoMdArrowBack } from 'react-icons/io';
import { getSender, getSenderFull } from '../config/ChatLogics';
import Profile from './Miscelleneous/Profile';
import {BsEyeFill,BsSendFill, BsThreeDots } from 'react-icons/bs';
import { handleRemove } from './Miscelleneous/UpdateGroupModal';
import UpdateGroupChatModal from './Miscelleneous/UpdateGroupModal';
import axios from 'axios';
import { IoIosVideocam } from "react-icons/io";
import ScrollableChat from './ScrollableChat';
import './styles.css';
import { socket } from '../socket';
import animationData from "../animations/typing.json"
import { Toaster,toast as Toast } from 'react-hot-toast';
import Lottie from "react-lottie"; 
import { MdCall } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
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
            const { data } = await axios.get(`${process.env.REACT_APP_URL}/message/${selectedChat._id}`, config);
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
    useEffect(()=>{
        fetchMessages();
    },[fetchAgain])
    async function sendMessageButton(){
        socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.post(`${process.env.REACT_APP_URL}/message/sendmessage`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                // // console.log(data);
                setNewMessage("");
                socket.emit("new message",data);
                setMessages([...messages, data]);
                setFetchAgain(true);
                setSelectedChat(selectedChat)
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
                const { data } = await axios.post(`${process.env.REACT_APP_URL}/message/sendmessage`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                // // console.log(data);
                setFetchAgain(true);
                setNewMessage("");
                socket.emit("new message",data);
                setMessages([...messages, data]);
                
                setSelectedChat(selectedChat)
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
    const clearChat = async()=>{
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.post(`${process.env.REACT_APP_URL}/message/deleteAll`, {
               chatId:selectedChat._id
            }, config);
            console.log(data);
            if(data.success){
                setMessages([]);
                Toast.success("Chat Cleared Successfully!",{style:{color:'black',backgroundColor:'blanchedalmond'},position:'top-center'});
            }
            else{
                // toast({
                //     title: 'Error Occured!',
                //     description: "Couldn't clear chat! try again later!",
                //     status: 'error',
                //     duration: 3000,
                //     isClosable: true,
                //     position: 'bottom'
                // })
            }
        }catch(e){
            toast({
                title: 'Error Occured!',
                description: "Couldn't clear chat! try again later!",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }
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
                    setFetchAgain(true)
                }
                // removeNotificationsForSelectedChat();
            } else {
                setMessages([...messages, newMessageReceived]);
            }
            setFetchAgain(true)
        });
        socket.on('new message deleted',(mId)=>{
            console.log("Message Delete hua");
            setMessages(messages.filter(m=> m._id!=mId));
        })
        socket.on("typing",()=>{setIsTyping(true)})
        socket.on("stop typing",()=>{setIsTyping(false)})
        
            
     })
     useEffect(()=>{
        const visMsg = messages.filter(m => {
            // Check if message has a deletedFor array
            if (m.deletedFor) {
                // If deletedFor array exists, check if user ID is not included
                return !m.deletedFor.includes(user._id);
            } else {
                // If deletedFor array does not exist, include the message
                return true;
            }
        });
        setMessages(visMsg);
     },[])
     const navigate = useNavigate();
    return (< >
    <Toaster/>
        {!selectedChat ? (
            <Box fontSize={'3xl'} display={'flex'} width={'100%'} height={'100%'} alignItems={'center'} justifyContent={"center"}>Please Select the user to start the chat</Box>
        ) : (<Box height={'100%'} width={'100%'} display={'flex'} flexDir={'column'} maxHeight={'100%'}>
            <Text fontSize={{ base: '24px', md: '28px' }}
                pb={2}
                px={0.5}
                width={'100%'}
                fontFamily={'Work sans'}
                display={'flex'}
                justifyContent={{ base: 'space-between' }}
                alignItems={'center'}
            >
                
                {selectedChat && !selectedChat.isGroupChat ? (<>
                    <Box display={'flex'} alignItems={'center'}>
                    <Text display={{base:'flex',md:'none'}} mr={3} alignItems={'center'}> <IoMdArrowBack size={16}
                    onClick={() => { setSelectedChat("") }} /></Text>
                    <Avatar src={getSenderFull(user,selectedChat.users).pic} mr={2} size={{base:'xs',md:'sm'}}/>
                    <Text fontSize={{base:'16px',md:'24px'}}>{getSender(user, selectedChat.users)}</Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                        <Icon as={MdCall} cursor={'pointer'} onClick={()=>toast({title: 'Oops Not Possible!',
                        description: "Call Not Implemented Yet! stay tuned for further updates, enjoy messaging till then 😉!",
                        status: 'info',
                        icon: "🫣",
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'})} boxSize={6} mr={2}/>
                        <Icon
                         onClick={()=>toast({title: 'Oops Not Possible!',
                         description: "Video Call Not Implemented Yet! stay tuned for further updates, enjoy messaging till then 😉!",
                         status: 'info',
                         icon: "🫣",
                         duration: 5000,
                         isClosable: true,
                         position: 'top-right'})}
                        // onClick={()=>{navigate("/videocall")}} 
                        cursor={'pointer'} as={IoIosVideocam} boxSize={6}/>
                        <Menu>
                            <MenuButton><BsThreeDots size={22} style={{display:'flex',alignItems:'center',marginLeft:'4px',transform:'rotate(90deg)'}}/></MenuButton>
                            <MenuList style={{fontSize:'14px',backgroundColor:'white',color:'black',width:'5%'}} >
                            <MenuItem onClick={clearChat}>Clear Chat</MenuItem>
                            <MenuItem><Profile user={getSenderFull(user, selectedChat.users)}>Profile</Profile></MenuItem>
                            <MenuItem>Delete Chat</MenuItem>
                            <MenuItem>Block</MenuItem></MenuList>
                        </Menu>
                    </Box>

                </>) : (<>

                    <Box display={'flex'} alignItems={'center'}>
                    <Text display={{base:'flex',md:'none'}} mr={3} alignItems={'center'}> <IoMdArrowBack size={16}
                    onClick={() => { setSelectedChat("") }} /></Text>
                    <Avatar src={selectedChat.Avatar} mr={2}  size={{base:'xs',md:'sm'}}/>
                    <Text fontSize={{base:'15px',md:'24px'}}>{selectedChat.chatName}</Text>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                    <Icon as={MdCall} cursor={'pointer'} onClick={()=>toast({title: 'Oops Not Possible!',
                        description: "Call Not Implemented Yet! stay tuned for further updates, enjoy messaging till then 😉!",
                        status: 'info',
                        icon: "🫣",
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'})} boxSize={6} mr={2}/>
                        <Icon 
                        // onClick={()=>{navigate("/videocall")}} 
                        onClick={()=>toast({title: 'Oops Not Possible!',
                        description: "Video Call Not Implemented Yet! stay tuned for further updates, enjoy messaging till then 😉!",
                        status: 'info',
                        icon: "🫣",
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'})}
                            // toast("Not Implemented Yet! stay tuned for further updates, enjoy messaging till then 😉!",{Icon:"😉"})}}
                        cursor={'pointer'} as={IoIosVideocam} boxSize={6} />
                    <Menu>
                            <MenuButton><BsThreeDots size={22} style={{display:'flex',alignItems:'center',marginLeft:'4px',transform:'rotate(90deg)'}}/></MenuButton>
                            <MenuList style={{fontSize:'14px',backgroundColor:'white',color:'black',width:'5%'}}>
                            <MenuItem onClick={clearChat}>Clear Chat</MenuItem>
                            <MenuItem ><UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} >Group info</UpdateGroupChatModal></MenuItem>
                            <MenuItem>Delete Chat</MenuItem>
                            <MenuItem onClick={()=>{handleRemove(user)}}>Leave Group</MenuItem></MenuList>
                        </Menu>
                    </Box>
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
                /> : ( messages.length>0 ?<div className="messages">
                <ScrollableChat messages={messages} setMessages={setMessages} />
            </div>:<div style={{display:'flex',height:'100%',width:'100%',alignItems:'center',justifyContent:'center',color:'black',fontSize:'30px'}}>No Messages to show Please type and start </div>
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
