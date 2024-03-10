import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure,
    Button,
    Text,
  } from '@chakra-ui/react'
import { useContext, useEffect } from 'react';
import { ChatState } from '../Context/chatProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { socket } from '../socket';
export default function DeleteMsg({message,children,handleToggleOptions,setMessages,messages}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {user} = ChatState();
    const delMsg = async(deleteForAll)=>{
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const chat = message.chat;
            const mId = message._id;
            const deleted = {chat,byuser:user._id,mId};
            const { data } = await axios.post(`${process.env.REACT_APP_URL}/message/deletemessage`, {
                mId: message._id,deleteForAll
            }, config);
            if(data.success){
                if(deleteForAll){
                    socket.emit('message deleted',deleted);
                }
                setMessages(messages.filter(m => m._id !== message._id));
                toast.success("Message Deleted!",{style:{color:'black',backgroundColor:'blanchedalmond'},position:'bottom-center'})
            }
            else{
                toast.error("Message Couldn't be Deleted!",{style:{color:'black',backgroundColor:'blanchedalmond'}})
            }
        }catch(e){}
    }
    
    return (
      <>
         <Text onClick={onOpen}> {children} </Text>
  
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Message
              </AlertDialogHeader>
             
              <AlertDialogBody>
                You're Deleting "{message.content}"? This can't be undone.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button onClick={()=>{onClose();
                handleToggleOptions(message._id)}}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={()=>{onClose();
                delMsg(false);
                handleToggleOptions(message._id)}} ml={3}>
                  Delete For me 
                </Button>
                {message.sender._id === user._id && <Button colorScheme='red' onClick={()=>{onClose();
                delMsg(true);
                handleToggleOptions(message._id)}} ml={3}>
                  Delete For All
                </Button>}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }