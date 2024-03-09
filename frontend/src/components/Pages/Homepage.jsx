import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../Miscelleneous/SideDrawer';
import { BsSearch } from "react-icons/bs";
import {FaChevronRight} from "react-icons/fa"
export default function Homepage() {
    const [drawer,setDrawer] = useState(false);
    const history = useNavigate();
    useEffect(()=>{
        const user =  localStorage.getItem("userInfo");
        if(user) history("/chats");
    },[history])
  return (
    <div>
        <SideDrawer/>
    </div>
  )
}
