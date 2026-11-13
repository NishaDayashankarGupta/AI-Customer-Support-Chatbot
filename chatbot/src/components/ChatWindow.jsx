import React, { useState, useEffect, useRef } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'

const ChatWindow = (props) => {


  const [loading, setLoading] = useState(false)


  const bottomRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(props.messages))
  }, [props.messages])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [props.messages])


  const handleSend = async (text) => {

    // 1. Show user message
    {/* sendMessage → ChatInput component ko function pass kar raha hai.
      text → user ka typed message receive karega.
      setMessages → messages state update karega.
      ...messages → purane messages ko preserve karega.
      sender: 'user' → batayega ki message user ne bheja hai. */}

    props.setMessages(prev => [...prev, {
      text: text,
      sender: 'user'
    }])

    setLoading(true)

    try {

      // await new Promise(resolve => setTimeout(resolve, 2000))
      // 2. Send message to backend
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text
        })
      })

      // 3. Get backend response
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Something went worng')
      }

      // 4. Show bot reply
      props.setMessages(prev => [...prev, {
        text: data.finalData,
        sender: 'bot'
      }])

    } catch (error) {
      console.log(error)

      props.setMessages(prev => [...prev, {
        text: error.message,
        sender: 'bot'
      }])
    }
    finally {
      setLoading(false)
    }
  }



  return (
    <div className='flex-1 bg-white p-6 flex flex-col'>
      <h1 className="text-2xl font-bold mb-6">
        AI Customer Support Chatbot
      </h1>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4">
          {props.messages.map((msg, index) => (
            <Message
              key={index}
              text={msg.text}
              sender={msg.sender}
            />
          ))}

          {/* // <Message text="Hello! How can i help you?" sender="bot" />
      // <Message text="Hello, I need help!" sender="user" /> */}

          {loading && (
            <Message
              text="Thinking..."
              sender="bot"
            />
          )}
        </div>

        <div ref={bottomRef}></div>

        <ChatInput sendMessage={handleSend} />
      </div>




    </div>
  )
}

export default ChatWindow