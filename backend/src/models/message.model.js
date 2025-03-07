import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    SenderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    ReciverId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,

    },
    text:{
        type: String,
        
    },
    image:{
        type: String,
    
    },
},
{
    timestamps: true,
}
);
const Message = mongoose.model('Message',MessageSchema);
export default Message;