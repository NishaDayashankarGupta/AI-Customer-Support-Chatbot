import React, { useState } from 'react'

const ChatInput = ({ sendMessage }) => {

  const [message, setMessage] = useState('')

  const handleSend = () => {
    // console.log(message);

    // trim() → message ke starting aur ending ke extra spaces remove karta hai.
    //  === '' → check karta hai ki message empty hai ya nahi.
    //   return → agar message empty hai toh function wahi stop ho jayega.
    //     onSend(message) → valid message parent ko send karega.

    if (message.trim() === '') {
      return
    }
    sendMessage(message)
    setMessage('')

  }

  return (
    <div className='flex gap-3 mt-4'>

      <input className='flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500'
        type='text'
        value={message}
        placeholder='Type your message...'
        onChange={(e) => {
          setMessage(e.target.value)
        }} 
        onKeyDown={(e) =>{
          if(e.key === 'Enter'){
            handleSend()
          }
        }}/>

      <button className='bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700'
        onClick={handleSend} >
        Send
      </button>

    </div>
  )
}

export default ChatInput