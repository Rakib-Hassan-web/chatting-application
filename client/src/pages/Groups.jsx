import React, { useState, useEffect } from 'react'
import * as api from '../api'

export default function Groups() {
  const [name, setName] = useState('')
  const [groups, setGroups] = useState([])
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getConversations()
        setGroups(res.data.data || [])
      } catch (err) {}
    }
    load()
  }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      const res = await api.createGroup({ name })
      setMsg(res.data.message || 'Group created')
      setName('')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="groups-page">
      <h3>Groups</h3>
      <form onSubmit={create} className="create-group">
        <input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {msg && <div className="info">{msg}</div>}

      <ul className="group-list">
        {groups.length === 0 && <li>No groups yet</li>}
        {groups.map((g) => (
          <li key={g._id}>{g.name}</li>
        ))}
      </ul>
    </div>
  )
}
