import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Button,
    Avatar,
    FormControl,
    Input,
    FormLabel,
    Box,
    VStack,
    Heading
  } from '@chakra-ui/react'
import axios from 'axios';
import { Toaster,toast } from 'react-hot-toast';
import { ChatState } from '../../Context/chatProvider';
import { FiAlertCircle } from "react-icons/fi";
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { FaRemoveFormat } from 'react-icons/fa';
import UserBadgeItem from '../UserAvatar/UserBadge';
export default function GroupModal({children}) {
    const [groupChatName,setGroupChatName] = useState('');
    const [selectedUsers,setSelectedUsers] = useState([])
    const [search,setSearch] = useState('')
    const [searchResults,setSearchResults] = useState([])
    const [loading,setLoading] = useState(false)
    const {user,chats,setChats} = ChatState();
    const OverlayOne = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
      )
    
      const OverlayTwo = () => (
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='20%'
          backdropBlur='2px'
        />
      )
      async function handleGroup(userToAdd){
        if(selectedUsers.includes(userToAdd)){
            toast("User Added Already!");
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
      }
      async function handleCreate(){
        if(!groupChatName){
            toast("Please Enter the Group name",{
                icon:<FiAlertCircle />,
                style:{backgroundColor:'black',color:'white'}
            })
            return;
        }
        if(selectedUsers.length<2){
            toast("Please Add at least 2 other members",{
                icon:<FiAlertCircle />,
                style:{backgroundColor:'black',color:'white'}
            })
            return;
        }
        try{
            // console.log("Group",user)
            const {data} = await axios.post(  `http://localhost:8000/chat/group`,{name:groupChatName,users:selectedUsers},{
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            })
            if(chats.includes(data)){
                toast.error("Group Exist with this name!",{style:{"backgroundColor":'black',"color":"white"}});
                return;
            }
            else{
                setChats([...chats,data]);
                toast.success("Group Created Successfully!",{style:{"backgroundColor":'black',"color":'white'}});
                setSelectedUsers([]);
                setSearchResults([]);
            }
            // console.log(data);
        }catch(e){
            // console.log(e.message);
        }
      }
      function handleDelete(deleteUser){
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==deleteUser._id));
      }
    async function handleSearch(query){
        if(query===''){
            setSearchResults([]);
            return;
        }
        try{
          setLoading(true);
            // console.log(user.token);
            const {data} = await axios.get(  `http://localhost:8000/users/?search=${query}`,{
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
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
      const { isOpen, onOpen, onClose } = useDisclosure()
      const [overlay, setOverlay] = React.useState(<OverlayOne />)
    
      return (
        <>
          <Button
            ml='4'
            onClick={() => {
              setOverlay(<OverlayTwo />)
              onOpen()
            }}
          >
            {children}
          </Button>
          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            {overlay}
            <ModalContent>
              <ModalHeader
              fontSize={'35px'}
              fontFamily={'Work sans'}
              display={'flex'}
              justifyContent={'center'}>Create New Group</ModalHeader>
              <ModalCloseButton />
              <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'} >
            <FormControl>
              <Input onChange={(e)=>{
                setGroupChatName(e.target.value);
              }} placeholder='Enter Group Name...' />
            </FormControl>

            <FormControl   mt={4}>
<Box >
<Input mb={2} onChange={(e)=>{
    setSearch(e.target.value)
    handleSearch(e.target.value)
}} placeholder='Find Members...' />
              
</Box>
            </FormControl>
            <Box display={'flex'} flexWrap={'wrap'} w='100%'>
            {selectedUsers.map((u,i)=>{
                return  (
                        <UserBadgeItem  key={u._id} admin = {user._id} user={u}  handleFunction={()=>{
                    handleDelete(u);
                }}/>
                )
            })}
                    </Box>
            {loading?<Text>Searching...</Text>:
            <VStack>
                {searchResults.length>0? searchResults.slice(0,4).map((e,i)=>{
                    return <Box display={'flex'} flexDir={'row'} alignItems={'center'} justifyContent={'space-evenly'}>
                    
                    <UserListItem
                    key={e._id}
                    user = {e}
                    handleFunction = {()=>{
                      handleGroup(e);
                    }}
                    />
                    {/* <Button>Add</Button> */}
                    </Box>
                }):<Heading>No Results...</Heading>}
            </VStack>}
          </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' onClick={()=>{
                    handleCreate();
                    onClose();
                }}>Create Group</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
