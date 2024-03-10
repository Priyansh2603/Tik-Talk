import { Badge } from "@chakra-ui/layout";
import { IoMdClose } from "react-icons/io";
import { Text } from "@chakra-ui/react";
import { BsStars } from "react-icons/bs";
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
    display={'flex'}
    alignItems={'center'}
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="green"
      cursor="pointer"
      onClick={handleFunction}
    >
      <Text mr={1}>{user.name}
      </Text>
      <IoMdClose onClick={handleFunction} color="black" />
      <Text display={'flex'} ml={40}>{admin === user._id ? <span style={{display:'flex',alignItems:'center',color:'gold'}}> Admin <BsStars ml={2}/> </span>:<></>} </Text>
    </Badge>
  );
};

export default UserBadgeItem;