import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'
import './Messaging.css'

export default function Messaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    }
  }

  // Fetch messages with selected user
  const fetchMessages = async (otherUserId) => {
    if (!otherUserId) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/direct-chat/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        console.log(`Fetched ${data.length} messages from ${otherUserId}`)
        setMessages(prevMessages => {
          // Merge new messages with existing ones, preventing duplicates
          const messageMap = new Map()
          prevMessages.forEach(m => messageMap.set(m.id, m))
          data.forEach(m => messageMap.set(m.id, m))
          return Array.from(messageMap.values()).sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          )
        })
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }

  // Fetch online status
  const fetchOnlineStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/online/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOnlineUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch online status:', err)
    }
  }

  // Ping online status
  const pingOnlineStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE_URL}/api/online/ping`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Failed to ping online status:', err)
    }
  }

  // Mark conversation as read
  const markAsRead = async (otherUserId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE_URL}/api/conversations/${otherUserId}/mark-read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  // Initialize socket connection
  useEffect(() => {
    if (!user?.id) return

    const token = localStorage.getItem('token')
    socketRef.current = io(API_BASE_URL, {
      auth: { token }
    })

    socketRef.current.on('connect', () => {
      console.log('Connected to server')
    })

    socketRef.current.on('new_message', (message) => {
      console.log('New message received:', message)
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      })
    })

    socketRef.current.on('user_online', (data) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: data.isOnline }))
    })

    fetchConversations()
    fetchOnlineStatus()

    return () => {
      socketRef.current?.disconnect()
    }
  }, [user?.id])

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId)
      markAsRead(selectedUserId)
    }
  }, [selectedUserId])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId) return

    const messageText = newMessage
    setNewMessage('')
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/direct-chat/${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: messageText })
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(prev => {
          // Check if message already exists
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        // Refresh after a short delay to sync with server
        setTimeout(() => fetchMessages(selectedUserId), 500)
      } else {
        // Restore message if send failed
        setNewMessage(messageText)
        console.error('Failed to send message:', await res.text())
      }
    } catch (err) {
      setNewMessage(messageText)
      console.error('Failed to send message:', err)
    }
  }

  const isUserOnline = (userId) => {
    const status = onlineUsers[userId]
    return status?.isOnline === true
  }

  return (
    <div className="messaging-container">
      <div className="conversations-panel">
        <h2>Messages</h2>
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations yet. Start a session to message someone!</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedUserId === conv.userId ? 'active' : ''}`}
                onClick={() => setSelectedUserId(conv.userId)}
              >
                <div className="conv-avatar">
                  <div className="avatar">{conv.name.charAt(0).toUpperCase()}</div>
                  {isUserOnline(conv.userId) && <div className="online-indicator"></div>}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{conv.name}</div>
                  {conv.lastMessage && (
                    <div className="conv-last-msg">
                      {conv.lastMessage.text.length > 40
                        ? conv.lastMessage.text.substring(0, 40) + '...'
                        : conv.lastMessage.text}
                    </div>
                  )}
                </div>
                <div className="conv-time">
                  {conv.lastMessage && (
                    <span>
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-panel">
        {selectedUserId ? (
          <>
            <div className="chat-header">
              <div className="header-user-info">
                <div className="header-avatar">
                  {conversations.find(c => c.userId === selectedUserId)?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="header-name">
                    {conversations.find(c => c.userId === selectedUserId)?.name}
                  </div>
                  <div className={`header-status ${isUserOnline(selectedUserId) ? 'online' : 'offline'}`}>
                    {isUserOnline(selectedUserId) ? '🟢 Online' : '⚪ Offline'}
                  </div>
                </div>
              </div>
            </div>

            <div className="messages-view">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {msg.senderId === user?.id && (
                            <span className="message-status"> ✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form className="message-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" disabled={loading || !newMessage.trim()} className="send-btn">
                {loading ? '⏳' : '📤'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-content">
              <div className="empty-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose someone from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
