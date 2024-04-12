import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/chatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      // alignItems="center"
      flexDir="column"
      p={{base:2,md:2}}
      bg="black"
      color={'white'}
      w={{ base: "100%", md: "69.5%" }}
      // borderRadius="lg"
      height={{base:selectedChat&&'100vh',md:'91.5vh'}}
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;