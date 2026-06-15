import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="profile-page">
      <h3>My Profile</h3>
      <div>
        <strong>Email:</strong> {user?.email}
      </div>
      <div>
        <strong>Username:</strong> {user?.userName || '—'}
      </div>
    </div>
  )
}
