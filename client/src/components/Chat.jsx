import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams, useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { getMessages, sendMessage as sendMessageApi, getUsers, addFriend, getConversations } from '../api'
import { useAuth } from '../context/AuthContext'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

export default function Chat() {
  const { id, type } = useParams()
  const { user, token: contextToken } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    // load existing messages if backend supports
    const load = async () => {
      if (!id) return
      try {
        const res = await getMessages(id)
        const raw = res.data.data || []
        const normalized = raw.map((m) => ({
          id: m._id || m.id,
          text: m.content || m.text || '',
          createdAt: m.createdAt || m.createdAt,
          sender: (m.sender && (m.sender.userName || m.sender.email)) || m.sender || 'Unknown',
          senderId: m.sender && m.sender._id ? m.sender._id : m.senderId || null,
          conversation: m.conversation || id,
        }))
        setMessages(normalized)
      } catch (err) {
        // ignore missing endpoint
      }
    }
    load()
  }, [id])

  useEffect(() => {
    // load all users so the UI can start new chats
    const loadUsers = async () => {
      try {
        const res = await getUsers()
        setUsers(res.data.data || [])
      } catch (err) {
        // ignore if backend not ready or auth missing
      }
    }
    loadUsers()
  }, [])

  useEffect(() => {
    if (!id) return
    const token = contextToken || user?.accessToken || user?.token || (typeof window !== 'undefined' && window.__ACCESS_TOKEN__) || (typeof window !== 'undefined' && localStorage.getItem('accessToken')) || null
    const auth = token ? { token } : undefined
    socketRef.current = io(SERVER_URL, { transports: ['websocket', 'polling'], withCredentials: true, auth })

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', { room: id })
    })

    socketRef.current.on('message', (msg) => {
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
      sender: user?.userName || user?.email || 'Me',
      senderId: user?._id || null,
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

  const startChatWithUser = async (otherUser) => {
    if (!otherUser || !otherUser.email) return
    if (otherUser.email === user?.email) return
    try {
      const res = await addFriend({ email: otherUser.email })
      const conv = res.data.data
      if (conv && conv._id) {
        navigate(`/chat/dm/${conv._id}`)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || ''
      if (msg && msg.toLowerCase().includes('already')) {
        // find existing conversation and navigate
        try {
          const all = await getConversations()
          const convs = all.data.data || []
          const found = convs.find((c) => {
            const other = c.creator?._id === user?._id ? c.participent : c.creator
            return other && (other._id === otherUser._id || other.email === otherUser.email)
          })
          if (found && found._id) navigate(`/chat/dm/${found._id}`)
        } catch (innerErr) {
          // ignore
        }
      }
    }
  }

  return (
    <div className="chat-container chat-layout">
      <div className="chat-users">
        <h4>All Users</h4>
        {users.length === 0 && <div className="muted">No users</div>}
        <ul className="user-list">
          {users.map((u) => (
            <li key={u._id} className="user-item">
              <button className="user-link" onClick={() => startChatWithUser(u)}>{u.userName || u.email}</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <header className="chat-header">{type === 'group' ? 'Group' : 'Direct Message'}</header>
        <MessageList messages={messages} currentUserId={user?._id} />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}
