// import React, { useEffect, useState } from 'react';
// import ReactPlayer from 'react-player';
// import { socket } from '../../socket';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ChatState } from '../../Context/chatProvider';
// import Peer from 'simple-peer';
// import { Box, Button } from '@chakra-ui/react';
// import SimplePeer from 'simple-peer';

// export default function VideoCall({ isCall, call }) {
//     const [myStream, setMyStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const { user, selectedChat } = ChatState();
//     const chatId = useParams();
//     const navigate = useNavigate();

//     const callUser = async() => {
//         console.log(myStream);
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         console.log(stream);
//         const peer = new Peer({ initiator: true, trickle: false, stream: myStream }); // Pass stream as a parameter
//         peer.on('signal', (data) => {
//             console.log(data);
//             socket.emit('callUser', { chat: selectedChat, signalData: data, from: user, name: user.name });
//         });
//         peer.on('stream', (currentStream) => {
//             setRemoteStream(currentStream);
//         });
//         socket.on('callAccepted', (signal) => {
//             peer.signal(signal);
//         });
//     };
//     const getMediaStream = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             setMyStream(stream);
//         } catch (error) {
//             console.error('Error accessing media devices:', error);
//         }
//     };
//     const answerCall = async () => {
//         try {
//             // Get media stream
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             console.log(stream);
    
//             // Initialize Peer with stream
//             const peer = new Peer({ initiator: false, trickle: false, stream }); // Use the stream variable here
//             peer.on('signal', (data) => {
//                 console.log(data);
//                 socket.emit('answerCall', { signal: data, to: call.from._id });
//             });
//             peer.on('stream', (currentStream) => {
//                 console.log(currentStream);
//                 setRemoteStream(currentStream);
//             });
//             // Signal the call
//             peer.signal(call.signal);
    
//             // Clean-up function
//             return () => {
//                 if (stream) {
//                     stream.getTracks().forEach(track => track.stop());
//                 }
//             };
//         } catch (error) {
//             console.error('Error accessing media devices:', error);
//         }
//     };

    

//     useEffect(async() => {
//         await getMediaStream();

//         if (!isCall) {
//             callUser();
//         } else {
//             answerCall();
//         }

//         return () => {
//             if (myStream) {
//                 myStream.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     function EndCall() {
//         if (myStream) {
//             myStream.getTracks().forEach(track => track.stop());
//         }
//         setMyStream(null);
//         navigate("/");
//     }

//     return (
//         <Box display={'flex'} alignItems={'center'}>
//           {myStream && <ReactPlayer height={'400px'} width={'400px'} url={myStream} playing muted/>}
//           {remoteStream && <ReactPlayer height={'400px'} width={'400px'} url={remoteStream} playing muted/>}
//           {myStream &&<Button colorScheme="red" onClick={EndCall}>
//                 End Call
//               </Button>}
//           {/* <video id='myVideo' style={{ width: '100%' }} autoPlay muted /> */}
//       </Box>
//     );
// }
