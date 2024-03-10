import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    useDisclosure,
    Stack,
    Box,
    FormLabel,
    VStack,
    Avatar,
    Heading,
    Text,
    Tooltip,
    Spinner
  } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { FaArrowLeft, FaSearch } from 'react-icons/fa'
import { ChatState } from '../../Context/chatProvider'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { Loader } from '@react-three/drei'
export default function SideDrawer() {
    let user = ChatState().user;
    // JSON.parse(user)
    // console.log("naam", user && user.token)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef()
    const [searchString,setSearchString] = useState('');
    const [searchResults,setSearchResults]= useState([]);
    const [loading,setLoading] = useState(false);
    const [loadChat, setLoadChat] = useState();
    const  setSelectedChat = ChatState().setSelectedChat;
    const  chats = ChatState().chats;
    const  setChats = ChatState().setChats;
    const {notifications,setNotifications,selectedChat} = ChatState();
    useEffect(()=>{
        search();
    },[searchString])
    async function search(){
        // e.preventDefault();
        if(searchString===''){
            setSearchResults([]);
            return;
        }
        try{
          setLoading(true);
            // console.log(user && user.token);
            const token = user.token
            const {data} = await axios.get(  `${process.env.REACT_APP_URL}/users/?search=${searchString}`,{
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            setSearchResults(data);
            // console.log(data);
            setLoading(false);
        }catch(e){
            // console.log(e.message);
            setLoading(false);
            toast.error("Couldn't find anything");
        }
    }
    async function accessChat(id){
      try{
        setLoadChat(true);
        // console.log(user);
        setSearchResults([]);
        setSearchString("");
        // setSelectedChat()
        onClose();
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization : `Bearer ${user.token}`
          }
        }
        const {data} = await axios.post(`${process.env.REACT_APP_URL}/chat`,{userId:id},{
          headers:{
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
        }}
        );
      //   console.log(chats.some(chat => {
      //     // Assuming each chat has a 'users' property which is an array
      //     // Compare the IDs of the users in each chat
      //     return chat.users.every((user, index) => user._id === data[0].users[index]._id);
      // }));
        // console.log(chats)
        // Check if the chat already exists in the chats array
        const existingChat = chats.find(chat => {
          if (chat.isGroupChat && chat.chatName === data[0].chatName) {
              return true;
          }
          return chat.users.every((user, index) => user._id === data[0].users[index]._id);
        });

        if (!existingChat) {
          // If the chat doesn't exist, add it to the beginning of the chats array
          setChats([data[0], ...chats]);
          setSelectedChat(data[0])
        } else {
          // If the chat exists, set it as the selected chat
          const updatedNotifications = notifications.filter(notification => {
              //console.log("removing")
              return notification.chat._id !== selectedChat._id;
          });
    
          // Update the notifications state with the filtered notifications
          setNotifications(updatedNotifications);
          setSelectedChat(existingChat);
        }

        setLoadChat(false);
        // onClose();
      }
      catch(e){
        toast.error("Couldn't Start the Chat!")
        setLoadChat(false);
      }
    }
    return (
      <>
      <Toaster/>
        <Tooltip label="Search friends" hasArrow placement='bottom-end'><Button _hover={{'border':'1px solid grey', 'bg':'blue.100'}} variant={'ghost'} leftIcon={<FaSearch />} colorScheme='grey' color={'black'} border={'1px solid grey.200'}  onClick={onOpen}>
          <Text display={{base:'none',md:'flex'}}>Search</Text>
        </Button></Tooltip>
        <Drawer
          isOpen={isOpen}
          placement='left'
          initialFocusRef={firstField}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Search
            </DrawerHeader>
  
            <DrawerBody>
              <Stack spacing='24px'>
                <Box>
                  <Input
                    ref={firstField}
                    onChange={(e)=>{
                        setSearchString(e.target.value);
                    }}
                    value={searchString}
                    id='username'
                    placeholder='Please enter user name'
                  />
                </Box>
                
              </Stack>
            
            <DrawerFooter borderTopWidth='1px' display={'flex'} justifyContent={'center'}>
              
              <Button leftIcon={<FaSearch />} onClick={search} colorScheme='blue'> Search</Button>
            </DrawerFooter>
            {loading?<ChatLoading/>:
            <VStack>
                {searchResults.length>0 ? searchResults.map((e,i)=>{
                    return <>
                    
                    <UserListItem
                    key={e._id}
                    user = {e}
                    handleFunction = {()=>{
                      accessChat(e._id)
                    }}
                    />
                    </>
                }):<Heading>No Results...</Heading>}
            </VStack>}
            {loadChat?<Spinner ml='auto' display={'flex'}/>:<> </>}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }