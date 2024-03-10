import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  // console.log(req.user);
  if (!content || !chatId) {
    // console.log("Invlaid data passed into request");
    return res.sendStatus(400);
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    })
    res.json(message);
  }
  catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
}
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const deleteOneMessage = async (req, res) => {
  const { mId, deleteForAll } = req.body;
  const userId = req.user.id;
  const message = await Message.findOne({ _id: mId }) // Assuming you have user info in request object

  try {
    // Find the message by ID
    const message = await Message.findById(mId);

    if (!message) {
      console.log("Not found!")
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is authorized to delete the message
    if (message.sender._id.equals(userId)) {
      console.log("Deleting ", message.content, " ", deleteForAll)
      // Sender can delete for all or for self only
      if (deleteForAll) {
        // Delete for all
        await Message.deleteOne({ _id: mId });
        // io.emit('messageDeleted', mId);
        return res.status(200).json({ message: "Message deleted for all participants successfully", success: true });
      } else {
        // Delete for self only
        if (!message.deletedFor.includes(userId)) {
          // Add the user to the deletedFor array
          message.deletedFor.push(userId);
          await message.save();
          // io.emit('messageDeleted', mId);
          return res.status(200).json({ message: "Message deleted for self successfully", success: true });
        } else {
          // Message already deleted for this user
          return res.status(403).json({ error: "Message already deleted for self" });
        }
      }
    } else {
      if (!message.deletedFor.includes(userId)) {
        // Add the user to the deletedFor array
        message.deletedFor.push(userId);
        await message.save();
        // io.emit('messageDeleted', mId);
        return res.status(200).json({ message: "Message deleted for self successfully", success: true });
      } else {
        // Message already deleted for this user
        return res.status(403).json({ error: "Message already deleted for self" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const deleteAllMessages = async(req,res)=>{
  const { chatId } = req.body;
    const userId = req.user.id; // Assuming you have user info in request object
    console.log(chatId," for clear")
    try {
        // Update messages with the specified chatId
        const result = await Message.updateMany({ 'chat': chatId }, { $addToSet: { deletedFor: userId } });

        // Check if any messages were updated
        if (result) {
            return res.status(200).json({ message: "Chat cleared successfully for the user", success: true });
        } else {
            return res.status(404).json({ error: "No messages found for the specified chat ID" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}
export { sendMessage, allMessages, deleteOneMessage ,deleteAllMessages};