import React, { useEffect, useState, useRef } from 'react'
import { API_BASE_URL } from '../config'
import { useAuth } from '../context/AuthContext'

export default function Chatbox({ sessionId }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const mounted = useRef(false)

  const fetchMessages = async () => {
    if (!sessionId) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) return
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    mounted.current = true
    fetchMessages()
    const iv = setInterval(fetchMessages, 2000)
    return () => { mounted.current = false; clearInterval(iv) }
  }, [sessionId])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() || !sessionId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      if (res.ok) {
        setText('')
        // optimistic append
        setMessages(prev => [...prev, data])
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbox" style={{ border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px' }}>
      <h4 style={{ marginTop: 0 }}>Chat</h4>
      {!sessionId && <div>Select a session to chat</div>}
      {sessionId && (
        <>
          <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map(m => (
              <div key={m.id} style={{ alignSelf: m.senderId === user?.id ? 'flex-end' : 'flex-start', background: m.senderId === user?.id ? '#dcfce7' : '#f3f4f6', padding: '8px 10px', borderRadius: 8, maxWidth: '80%' }}>
                <div style={{ fontSize: 13, color: '#111' }}>{m.text}</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }} />
            <button type="submit" disabled={loading} className="btn btn-primary">Send</button>
          </form>
        </>
      )}
    </div>
  )
}
