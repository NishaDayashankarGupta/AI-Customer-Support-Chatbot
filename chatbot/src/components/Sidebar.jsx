import React, { useState, useEffect, useRef } from 'react'

// Ek chat ki row: title + 3 dots + dropdown menu
const ChatItem = ({ chat, active, onSelect, onRename, onDelete }) => {
  const [menu, setMenu] = useState(null) // { top, left } ya null (band)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(chat.title)
  const menuRef = useRef(null)
  const pressTimer = useRef(null)

  // Menu khula ho to: bahar click/tap ya scroll par band karo
  useEffect(() => {
    if (!menu) return

    const closeOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null)
    }
    const closeMenu = () => setMenu(null)

    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('touchstart', closeOutside)
    window.addEventListener('scroll', closeMenu, true)

    return () => {
      document.removeEventListener('mousedown', closeOutside)
      document.removeEventListener('touchstart', closeOutside)
      window.removeEventListener('scroll', closeMenu, true)
    }
  }, [menu])

  // 3 dots click: button ki position se menu ki jagah nikalo
  const openMenu = (e) => {
    e.stopPropagation() // taaki row click (chat open) na chale
    const rect = e.currentTarget.getBoundingClientRect()
    setMenu({ top: rect.bottom + 4, left: rect.right - 144 })
  }

  // Mobile: 500ms long press par menu
  const startPress = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pressTimer.current = setTimeout(() => {
      setMenu({ top: rect.bottom, left: rect.right - 144 })
    }, 500)
  }
  const cancelPress = () => clearTimeout(pressTimer.current)

  const startRename = () => {
    setName(chat.title)
    setEditing(true)
    setMenu(null)
  }

  const saveName = () => {
    if (name.trim()) onRename(chat.id, name.trim())
    setEditing(false)
  }

  const handleDelete = () => {
    setMenu(null)
    if (window.confirm('Delete this chat?')) onDelete(chat.id)
  }

  return (
    <div
      onClick={() => !editing && onSelect(chat)}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      className={`group flex items-center p-3 cursor-pointer rounded-lg hover:bg-gray-700 select-none ${
        active ? 'bg-gray-700' : ''
      }`}
    >
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveName()
            if (e.key === 'Escape') setEditing(false)
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 bg-gray-800 text-white rounded px-2 py-1 outline-none"
        />
      ) : (
        <span className="flex-1 truncate">{chat.title}</span>
      )}

      {/* 3 dots: mobile par hamesha dikhta hai, desktop par hover par */}
      {!editing && (
        <button
          onClick={openMenu}
          aria-label="Chat options"
          className={`ml-2 px-1 rounded hover:bg-gray-600 ${
            menu ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
          }`}
        >
          ⋯
        </button>
      )}

      {/* Dropdown: fixed position, taaki list ke scroll mein cut na ho */}
      {menu && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          style={{ top: menu.top, left: menu.left }}
          className="fixed z-50 w-36 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-1"
        >
          <button
            onClick={startRename}
            className="w-full text-left px-3 py-2 hover:bg-gray-700"
          >
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

const Sidebar = (props) => {
  return (
    <div className="w-64 bg-gray-900 h-screen p-4 text-white flex flex-col">
      <h2 className="text-2xl font-bold mb-8">AI Support</h2>

      <button
        className="w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
        onClick={props.handleNewChat}
      >
        + New Chat
      </button>

      <div className="mt-8 flex-1 overflow-y-auto min-h-0">
        <h3 className="text-lg font-semibold mb-4">Chat History</h3>

        {props.chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            active={chat.id === props.activeChatID}
            onSelect={props.handleSelectChat}
            onRename={props.handleRenameChat}
            onDelete={props.handleDeleteChat}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
