import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ThingToSettle } from '../App'
import './UstalenieDaty.css'

interface UstalenieDatyProps {
  thing: ThingToSettle
  onBack: () => void
}

interface Availability {
  id: string
  name: string
  selectedDays: number[] // day of month (1-31)
}

function UstalenieDaty({ thing, onBack }: UstalenieDatyProps) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [personName, setPersonName] = useState('')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null)
  const [matchingDays, setMatchingDays] = useState<number[]>([])

  useEffect(() => {
    const docRef = doc(db, 'things-to-settle', thing.id)

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setAvailability(data.availability || [])
      }
    }, (error) => {
      console.error('Błąd pobierania danych:', error)
    })

    return () => unsubscribe()
  }, [thing.id])

  // Calculate matching days whenever availability changes
  useEffect(() => {
    if (availability.length === 0) {
      setMatchingDays([])
      return
    }

    // Get all days from first person
    const allDaysSet = new Set(availability[0].selectedDays)

    // Keep only days that are in all people's availability
    const matching = Array.from(allDaysSet).filter(day =>
      availability.every(person => person.selectedDays.includes(day))
    ).sort((a, b) => a - b)

    setMatchingDays(matching)
  }, [availability])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1 // Konwersja: niedziela (0) → 6, poniedziałek (1) → 0
  }

  const formatDateHeader = (date: Date) => {
    const months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Pażdziernik', 'Listopad', 'Grudzień'
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const handleDayClick = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleAddPerson = async () => {
    if (!personName.trim()) {
      alert('Wpisz imię osoby')
      return
    }

    if (selectedDays.length === 0) {
      alert('Zaznacz co najmniej jeden dzień')
      return
    }

    const docRef = doc(db, 'things-to-settle', thing.id)

    try {
      if (editingPersonId) {
        // Update existing person
        const updatedAvailability = availability.map(person =>
          person.id === editingPersonId
            ? { ...person, name: personName, selectedDays: selectedDays.sort((a, b) => a - b) }
            : person
        )
        await updateDoc(docRef, { availability: updatedAvailability })
      } else {
        // Add new person
        const newPerson: Availability = {
          id: crypto.randomUUID(),
          name: personName.trim(),
          selectedDays: selectedDays.sort((a, b) => a - b)
        }
        await updateDoc(docRef, {
          availability: arrayUnion(newPerson)
        })
      }

      setPersonName('')
      setSelectedDays([])
      setEditingPersonId(null)
    } catch (error) {
      console.error('Błąd zapisywania dostępności:', error)
    }
  }

  const handleEditPerson = (person: Availability) => {
    setPersonName(person.name)
    setSelectedDays([...person.selectedDays])
    setEditingPersonId(person.id)
  }

  const handleDeletePerson = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę osobę?')) return

    const docRef = doc(db, 'things-to-settle', thing.id)

    try {
      const updatedAvailability = availability.filter(person => person.id !== id)
      await updateDoc(docRef, { availability: updatedAvailability })
    } catch (error) {
      console.error('Błąd usuwania osoby:', error)
    }
  }

  const handleCancel = () => {
    setPersonName('')
    setSelectedDays([])
    setEditingPersonId(null)
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const dayNames = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd']

  return (
    <div className="ustalenie-daty">
      <div className="ustalenie-header">
        <button className="back-button" onClick={onBack}>← Powrót</button>
        <h1>{thing.title}</h1>
      </div>

      <div className="ustalenie-container">
        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              ←
            </button>
            <h2>{formatDateHeader(currentMonth)}</h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              →
            </button>
          </div>

          <div className="calendar">
            <div className="weekdays">
              {dayNames.map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day, index) => {
                const isMatching = matchingDays.includes(day || 0)
                const isSelected = selectedDays.includes(day || 0)
                const isUsedByOthers = availability.some(
                  person => person.id !== editingPersonId && person.selectedDays.includes(day || 0)
                )

                return (
                  <div
                    key={index}
                    className={`calendar-day ${day ? 'active' : 'empty'} ${isSelected ? 'selected' : ''} ${
                      isMatching && day ? 'matching' : ''
                    } ${isUsedByOthers && !isSelected && day ? 'used-by-others' : ''}`}
                    onClick={() => day && handleDayClick(day)}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Zaznaczone dni</span>
            </div>
            <div className="legend-item">
              <div className="legend-color matching"></div>
              <span>Pasują wszystkim</span>
            </div>
            <div className="legend-item">
              <div className="legend-color used-by-others"></div>
              <span>Dostępne dla innych</span>
            </div>
          </div>
        </div>

        <div className="availability-section">
          <div className="input-section">
            <h3>{editingPersonId ? 'Edytuj osobę' : 'Dodaj osobę'}</h3>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Imię osoby..."
              className="name-input"
            />
            <p className="selected-count">Zaznaczone dni: {selectedDays.length}</p>
            <div className="button-group">
              <button
                className="add-button"
                onClick={handleAddPerson}
                disabled={!personName.trim() || selectedDays.length === 0}
              >
                {editingPersonId ? 'Zapisz' : 'Dodaj'}
              </button>
              {editingPersonId && (
                <button className="cancel-button" onClick={handleCancel}>
                  Anuluj
                </button>
              )}
            </div>
          </div>

          <div className="people-section">
            <h3>Osoby ({availability.length})</h3>
            {availability.length === 0 ? (
              <p className="empty-message">Brak osób. Dodaj pierwszą!</p>
            ) : (
              <div className="people-list">
                {availability.map((person) => (
                  <div key={person.id} className="person-card">
                    <h4>{person.name}</h4>
                    <p className="days-count">Dostępne dni: {person.selectedDays.length}</p>
                    <p className="days-list">{person.selectedDays.join(', ')}</p>
                    <div className="person-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditPerson(person)}
                      >
                        Edytuj
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePerson(person.id)}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {matchingDays.length > 0 && (
            <div className="matching-section">
              <h3>✓ Terminy dla wszystkich</h3>
              <div className="matching-days">
                {matchingDays.map(day => (
                  <span key={day} className="matching-day">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UstalenieDaty
