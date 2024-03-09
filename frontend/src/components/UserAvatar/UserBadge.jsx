import { Badge } from "@chakra-ui/layout";
import { IoMdClose } from "react-icons/io";
import { Text } from "@chakra-ui/react";
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
      {admin === user._id && <span> (Admin)</span>}</Text>
      <IoMdClose onClick={handleFunction} color="black" />
    </Badge>
  );
};

export default UserBadgeItem;