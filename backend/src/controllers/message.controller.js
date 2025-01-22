import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId ,io} from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    
    try {

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers)
        
    } catch (error) {
         console.log("Error in getUsersForSidebar Controller:", error.message)
         res.status(500).json({message:"Internal Server Error"})
    }

}


export const getMessage = async (req, res) => {
    
    try {
        const { userToChatid } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                 {senderId: myId, receiverId: userToChatid},
                 {senderId:userToChatid,receiverId:myId}
             ]

        });
        res.status(200).json(messages);
    } catch (error) {
         console.log("Error in getMessage Controller:", error.message)
         res.status(500).json({message:"Internal Server Error"})
    }

}



export const sendMessage = async (req, res) => {
    
    try {
        const { text, image } = req.body;

        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if (image) {
            const uploadsRespoonse = await cloudinary.uploader.upload(image)
            imageUrl = uploadsRespoonse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,    
        });

        await newMessage.save();

        const ReceiverSocketId = getReceiverSocketId(receiverId)
        if (ReceiverSocketId) {
            io.to(ReceiverSocketId).emit("newMessage",newMessage)
        }

        res.status(200).json(newMessage)
        
    } catch (error) {
         console.log("Error in sendMessage Controller:", error.message)
         res.status(500).json({message:"Internal Server Error"})
    }

}