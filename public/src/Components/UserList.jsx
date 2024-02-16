import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsPersonFillAdd, BsPersonFillDash } from "react-icons/bs"
import { useNavigate } from 'react-router-dom';

export default function UserList({socket, selectedUser,currentUser, setSelectedUser,currentUserFriends}) {
  const [listFriend, setListFriend ] = useState([])
  const [seachUser, setSearchUser] = useState(undefined);
  const [search, setSearch] = useState('');
  const[arrivalMsg, setArrivalMsg] = useState(null)
  const [friends, setFriends] = useState([])
  const [friendId, setFriendId] = useState(undefined);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if(socket.current) {
  //     socket.current.on("updateOnlineUsers", (online) => {
  //       console.log(online)
  //         //  setArrivalMsg({fromSelf: false, message: msg.message, image: msg.image})
  //     })
  //    }
  //  }, [])

   useEffect(() => {
      const getFriendList = async () => {
        if (!localStorage.getItem("user-friends")){
          return null
        }else {
          setFriends(await JSON.parse(localStorage.getItem("user-friends")))
        }  
      }
      getFriendList();
   }, [])

  // const isFriend = friends.find((friend) => friend._id === );

   const handleFriend = async ( user) => {
    try {
      const { data }= await axios.patch(`http://localhost:5000/users/${currentUser._id}/${user._id}`);
  
      if (data) {
        localStorage.setItem(
         "user-friends",
          JSON.stringify(data)
        );
        navigate("/");
        }
      setFriendId(user._id)
      window.location.reload(false);
    } catch (error) {
      console.log(error)
    }
   }

   const searchUser = currentUserFriends?.filter((user) => user.data.name.toLowerCase().includes(search.toLowerCase()));

   const handleUserSelect = (user) => {
        setSelectedUser(user);
        // setMessages(chatMessages[user.id] || []);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
      const res = await axios.post(`http://localhost:5000/users/searchuser`, {search});
      setSearchUser(res.data)
      }

  return (
    <div className='h-[80vh] w-[100%]'>
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button 
          className='bg-transparent ml-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
          onClick={handleSubmit}>Search</button>
        </div>
    <ul className='h-[70vh] overflow-y-scroll scroll-auto'>
    {currentUser.name !== search && seachUser?.map((user) => (
      <div key={user._id} className='flex justify-between items-center p-2 rounded'>
        <li
          onClick={() => handleUserSelect(user)}
          className={`cursor-pointer relative flex items-center ${user === selectedUser ? 'bg-gray-200' : ''} p-2 hover:bg-gray-100 w-[100%]`}
        >
            <div>
      <img src={user.profileImage}
      className='w-[40px] h-[40px] rounded-full'
       alt='/img' />
      </div>
      <div className='ml-4'>
      <h1 className='font-bold'>{user.name}</h1>
      </div>
      <div
      className={socket.current.connected === true ? "bg-green-500 absolute top-[50%] right-[20px] w-[10px] h-[10px] rounded-full" : ""}> </div>
        </li>
        <button onClick={() => handleFriend(user)}>
          {/* {isFriend ? (<BsPersonFillDash />) : (<BsPersonFillAdd className='text-[26px]' />)} */}
          <BsPersonFillAdd className='text-[26px]' />
          </button>
      </div>
       ))} 
    {searchUser?.map((user) => (
      <div key={user.data._id} className='flex justify-between items-center p-2 rounded'>
        <li
          onClick={() => handleUserSelect(user)}
          className={`cursor-pointer flex items-center ${user === selectedUser ? 'bg-gray-200' : ''} p-2 hover:bg-gray-100 w-[100%]`}
        >
            <div className='relative'>
      <img src={user.data.profileImage}
      className='w-[40px] h-[40px] rounded-full'
       alt='/img' />
       {/* {user !== selectedUser ? ( */}
        <div className="bg-red-600 absolute -top-2 -right-2 rounded-full w-[20px] h-[20px] flex items-center justify-center">
          <p className='text-white font-semibold'>2</p>
      </div>
       {/* ): null} */}
      </div>
      <div className='ml-4'>
      <h1 className='font-bold'>{user.data.name}</h1>
      </div>
    
        </li>
        <button onClick={() => handleFriend(user)}>
          {/* {isFriend ? (<BsPersonFillDash />) : (<BsPersonFillAdd className='text-[26px]' />)} */}
          <BsPersonFillDash />
          </button>
      </div>
      ))}
  </ul>
    <div className='mt-[2rem] p-3 rounded-sm bottom-3 flex left-2 bg-slate-800'>
      <div>
      <img src={currentUser.profileImage}
      className='w-[40px] h-[40px] rounded-full'
       alt='/img' />
      </div>
      <div className='ml-4'>
      <h1 className='font-bold text-white'>{currentUser.name}</h1>
      <h3 className=' text-white'>{currentUser.email}</h3>
      </div>
    </div>

  </div>
  )
}
