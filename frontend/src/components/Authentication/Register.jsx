import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Flex, Box, Input, Button, Text, Center, VStack, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { ChatState } from '../../Context/chatProvider';
import logo from '../Miscelleneous/img/logo2.png';

export default function Register() {
    const history = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = ChatState();
    const [added, setAdded] = useState("");
    const toastStyles = {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAdded(event.target.value);
        postDetails(event.target.files[0]);
    };

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast.warning("Select an Image,We couldn't find the image...", { style: toastStyles, position: "top-center" });
            setLoading(false);
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "shoeping");
            data.append("cloud_name", "dazhcprb8");
            fetch("https://api.cloudinary.com/v1_1/dazhcprb8/image/upload", {
                method: "post", body: data
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString());
                toast.success('Image Added Successfully!', { style: toastStyles, position: "bottom-center" });
                setLoading(false);
            }).catch((e) => {
                setLoading(false);
            });
        } else {
            toast.error("Please choose image file...", { style: toastStyles, position: "top-center" });
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function submit(e) {
        e.preventDefault();
        try {
            if (!name) return;

            const response = await axios.post(`${process.env.REACT_APP_URL}/users/register`, {
                name, email, password, pic
            });

            if (response.data.exist === "true") {
                toast.info("The Email is already registered!", { style: toastStyles, position: "top-center" });
            } else if (response.data.exist === "false") {
                let userInfo = { ...response.data._doc, "token": response.data.token };
                setUser(userInfo);
                userInfo = JSON.stringify(userInfo);
                localStorage.setItem("userInfo", userInfo);
                document.title = `Tik-Talk (${name})`;
                history("/chats");
                toast.success(`Registered Successfully! as ${name}`, { style: toastStyles, position: "top-center" });
            }
        } catch (error) {
            toast.error("Wrong Details", { style: toastStyles, position: "top-center" });
        }
    }

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: '#bee3f8' }}>
            <Toaster />
            <Center h="100%">
                <Box maxW="lg" px={[4, 0]} mx="auto">
                    <Box bg="white" rounded="md" shadow="md" p={[6, 7]}>
                        <Flex direction="column" align="center">
                            <Image src={logo} alt="Logo" mb={1} width={'auto'} height={28} />
                            <Text fontSize="3xl" fontWeight="bold" color="gray.900">Create an account</Text>
                            <Text mt={1} color="gray.600">Already joined? <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-700">Sign in now</Link></Text>
                        </Flex>
                        <VStack mt={3} spacing={4} align="stretch">
                            <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input type="email" placeholder="Enter email to get started" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? "Hide Password" : "Show Password"}
                                        icon={showPassword ? <AiOutlineEyeInvisible width={10} height={10}/> : <AiOutlineEye  width={14} height={14} />}
                                        onClick={togglePasswordVisibility}
                                        variant="ghost"
                                        colorScheme="gray"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <Flex align="center">
                            <Box mt={1}>
                            <InputGroup>
                                <Input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} />
                                <Input
                                    placeholder={added?added:"Profile Picture"}
                                    readOnly
                                    onClick={() => document.getElementById('file-upload').click()}
                                    cursor="pointer"
                                    _focus={{
                                        boxShadow: 'none',
                                    }}
                                    _hover={{
                                        borderColor: 'blue.400',
                                    }}
                                    pr="5.8rem" // Add padding for the icon
                                />
                                <InputRightElement width="5.5rem" pointerEvents="none"> {/* Adjust width for icon */}
                                <Button
                                    as="label"
                                    htmlFor="file-upload"
                                    colorScheme="blue"
                                    h="1.75rem" // Adjust height for icon
                                    size="sm" // Adjust size for icon
                                    borderRadius="0"
                                    fontWeight="normal"
                                    lineHeight="1"
                                >
                                    {added?'Change':'Browse'}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>


                            </Flex>
                            <Button colorScheme="blue" onClick={submit} isLoading={loading}>
                                {loading ? "Loading..." : "Sign Up"}
                            </Button>
                        </VStack>
                    </Box>
                </Box>
            </Center>
        </div>
    )
}
