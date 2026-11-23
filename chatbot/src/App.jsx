import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import Sidebar from './components/Sidebar'

const App = () => {
  // All chats live here. Each chat: { id, title, messages: [] }
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats')
    return saved ? JSON.parse(saved) : []
  })

  const [activeChatID, setActiveChatID] = useState(() => {
    const saved = localStorage.getItem('activeChatID')
    return saved ? Number(saved) : null
  })

  // IDs of chats that are waiting for a reply (can be more than one)
  const [loadingIds, setLoadingIds] = useState([])

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    if (activeChatID === null) {
      localStorage.removeItem('activeChatID')
    } else {
      localStorage.setItem('activeChatID', activeChatID)
    }
  }, [activeChatID])

  // Messages are NOT separate state anymore. We take them from the active chat.
  const activeChat = chats.find((chat) => chat.id === activeChatID)
  const messages = activeChat ? activeChat.messages : []

  const handleNewChat = () => setActiveChatID(null)
  const handleSelectChat = (chat) => setActiveChatID(chat.id)

  // Add a message to a specific chat, using its id
  const addMessage = (chatId, message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    )
  }

  const handleSend = async (text) => {
    const userMessage = { text, sender: 'user' }

    // Remember which chat this question belongs to
    let chatId = activeChatID

    if (chatId === null) {
      // First message: create the chat right here
      chatId = Date.now()
      setChats((prev) => [
        { id: chatId, title: text.slice(0, 30), messages: [userMessage] },
        ...prev,
      ])
      setActiveChatID(chatId)
    } else {
      addMessage(chatId, userMessage)
    }

    setLoadingIds((prev) => [...prev, chatId])

    try {
      const response = await fetch(
        'https://ai-customer-support-chatbot-gol2.onrender.com/ask',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Something went wrong')
      }

      // The reply goes to the SAME chat where the question was asked
      addMessage(chatId, { text: data.finalData, sender: 'bot' })
    } catch (error) {
      console.log(error)
      addMessage(chatId, { text: error.message, sender: 'bot' })
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== chatId))
    }
  }

  const handleRenameChat = (id, title) => {
  setChats((prev) =>
    prev.map((chat) => (chat.id === id ? { ...chat, title } : chat))
  )
}

const handleDeleteChat = (id) => {
  setChats((prev) => prev.filter((chat) => chat.id !== id))
  if (id === activeChatID) setActiveChatID(null)
}

  return (
    <div className="flex h-screen overflow-hidden">
     <Sidebar
  handleNewChat={handleNewChat}
  handleSelectChat={handleSelectChat}
  handleRenameChat={handleRenameChat}
  handleDeleteChat={handleDeleteChat}
  chats={chats}
  activeChatID={activeChatID}
/>

      <ChatWindow
        messages={messages}
        loading={loadingIds.includes(activeChatID)}
        handleSend={handleSend}
      />
    </div>
  )
}

export default App
