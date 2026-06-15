import React, { useEffect, useRef } from 'react'

export default function MessageList({ messages = [] }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="message-list">
      {messages.map((m) => (
        <div key={m.id} className={`message ${m.sender === 'Me' ? 'me' : 'them'}`}>
          <div className="message-text">{m.text}</div>
          <div className="message-meta">{new Date(m.createdAt).toLocaleTimeString()}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
