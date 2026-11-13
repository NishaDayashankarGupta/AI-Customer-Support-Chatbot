import React from 'react'

const Sidebar = (props) => {

  // const handleNewChat = () => {
  //   console.log('new chat clicked');

  // }
  return (
    <div className='w-64 bg-gray-900 min-h-screen p-4 text-white'>

      <h2 className='text-2xl font-bold mb-8'>
        AI Support
      </h2>

      <button className='w-full bg-blue-600 p-3 rounded-lg hover:bg-blue-700'
        onClick={props.handleNewChat}>

        + New Chat
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Chat History
        </h3>

        {props.chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => props.handleSelectChat(chat)}
            className="p-3 cursor-pointer hover:bg-gray-700 rounded-lg"
          >
            {chat.title}
          </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar