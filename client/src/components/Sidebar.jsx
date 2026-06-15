import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h3>Chat App</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Chats</NavLink>
        <NavLink to="/contacts" className={({isActive}) => isActive ? 'active' : ''}>Contacts</NavLink>
        <NavLink to="/groups" className={({isActive}) => isActive ? 'active' : ''}>Groups</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="user">{user?.email}</div>
        <button onClick={logout}>Logout</button>
      </div>
    </aside>
  )
}
