import React, { useEffect, useRef } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'

// This component now only SHOWS things. All data and logic are in App.
const ChatWindow = (props) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [props.messages, props.loading])

  return (
    <div className="flex-1 bg-white p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-6">AI Customer Support Chatbot</h1>

      {/* Sirf ye hissa scroll hoga */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {props.messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        {props.loading && <Message text="Thinking..." sender="bot" />}
        <div ref={bottomRef}></div>
      </div>

      {/* Ye fixed rahega */}
      <div className="shrink-0 pt-4">
        <ChatInput sendMessage={props.handleSend} />
      </div>
    </div>
  )
}

export default ChatWindow
