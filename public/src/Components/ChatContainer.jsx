import React, { useEffect, useRef, useState } from 'react'
import Input from './Input';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid"

export default function ChatContainer({selectedUser, currentUser, socket }) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true);
    const [arrivalMsg, setArrivalMsg] = useState(null)
    const scrollRef = useRef();

    useEffect(() => {
         const getAllMessage = async () => {
            if(selectedUser) {
              const response = await axios.post("http://localhost:5000/api/messages/getmsg", {
                from: currentUser._id,
                to: selectedUser.data._id,
              })
              setMessages(response.data);
            }
         }
         getAllMessage();
         setLoading(false)
    }, [selectedUser])

    const handleSendMsg = async (msg, image) => {
          await axios.post(`http://localhost:5000/api/messages/addmsg`, {
            from: currentUser._id,
            to: selectedUser.data._id,
            message: msg,
            image: image
          })
          socket.current.emit("send-msg", {
            to: selectedUser.data._id,
            from: currentUser._id,
            message: msg,
            image: image
           })

          const msgs = [...messages];
          msgs.push({fromSelf: true, message: msg, image: image})
          setMessages(msgs);
    }

     useEffect(() => {
      if(socket.current) {
        socket.current.on("msg-recieve", (msg) => {
          console.log(msg)
             setArrivalMsg({fromSelf: false, message: msg.message, image: msg.image})
        })
       }
     }, [])

     useEffect(() => {
      arrivalMsg && setMessages((prev) => [...prev, arrivalMsg])
   }, [arrivalMsg])

   useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [messages])

  console.log(messages)

  return (
    <>
    {loading === true ? <h1>Loading....</h1> : (
      <div className="w-3/4 p-4">
          <div className="mb-4 flex justify-between">
            <h2 className="text-2xl font-bold">{selectedUser ? `Chat with ${selectedUser.data.name}` : 'Select a user to start chatting'}</h2>
            <button  onClick={() => {localStorage.clear()}}
            className='border-1 p-2 bg-slate-800 text-white rounded'>Sign Out</button>
          </div>
          <div className="chat-container h-[70vh] overflow-y-scroll scroll-auto">
          {!selectedUser && (
             <div className="h-[70vh] flex flex-col justify-center items-center">
             <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome, {currentUser.name}!</h1>
             <p className="text-lg text-gray-700">Start chatting with your friends.</p>
           </div>
          )}
            {messages.map((message) => (
              <div 
              ref={scrollRef}
              key={uuidv4()}
               className={`mb-2 ${message.fromSelf ? 'w-[100%] flex justify-end' : 'w-[100%] flex justify-start'}`}>
              <div
                className={`mb-1 ${message.fromSelf ? 'max-w-md mr-3 rounded font-semibold' : 'max-w-md rounded-bl-lg rounded-br-lg rounded-tr-lg bg-indigo-600 text-white'} p-2 bg-gray-200 `}
              >
                {message.image && (
                  <img src={message.image}
                  className='rounded w-[280px] h-[250px]'
                   alt='' />
                )}
                <p>{message.message}</p>
              </div>
                 </div>
            ))}
          </div>
        <Input selectedUser={selectedUser} handleSendMsg={handleSendMsg} />
        </div>
    )}
    </>
  )
}
