import React, { useEffect, useState } from 'react'
import * as api from '../api'

export default function Contacts() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getUsers()
        setUsers(res.data.data || res.data || [])
      } catch (err) {
        // ignore if backend does not support
      }
    }
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    try {
      const res = await api.addFriend({ email })
      setMessage(res.data.message || 'Friend added')
      setEmail('')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="contacts-page">
      <h3>Contacts</h3>
      <form onSubmit={add} className="add-friend">
        <input placeholder="Friend's email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      {message && <div className="info">{message}</div>}

      <h4>All Users</h4>
      <ul className="user-list">
        {users.length === 0 && <li>No users available</li>}
        {users.map((u) => (
          <li key={u._id}>{u.userName || u.email}</li>
        ))}
      </ul>
    </div>
  )
}
