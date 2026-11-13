import React from 'react'

const Message = (props) => {
  return (
    <div className={`w-fit p-3 rounded-lg max-w-[70%]
     ${props.sender === 'user' ? 
     'ml-auto bg-blue-600 text-white text-left' :
      'mr-auto bg-gray-200 text-gray-900 text-left'}`}>
      {props.text}
    </div>
  )
}

export default Message