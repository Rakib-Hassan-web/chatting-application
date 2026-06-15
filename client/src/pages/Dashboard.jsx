import React from 'react'
import { Outlet, Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Contacts from './Contacts'
import Groups from './Groups'
import Profile from './Profile'
import Chat from '../components/Chat'

export default function Dashboard() {
  return (
    <div className="app dashboard">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<div className="placeholder">Select a conversation</div>} />
          <Route path="/chat/:type/:id" element={<Chat />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
