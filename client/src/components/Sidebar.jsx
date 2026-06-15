import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getConversations } from '../api'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [convs, setConvs] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getConversations()
        setConvs(res.data.data || [])
      } catch (err) {
        // ignore if backend not ready
      }
    }
    load()
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h3>Chat App</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Chats
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contacts
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => (isActive ? 'active' : '')}>
          Groups
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
      </nav>

      <div className="conv-list">
        <h4>Conversations</h4>
        <ul>
          {convs.length === 0 && <li className="muted">No conversations yet</li>}
          {convs.map((c) => {
            const other = c.creator?._id === user?._id ? c.participent : c.creator
            return (
              <li key={c._id} className="conv-item">
                <Link to={`/chat/dm/${c._id}`}>{other?.userName || other?.email || 'User'}</Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user">{user?.email}</div>
        <button onClick={logout}>Logout</button>
      </div>
    </aside>
  )
}
