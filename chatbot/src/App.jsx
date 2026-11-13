import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import Sidebar from './components/Sidebar'

const App = () => {

  // message save update

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    return savedMessages ? JSON.parse(savedMessages) : []
  })

  // history saved in sidebar
   const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chats')
    return savedChats ? JSON.parse(savedChats) : []
  })

  useEffect(() => {

    localStorage.setItem('chats', JSON.stringify(chats))
  }, [chats])


  const [activeChatID, setActiveChatID] = useState(null)

  useEffect(() => {

    if (messages.length === 0) return

    if (activeChatID === null) {
      const newChatId = Date.now()
      setActiveChatID(newChatId)

      setChats(prev =>[...prev, {
        id: newChatId,
        title: messages.find(msg => msg.sender === 'user')?.text || 'New Chat',
        messages: messages
      }])
    }
   else {
  setChats(prev =>
    prev.map(chat =>
      chat.id === activeChatID
        ? { ...chat, 
           title: messages.find(msg => msg.sender === 'user')?.text || chat.title,
          messages: messages }
        : chat
    )
  )
}

  }, [messages, activeChatID])



 



  //new btn click message empty

  const handleNewChat = () => {
    setMessages([])
    setActiveChatID(null)
  }

  return (
    <div className='flex min-h-screen'>
      <Sidebar 
      handleNewChat={handleNewChat} 
      chats={chats}/>

      <ChatWindow messages={messages} setMessages={setMessages} />
    </div>
  )
}

export default App