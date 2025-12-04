import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, Timestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ThingToSettle } from '../App'
import AddThingModal from './AddThingModal'
import './ThingsList.css'

interface ThingsListProps {
  onSelectThing: (thing: ThingToSettle) => void
  onBack: () => void
}

function ThingsList({ onSelectThing, onBack }: ThingsListProps) {
  const [things, setThings] = useState<ThingToSettle[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'things-to-settle'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const thingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type,
        title: doc.data().title,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as ThingToSettle[]
      
      setThings(thingsData)
      setLoading(false)
    }, (error) => {
      console.error('Błąd pobierania rzeczy do ustalenia:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddThing = async (type: 'KtoCoOgarnia', title: string) => {
    try {
      await addDoc(collection(db, 'things-to-settle'), {
        type,
        title,
        createdAt: Timestamp.now(),
        rows: []
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Błąd dodawania rzeczy do ustalenia:', error)
    }
  }

  return (
    <div className="things-list">
      <div className="things-list-header">
        <button className="back-button" onClick={onBack}>← Powrót</button>
        <h1>Rzeczy do ustalenia</h1>
      </div>

      <button className="add-thing-button" onClick={() => setShowAddModal(true)}>
        + Dodaj nową
      </button>

      {loading ? (
        <p className="loading">Ładowanie...</p>
      ) : things.length === 0 ? (
        <p className="empty-state">Brak rzeczy do ustalenia. Dodaj pierwszą!</p>
      ) : (
        <div className="things-grid">
          {things.map((thing) => (
            <div
              key={thing.id}
              className="thing-card"
              onClick={() => onSelectThing(thing)}
            >
              <h3>{thing.title}</h3>
              <p className="thing-type">{thing.type}</p>
              <small>{thing.createdAt.toLocaleDateString('pl-PL')}</small>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddThingModal
          onAdd={handleAddThing}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

export default ThingsList
