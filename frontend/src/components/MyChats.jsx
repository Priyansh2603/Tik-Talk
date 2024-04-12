import React, { useState ,useEffect} from 'react'
import { ChatState } from '../Context/chatProvider';
import { Box, Stack, Text} from "@chakra-ui/layout";
import axios from 'axios';
import { GrAdd } from "react-icons/gr";
import {Avatar, Button} from "@chakra-ui/react"
import { Toaster,toast } from 'react-hot-toast';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupModal from './Miscelleneous/GroupModal';
import { GoDotFill } from "react-icons/go";
import { socket } from '../socket';
export default function MyChats({fetchAgain}) {
  const  setSelectedChat = ChatState().setSelectedChat;
  const  {unseen,setUnseen} = ChatState();
  const  chats = ChatState().chats;
  const  setChats = ChatState().setChats;
  const {user} = ChatState();
  const [loggedUser,setLoggedUser] = useState(user);
    const selectedChat = ChatState().selectedChat;
    const fetchChats = async () => {
        // console.log("fetch user",loggedUser);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // console.log("Token for fetching ",user.token)
          const { data } = await axios.get(`${process.env.REACT_APP_URL}/chat`, {
            headers:{
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
          }
          });
          // toast.success("Chats Found!",{position:'bottom-center',style:{"backgroundColor":'blanchedalmond'}},)
          setChats(data);
        } catch (error) {
          // console.log(error.message)
          toast.error("Error Fetching Chats!");
        }
      };
    
      useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
      }, [fetchAgain]);
      const getTimeAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
      
        // Calculate the difference in milliseconds
        const difference = now.getTime() - createdDate.getTime();
      
        // Convert milliseconds to minutes, hours, and days
        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      
        // Format the time difference
        if(minutes<1){
          return 'Just Now';
        }
        if (minutes < 60) {
          return `${minutes}m ago`;
        } else if (hours < 24) {
          return `${hours}h ago`;
        } else {
          return `${days}d ago`;
        }
      };
      
      useEffect(() => {
        const handleAdded = newGroupChat => {
            setChats([...chats, newGroupChat]);
            setUnseen([newGroupChat._id,...unseen]);
            fetchChats();
        };
        socket.on('added', handleAdded);
    
        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('added', handleAdded);
        };
    });
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={2}
      bg="black"
      color="white"
      // height={"91.5vh"}
      w={{ base: "100%", md: "31%" }}
      // borderRadius="lg"
      borderWidth="0.5px"
      overflowY={'auto'}
    >
      <Box
        pb={{base:1,md:3}}
        px={{base:1,md:2}}
        fontSize={{ base: "14px", md: "20px" }}
        fontFamily="Work sans"
        display ="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupModal>
          <Button
            d="flex"
            fontSize={{ base: "12px", md: "10px", lg: "15px" }}
            rightIcon={<GrAdd />}
          >
            New Group Chat
          </Button>
          </GroupModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={{base:1.5,md:3}}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY={'hidden'}
      >
        {chats ? (
         <div style={{ overflowY: 'auto', maxHeight: '100%' }}> {/* Adjust maxHeight as needed */}
         <Stack>
           {chats.length > 0 ? chats.map((chat, i) => (
            <Box display={'flex'} justifyContent={'space-between'}
            cursor="pointer"
            onClick={() => {setSelectedChat(chat)
              setUnseen(prevUnseen => prevUnseen.filter(chat => chat.id !== chat._id))
             }
            }
               bg={selectedChat === chat ? "#38B2AC" :unseen.find(unseenchat => unseenchat === chat._id)?"blue.200": "#E8E8E8"}
               color={selectedChat === chat ? "white" : "black"}
               px={3}
               py={2}
               borderRadius="lg"
               key={i}>
                
            <Box display={'flex'} alignItems={'center'}>
            <Avatar
              size={'sm'}
              src={
                chat.isGroupChat
                  ? chat.Avatar // Assuming chat.Avatar contains the URL of the group chat's avatar
                  : chat.users[0]._id === user._id
                  ? chat.users[1].pic // Assuming chat.users[1].pic contains the URL of the other user's avatar
                  : chat.users[0].pic // Assuming chat.users[0].pic contains the URL of the other user's avatar
              }
              mr={2}
            />
            <Box
               
               borderRadius="lg"
               key={i}
               
               fontWeight={unseen.find(unseenchat => unseenchat._id === chat._id)&&'1000'}
             >
               <Text fontSize={"smaller"} fontWeight={unseen.find(unseenchat => unseenchat._id === chat._id)?'900':'normal'}>
               
                 {chat && !chat.isGroupChat
                   ? getSender(loggedUser, chat.users) :
                   chat && chat.chatName}
               </Text>
               {chat && chat.latestMessage && chat.latestMessage.deletedFor && !chat.latestMessage.deletedFor.includes(user._id) && (
                 <Text fontSize="xs" display={'flex'} >
                   <b style={{marginRight:'2px'}}>{user && chat.latestMessage.sender._id===user._id?"You":chat.latestMessage.sender.name} : </b>
                   {chat.latestMessage.content.length > 50
                     ? chat.latestMessage.content.substring(0, 51) + "..."
                     : (<div style={{display:'flex'}}>{chat.latestMessage.content+" "}<b style={{marginLeft:'5px',color:'gray'}}>{getTimeAgo(chat.latestMessage.createdAt)}</b></div>)}
                 </Text>
               )}  
            </Box>
            </Box>
               {unseen.find(unseenchat => unseenchat === chat._id) && <Box display={'flex'} alignItems={'center'}><GoDotFill/></Box>}
             </Box>
           )):<Box width={'100%'} height={'100%'} color={'black'} display={'flex'} alignItems={'center'} justifyContent={'center'}>No Chats Found</Box>}
         </Stack>
       </div>
        ) :
         (
          <ChatLoading />
         )}
      </Box>
    </Box>
  )
}
