import React, { useState ,useEffect} from 'react'
import { ChatState } from '../Context/chatProvider';
import { Box, Stack, Text} from "@chakra-ui/layout";
import axios from 'axios';
import { GrAdd } from "react-icons/gr";
import {Button} from "@chakra-ui/react"
import { Toaster,toast } from 'react-hot-toast';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupModal from './Miscelleneous/GroupModal';
import { GoDotFill } from "react-icons/go";
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
          const { data } = await axios.get(`${process.env.APP_URL}/chat`, {
            headers:{
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
          }
          });
          toast.success("Chats Found!",{position:'bottom-center',style:{"backgroundColor":'blanchedalmond'}},)
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
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="black"
      color="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      overflowY={'auto'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
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
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<GrAdd />}
          >
            New Group Chat
          </Button>
          </GroupModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
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
             <Box
               
               borderRadius="lg"
               key={i}
               
               fontWeight={unseen.find(unseenchat => unseenchat._id === chat._id)&&'1000'}
             >
               <Text fontWeight={unseen.find(unseenchat => unseenchat._id === chat._id)?'900':'normal'}>
                 {chat && !chat.isGroupChat
                   ? getSender(loggedUser, chat.users) :
                   chat && chat.chatName}
               </Text>
               {chat.latestMessage && (
                 <Text fontSize="xs" >
                   <b>{user && chat.latestMessage.sender._id===user._id?"You":chat.latestMessage.sender.name} : </b>
                   {chat.latestMessage.content.length > 50
                     ? chat.latestMessage.content.substring(0, 51) + "..."
                     : chat.latestMessage.content}
                 </Text>
               )}  
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
