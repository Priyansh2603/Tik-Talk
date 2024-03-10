import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Flex, Box, Input, Button, Text, Center } from '@chakra-ui/react';
import axios from 'axios';
import { Toaster, useToaster, toast } from 'react-hot-toast';
import logo from '../Miscelleneous/img/logo2.png';
import { ChatState } from '../../Context/chatProvider';

export default function Login() {
    const history = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = ChatState();

    async function submit(e) {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_URL}/users/login`, {
                email,
                password,
            });

            if (res.data === "notexist") {
                toast.error("This email is not registered! SignUp to register", { style: { borderRadius: '10px', background: '#333', color: '#fff' }, position: "top-center" });
            } else if (res.data === "Incrorrect") {
                toast.error("Email and Password doesn't match!", { style: { borderRadius: '10px', background: '#333', color: '#fff' }, position: "top-center" })
            } else if (res.data._doc.email === email) {
                const { name } = res.data._doc;
                let userInfo = { ...res.data._doc, token: res.data.token };
                setUser(userInfo);
                userInfo = JSON.stringify(userInfo);
                localStorage.setItem("userInfo", userInfo);
                document.title = `Tik-Talk (${name})`;
                history("/chats");
                toast.success(`Logged in Successfully as ${name}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' }, position: "top-center" });
            }
        } catch (e) {
            toast.error("Login Error!", { style: { borderRadius: '10px', background: '#333', color: '#fff' }, position: "top-center" })
        }
    }

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: '#bee3f8' }}>
            <Toaster />
            <Center h="100%">
                <Box maxW="lg" px={[4, 0]} mx="auto">
                    <Box bg="white" rounded="md" shadow="md" p={[6, 7]}>
                        <Flex direction="column" align="center">
                            <Image src={logo} alt="Logo" mb={4} width={'50'} height={24}/>
                            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Welcome back</Text>
                            <Text mt={2} color="gray.600">Haven't joined yet? <Link to="/register" className="text-blue-600 hover:underline hover:text-blue-700">Join Tik-Talk Now</Link></Text>
                        </Flex>
                        <Box mt={5}>
                            <Input type="email" placeholder="Enter email to get started" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Box>
                        <Box mt={5}>
                            <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Box>
                        <Button mt={5} colorScheme="blue" onClick={submit} w="full">Log in</Button>
                    </Box>
                </Box>
            </Center>
        </div>
    )
}
