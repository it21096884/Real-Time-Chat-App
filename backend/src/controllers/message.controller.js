import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSideBar = async(req,res)=>{
    try {
        const loggedUserId = req.user.id;
        const filterUser = await User.find({_id:{$ne:loggedUserId}}).select("-password");
        res.status(200).json(filterUser);
    } catch (error) {
        console.log("Error in getUserForSideBar",error);
        res.status(500).json({message:"Internal server error"});
    }

}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user.id;
        const messaged = await Message.find({
            $or:[
                {SenderId:myId,reciverId:userToChatId},
                {SenderId:userToChatId,reciverId:myId}
            ]
        })
        res.status(200).json(messaged);
    } catch (error) {
        console.log("Error in getMessages",error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const sendMessage = async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user.id;

       let imageUrl;
       if(image){
        //upload base64 image to cloudinary
        const UploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = UploadResponse.secure_url;
        }
        const message = new Message({
            senderId,
            reciverId,
            text,
            image:imageUrl
        });
        await message.save();

        //todo:realtime functionality goes here socket.io
    } catch (error) {
        console.log("Error in sendMessage",error);
        res.status(500).json({message:"Internal server error"});
        
    }
}