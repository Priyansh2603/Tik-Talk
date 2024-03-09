import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster as ToastContainer, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Image } from '@chakra-ui/react';
import logo from '../Miscelleneous/img/logo2.png'
export default function Register() {
    const history = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    postDetails(event.target.files[0])
    setSelectedFile(file);
    // You can perform additional actions with the selected file, if needed
  };
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast.warning("Select an Image,We couldn't find the image...")
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
                // console.log("Image Added successfully to", data.url.toString())
                toast.success('Image Added Successfully!',
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        position: "bottom-center"
                    }
                )
                setLoading(false);
            }).catch((e) => {
                // console.log("Image Error:", e);
                setLoading(false);
            }
            )
        }
        else {
            toast.error("Please choose image file...")
            setLoading(false);
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        submit(event);
    };

    async function submit(e) {
        e.preventDefault();
        try {
            // console.log("See details")
            // console.log(name,email,password,pic);
            if(!name) return

            const response = await axios.post(`${process.env.APP_URL}/users/register`, {
                name,  email, password, pic
            });
            // console.log("resp:",response);
            if (response.data.exist === "true") {
                toast.info("The Email is already registered!", { theme: "dark", autoClose: 2000, position: "top-center" });
            } else if (response.data.exist === "false") {
                // console.log(response.data._doc._id);
                // loggedIn("true", name,response.data._doc._id,response.data._doc);
                let userInfo = { ...response.data._doc, "token": response.data.token };
                userInfo = JSON.stringify(userInfo)
                localStorage.setItem("userInfo", userInfo);
                // localStorage.setItem('userId',response.data._doc._id);
                // Cookies.set("user",response.data._doc._id,{expires:30});
                document.title = `Tik-Talk (${name})`
                history("/chats");
                toast.success(`Registered Successfully! as ${name}`, { theme: "dark", autoClose: 2000, position: "top-center" });
            }
        } catch (error) {
            toast.error("Wrong Details", { theme: "dark", autoClose: 2000, position: "top-center" });
            console.error(error);
        }
    }

  return (
    <div style={{width:'100vw',height:'100vh'}}>
        <ToastContainer/>
        <section class="relative py-10  sm:py-16 lg:py-24">
    <div class="absolute inset-0">
        <img class="object-cover w-full h-full" style={{backgroundColor:'#bee3f8'}}  alt="" />
    </div>
    {/* <div class="absolute inset-0 bg-gray-900/20"></div> */}

    <div class="relative max-w-lg px-4 mx-auto sm:px-0">
        <div class="overflow-hidden bg-white rounded-md shadow-md">
            <div class="px-4 py-6 sm:px-8 sm:py-7">
                <div class="text-center">
                    {/* <h1 class="text-3xl font-bold text-gray-900">Tik-Talk</h1> */}
                    <div style={{display:'flex',justifyContent:'center'}}><Image width={'auto'} height={20} src={logo}/></div>
                    <h2 class="text-3xl font-bold text-gray-900">Create an account</h2>
                    <p class="mt-2 text-base text-gray-600">Already joined? <Link to="/login" title="" class="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700">Sign in now</Link></p>
                </div>
                    <div class="space-y-5">
                        <div>
                            <label for="" class="text-base font-medium text-gray-900"> First & Last name </label>
                            <div class="mt-2.5">
                                <input type="text" name="" id="" placeholder="Enter your full name" onChange={(e) => setName(e.target.value)} class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>

                        <div>
                            <label for="" class="text-base font-medium text-gray-900"> Email address </label>
                            <div class="mt-2.5">
                                <input type="email" name="" id="" placeholder="Enter email to get started" onChange={(e) => setEmail(e.target.value)} class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>

                        <div>
                            <label for="" class="text-base font-medium text-gray-900"> Password </label>
                            <div class="mt-2.5">
                                <input type="password" name="" id="" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>
                        <div>
                            <label for="" class="text-base font-medium text-gray-900"> Picture</label>
                            <div class="mt-2.5">
                                <input type="file" name="" id="" onChange={handleFileChange} class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" onClick={handleSubmit} class="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">{loading ?  "Loading...": "Sign Up"}</button>
                        </div>

                        {/* <div>
                            <button
                                type="button"
                                class="
                                    relative
                                    inline-flex
                                    items-center
                                    justify-center
                                    w-full
                                    px-4
                                    py-4
                                    text-base
                                    font-semibold
                                    text-gray-700
                                    transition-all
                                    duration-200
                                    bg-white
                                    border-2 border-gray-200
                                    rounded-md
                                    hover:bg-gray-100
                                    focus:bg-gray-100
                                    hover:text-black
                                    focus:text-black focus:outline-none
                                "
                            >
                                <div class="absolute inset-y-0 left-0 p-4">
                                    <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                                        ></path>
                                    </svg>
                                </div>
                                Sign up with Google
                            </button>
                        </div> */}
                    </div>

                <p class="max-w-xs mx-auto mt-5 text-sm text-center text-gray-600">
                    This site is protected by reCAPTCHA and the Google <a href="#" title="" class="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700">Privacy Policy</a> &
                    <a href="#" title="" class="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700">Terms of Service</a>
                </p>
            </div>
            <div>
            </div>
        </div>
    </div>
</section>

    </div>
  )
}
