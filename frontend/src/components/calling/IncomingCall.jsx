import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { socket } from '../../socket';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatState } from '../../Context/chatProvider';
import Peer from 'simple-peer';
import { Button,Box } from '@chakra-ui/react';
const IncomingCall = ({ call }) => {
  
  const {notifications,setNotifications,selectedChat,user, setSelectedChat,unseen,setUnseen} = ChatState();
function EndCall(){
    myStream.getTracks().forEach(track => track.stop());
    setMyStream(null);
    navigate("/")
}
useEffect(()=>{
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
},[])
  return(
      null
  ); // We don't render anything here since the notification toast is displayed
};

export default IncomingCall;
