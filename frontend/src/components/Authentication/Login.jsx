import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Toaster, useToaster,toast } from 'react-hot-toast';
import { ChatState } from '../../Context/chatProvider';
import logo from '../Miscelleneous/img/logo2.png'
import { Image } from '@chakra-ui/react';
export default function Login() {
    const history = useNavigate();
    const [email,setEmail]= useState("");
  const [password, setPassword] = useState("");
  const {setUser} = ChatState();
    async function submit(e){
        e.preventDefault();
        // console.log(email,password);
        try{
            const res = await axios.post(`${process.env.APP_URL}/users/login`, {
               email, password,
              });
              // console.log("yaha tak")
              // console.log(res.data);
              if(res.data==="notexist"){
                // console.log("Ha bhai nahi hai")
                toast.error("This email is not registered! SignUp to register",{style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },position:"top-center"});
            }
            else if(res.data==="Incrorrect"){
                toast.error("Email and Password doesn't match!",{style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },position:"top-center"})
            }
             else if (res.data._doc.email===email) {
                // Assuming the response structure is { email, name, ...otherUserData }
                // console.log("Login:",res.data);
                const { name } = res.data._doc;
                // console.log("from login",res.data._doc._id)
                // console.log(res.data._doc);
                // loggedIn(true,name,res.data._id,res.data);
                let userInfo = {...res.data._doc,token:res.data.token}
                setUser(userInfo);
                userInfo = JSON.stringify(userInfo);
                localStorage.setItem("userInfo",userInfo);
                // Cookies.set("user",res.data._id,{expires:30});
                document.title=`Tik-Talk (${name})`
                history("/chats");
                toast.success(`Logged in Successfully as ${name}`,{style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },position:"top-center"});
              }
            
            
        }
        catch(e){
            // console.log(e);
            toast.error("Login Error!",{style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },position:"top-center"})
        }
      }
  return (
    <div style={{height:'100vh',width:'100vw',backgroundColor:'#bee3f8'}}>
        <Toaster/>
        <section class="relative py-10 sm:py-16 lg:py-24">
    {/* <div class="absolute inset-0">
        <img style={{ height:'100vh',backgroundColor:''}} class="object-cover w-full h-full" alt="" />
    </div> */}
    {/* <div class="absolute inset-0 bg-gray-900/20"></div> */}

    <div class="relative max-w-lg px-4 mx-auto sm:px-0">
        <div class="overflow-hidden bg-white rounded-md shadow-md" style={{justifyContent:'center',alignItems:'center'}}>
            <div class="px-4 py-6 sm:px-8 sm:py-7">
                <div class="text-center">
                <div style={{display:'flex',justifyContent:'center'}}><Image width={'auto'} height={20} src={logo}/></div>
                    <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p class="mt-2 text-base text-gray-600">Haven't joined yet? <Link to={'/register'} title="" class="text-blue-600 transition-all duration-200 hover:underline hover:text-blue-700">Join Tik-Talk Now</Link></p>
                </div>
                    <div class="space-y-5">
                        <div>
                            <label for="" class="text-base font-medium text-gray-900"> Email address </label>
                            <div class="mt-2.5">
                                <input type="email" name="" id="" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email to get started" class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <label for="" class="text-base font-medium text-gray-900" > Password </label>

                                <a href="#" title="" class="text-sm font-medium transition-all duration-200 text-rose-500 hover:text-rose-600 focus:text-rose-600 hover:underline"> Forgot password? </a>
                            </div>
                            <div class="mt-2.5">
                                <input type="password" name=""  id="" placeholder="Enter your password" onChange={(e)=>{setPassword(e.target.value)}} class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" onClick={submit} class="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">Log in</button>
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
                                Sign in with Google
                            </button> */}
                        {/* </div> */}
                    </div>
            </div>
        </div>
    </div>
</section>

    </div>
  )
}
