import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/chatProvider";
import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import DeleteMsg from "./DeleteMsg";
import { socket } from "../socket";

const ScrollableChat = ({ messages,setMessages }) => {
  const { user } = ChatState();
  const [showOptionsForMessage, setShowOptionsForMessage] = useState({});
  const menuRef = useRef(null);

  const handleToggleOptions = (messageId) => {
    setShowOptionsForMessage((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptionsForMessage({});
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  function formatTime(createdAt) {
    const createdAtTime = new Date(createdAt);
    return createdAtTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  const visibleMessageCount = messages.reduce((count, m) => {
    // Check if message has a deletedFor array
    if (m.deletedFor && m.deletedFor.includes(user._id)) {
        // If user ID is included in deletedFor array, skip this message
        return count;
    } else {
        // Otherwise, include this message in the count
        return count + 1;
    }
}, 0);
  console.log("Vismsg ",visibleMessageCount)
  return (
    <ScrollableFeed>
      {visibleMessageCount>0 ?
        messages.map((m, i) => (
          (m.deletedFor && !m.deletedFor.includes(user._id))&&
          <div
            style={{ display: "flex", cursor: "pointer" }}
            key={m._id}
            onDoubleClick={() => {
              handleToggleOptions(m._id);
            }}
          >
            {isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id) ? (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="9px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            ) : null}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#5EF3F8" : "#E9F5D0"
                }`,
                color: "black",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                display:'flex',
                alignItems:'center',
              }}
              ref={menuRef}
              onClick={(e) => {
                e.stopPropagation();}}
            >
              {m.content+" " }<span style={{fontSize:'9px',display:'flex',alignItems:'end',marginTop:'12px',marginLeft:'4px',color:''}}>{formatTime(m.createdAt)}</span>
              {showOptionsForMessage[m._id] && (
                <Box display={'flex'} alignItems='center'>
                  <Menu >
                  <MenuButton onClick={(e) => {
                    e.stopPropagation(); // Stop propagation to prevent hiding the options menu
                  }}>
                    <BsThreeDotsVertical color="black" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        handleToggleOptions(m._id);
                        // Handle copy action
                      }}
                    >
                      Copy
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // handleToggleOptions(m._id);
                        // Handle delete action
                      }}
                    >
                      <DeleteMsg message={m} handleToggleOptions={handleToggleOptions} messages={messages} setMessages={setMessages}>Delete</DeleteMsg>
                    </MenuItem>
                  </MenuList>
                </Menu>
                </Box>
              )}
            </span>
          </div>
        )):<div style={{display:'flex',height:'100%',width:'100%',justifyContent:'center',color:'black',fontSize:'30px'}}>No Messages to show Please type and start </div>}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
