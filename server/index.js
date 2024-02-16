import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.js";
import messagesRoutes from "./Routes/messagesRoutes.js"
import usersRoutes from "./Routes/user.js"
import { Server } from 'socket.io';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/auth", authRoutes)
app.use("/api/messages", messagesRoutes);
app.use("/users", usersRoutes);

const PORT = process.env.PORT || 6001;
const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true, // Corrected typo here
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", { message: data.message, image: data.image });
        }
    })

})