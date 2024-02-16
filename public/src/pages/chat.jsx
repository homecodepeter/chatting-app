import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../Components/UserList';
import axios from "axios";
import ChatContainer from '../Components/ChatContainer';
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentuser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUser() {
      if (!localStorage.getItem("chat-app")){
        navigate("/login");
      }else {
        setCurrentuser(await JSON.parse(localStorage.getItem("chat-app")))
        setIsLoading(true);
      }  
    }
    getCurrentUser();
  }, []);

  useEffect(() => {
      if(currentUser) {
        socket.current = io("http://localhost:5000");
        socket.current.emit("add-user", currentUser.user._id);
      }
  }, [currentUser])

  useEffect(() => {
      const getAllUsers = async () => {
        if(currentUser) {
          const { data } = await axios.get(`http://localhost:5000/users/all/${currentUser.user._id}`)
          setUserList(data)
        }
      }
      getAllUsers();
  }, [currentUser])


  return (
     <>
     {isLoading === false ? <h1>Loading......</h1> : (
    <div className="flex h-screen">
      {/* Left Sidebar (User List) */}
      <div className="w-2/6 border-r border-gray-300 p-4">
        <div>
         <UserList userList={userList} 
         socket={socket}
         setSelectedUser={setSelectedUser}
         selectedUser={selectedUser}
         currentUser={currentUser.user}
         currentUserFriends={currentUser.userFriends}
          />
        </div>
      </div>

      {/* Right Sidebar (Chat) */}
     <ChatContainer 
     socket={socket}
     selectedUser={selectedUser}
     currentUser={currentUser.user}
      />
    </div>
     )}
     </>
  );
}

export default Chat;
