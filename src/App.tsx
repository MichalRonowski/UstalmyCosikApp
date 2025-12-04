import { useState, useEffect } from 'react'
import './App.css'
import { db } from './firebase/config'
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'

interface Message {
  id: string
  text: string
  createdAt: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Pobierz wiadomości z Firestore
  const fetchMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'))
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate()
      }))
      setMessages(messagesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // Dodaj nową wiadomość do Firestore
  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: Timestamp.now()
      })
      setNewMessage('')
      await fetchMessages()
    } catch (error) {
      console.error('Błąd dodawania wiadomości:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Ustalmy Cosik App</h1>
      <p className="subtitle">Progressive Web App z Firebase Firestore</p>
      
      <div className="card">
        <form onSubmit={handleAddMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Dodawanie...' : 'Dodaj wiadomość'}
          </button>
        </form>

        <div className="messages">
          <h2>Wiadomości:</h2>
          {messages.length === 0 ? (
            <p>Brak wiadomości. Dodaj pierwszą!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message">
                <p>{msg.text}</p>
                <small>{msg.createdAt.toLocaleString('pl-PL')}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
