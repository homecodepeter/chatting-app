import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 50,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        max: 50,
    },
    profileImage: {
        type: String,
       },
    friendList: {
        type: Array,
        default: []
    }
});

const User = mongoose.model("users", UserSchema);

export default User;