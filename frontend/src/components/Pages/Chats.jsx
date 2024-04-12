import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../../Context/chatProvider'
import SideDrawer from '../Miscelleneous/SideDrawer';
import { Avatar, Badge, Box, Button, Flex, Heading, Icon, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuProvider, Text, useToast } from '@chakra-ui/react';
import MyChats from '../MyChats';
import ChatBox from '../ChatBox';
import { BsBell } from 'react-icons/bs';
import { FaAngleDown, FaUsers } from 'react-icons/fa';
import Profile from '../Miscelleneous/Profile';
import { Link, useNavigate } from 'react-router-dom';
import Chatbox from '../ChatBox';
import { getSender } from '../../config/ChatLogics';
import logo from "../Miscelleneous/img/logo2.png";
import { Peer } from 'simple-peer';
import NotificationBadge, { Effect } from 'react-notification-badge'
import { socket } from '../../socket';
export default function Chats({setIncoming,setIsCall,setCall}) {
  const [fetchAgain, setFetchAgain] = useState(false);
    const user = ChatState().user;
    const history = useNavigate();
    const {notifications,setNotifications,selectedChat, setSelectedChat,unseen,setUnseen} = ChatState();
    // console.log(user && user.name)
    function logoutHandler(){
      localStorage.removeItem("userInfo");
      history("/");
    }
    const toast = useToast();
    const handleAnswer = (onClose) => {
      setIsCall(true);
      console.log("Call is true");
      history('/videocall')
      onClose();
    };
    
    useEffect(()=>{
      document.title = `Tik-Talk (${user.name})${notifications.length ? `(${notifications.length})` : ''}`;
    },[notifications])
    var called = false;
    useEffect(()=>{
      socket.on('incomingCall',(data)=>{
        if(!called){
          called = true;
          console.log(data);
        setIncoming(data.chat);
        const {isGroupChat,users} = data.chat;
        setCall({chat:data.chat,isGroupChat,name:data.name,signal:data.signal,from:data.from})
        toast({
          title: 'Incoming Call',
          description: `${users[0].name} is calling...`,
          status: 'info',
          duration: null,
          position: 'top',
          isClosable: false,
          render: ({ onClose }) => (
            
            <Box
                p={6}
                bg="gray.100"
                borderRadius="md"
                boxShadow="lg"
                overflow="hidden"
                transform="scale(0.8)"
                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                _hover={{ transform: 'scale(1)' }}
                animation="bounceIn 0.5s ease forwards"
              >
              <Flex align="center">
                {isGroupChat ? (
                  <Box p={2} bg="teal.400" borderRadius="full" mr={4}>
                    <FaUsers size={24} color="black" />
                  </Box>
                ) : (
                  <>
                  {users&&<Avatar src={users[0].pic} name={users[0].name} size="md" animation="shrink 1s infinite" />}
            {users&&<Text animation="shiver 1s infinite" ml={4}>{users[0].name} is Calling.....</Text>}
                  </>
                )}
                {/* <Text fontWeight="bold">{chat.chatName}</Text> */}
              </Flex>
              <Flex justify="space-between" mt={4}>
                <Button colorScheme="green" onClick={() => {handleAnswer(onClose)
                setIsCall(true);}}>
                  Answer
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Reject
                </Button>
              </Flex>
            </Box>
          ),
        });
        }
        // getMediaStream();
    })
    })
  return (
    <Box  w={'100%'} bg={'blue.100'}>
      <Box
      display={{base:selectedChat?'none':'flex',md:'flex'}}
      justifyContent={'space-between'}
      alignItems={'center'}
      bg='white'
     w='100%'
    h='8.5vh'
      p='5px 10px 5px 10px'
      borderWidth={'5px'}
      >{user!==undefined ? <SideDrawer/>:<></>}
      {/* <Heading fontSize={'24'} fontFamily={'cursive'}>Tik-Talk</Heading> */}
      <Link to="/" ><Image height={10} width={'auto'} src={logo}/></Link>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Menu>
          <MenuButton p={1}>
          <Flex position="relative" alignItems="center">
            <Icon as={BsBell} boxSize={6} />
           {notifications.length>0 && <Badge
              borderRadius="full"
              variant="solid"
              colorScheme="red"
              position="absolute"
              top="-7px" // Adjust as needed
              left="11px" // Adjust as needed
              fontSize="xs"
            >
              {notifications.length}
            </Badge>}
          </Flex>
          </MenuButton>
          <MenuList pl={2}>{!notifications.length && "No New Messages"}
          {notifications.map((n,i)=>{
            return <MenuItem key = {n._id} onClick={()=>{
              setSelectedChat(n.chat);
              setNotifications(notifications.filter((noti)=> noti!=n));
              setUnseen(unseen.filter((uc)=>uc!=n.chat._id))
            }}>
              {n.chat.isGroupChat?`New Message in ${n.chat.chatName}`:`New Message from ${getSender(user,n.chat.users)}`}
            </MenuItem>
          })}
          </MenuList>
          </Menu>
          {user && <Menu>
            <MenuButton as={Button} variant={'ghost'} rightIcon={<FaAngleDown/>}><Avatar size={'sm'} src={user && user.pic} name={user&&user.name} cursor={'pointer'}/></MenuButton>
            <MenuList>
              <Profile user={user}>
              <MenuItem >My Profile</MenuItem>
              </Profile>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler} >LogOut</MenuItem>
            </MenuList>
            </Menu>}</div>
            </Box>
      <Box display={'flex'}  w='100%' h={'91.5vh'} >
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Box>
  )
}
