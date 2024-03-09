import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../../Context/chatProvider'
import SideDrawer from '../Miscelleneous/SideDrawer';
import { Avatar, Badge, Box, Button, Flex, Heading, Icon, Image, Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuProvider, Text } from '@chakra-ui/react';
import MyChats from '../MyChats';
import ChatBox from '../ChatBox';
import { BsBell } from 'react-icons/bs';
import { FaAngleDown } from 'react-icons/fa';
import Profile from '../Miscelleneous/Profile';
import { Link, useNavigate } from 'react-router-dom';
import Chatbox from '../ChatBox';
import { getSender } from '../../config/ChatLogics';
import logo from "../Miscelleneous/img/logo2.png";

import NotificationBadge, { Effect } from 'react-notification-badge'
export default function Chats() {
  const [fetchAgain, setFetchAgain] = useState(false);
    const user = ChatState().user;
    const history = useNavigate();
    const {notifications,setNotifications,selectedChat, setSelectedChat,unseen,setUnseen} = ChatState();
    // console.log(user && user.name)
    function logoutHandler(){
      localStorage.removeItem("userInfo");
      history("/");
    }
  return (
    <Box  w={'100%'} bg={'blue.100'}>
      <Box
      display='flex'
      justifyContent={'space-between'}
      alignItems={'center'}
      bg='white'
      w='100%'
      p='5px 10px 5px 10px'
      borderWidth={'5px'}
      >{user!==undefined ? <SideDrawer/>:<></>}
      {/* <Heading fontSize={'24'} fontFamily={'cursive'}>Tik-Talk</Heading> */}
      <Link to="/" ><Image height={14} width={'auto'} src={logo}/></Link>
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
      <Box display={'flex'} justifyContent={'space-between'} w='100%' h={'91.5vh'} p={8} borderRadius={0}>
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Box>
  )
}
