import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    message: {
        text: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        }
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
{ 
    timestamps: true,
}
);

const Messages = mongoose.model("messages", messageSchema);

export default Messages;