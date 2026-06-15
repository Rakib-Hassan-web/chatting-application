import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { getMessages, sendMessage as sendMessageApi } from '../api'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

export default function Chat() {
  const { id, type } = useParams()
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    // load existing messages if backend supports
    const load = async () => {
      if (!id) return
      try {
        const res = await getMessages(id)
        setMessages(res.data.data || [])
      } catch (err) {
        // ignore missing endpoint
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (!id) return
    socketRef.current = io(SERVER_URL, { transports: ['websocket'] })
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', { room: id })
    })

    socketRef.current.on('message', (msg) => {
      // only accept messages for this room
      if (!msg || (msg.conversation && msg.conversation !== id)) return
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socketRef.current.emit('leave', { room: id })
      socketRef.current.disconnect()
    }
  }, [id])

  const handleSend = async (text) => {
    if (!text) return
    const msg = {
      id: Math.random().toString(36).slice(2, 9),
      text,
      createdAt: Date.now(),
      sender: 'Me',
      conversation: id,
      type,
    }
    setMessages((prev) => [...prev, msg])

    // emit via socket if available
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', msg)
    }

    // persist via API if available
    try {
      await sendMessageApi({ conversation: id, content: text })
    } catch (err) {
      // ignore if endpoint missing
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">{type === 'group' ? 'Group' : 'Direct Message'}</header>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  )
}
