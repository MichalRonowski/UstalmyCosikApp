import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ThingToSettle } from '../App'
import './KtoCoOgarnia.css'

interface KtoCoOgarniaProps {
  thing: ThingToSettle
  onBack: () => void
}

interface Row {
  id: string
  kto: string
  coOgarnia: string
}

function KtoCoOgarnia({ thing, onBack }: KtoCoOgarniaProps) {
  const [rows, setRows] = useState<Row[]>([])
  const [editingRow, setEditingRow] = useState<Row | null>(null)

  useEffect(() => {
    const docRef = doc(db, 'things-to-settle', thing.id)
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setRows(data.rows || [])
      }
    }, (error) => {
      console.error('Błąd pobierania danych:', error)
    })

    return () => unsubscribe()
  }, [thing.id])

  const handleAddRow = () => {
    const newRow: Row = {
      id: crypto.randomUUID(),
      kto: '',
      coOgarnia: ''
    }
    setRows([...rows, newRow])
    setEditingRow(newRow)
  }

  const handleEditRow = (row: Row) => {
    setEditingRow({ ...row })
  }

  const handleSaveRow = async () => {
    if (!editingRow) return

    const docRef = doc(db, 'things-to-settle', thing.id)
    
    try {
      // Find the old row and replace it
      const oldRow = rows.find(r => r.id === editingRow.id)
      
      if (oldRow) {
        // Update existing row
        await updateDoc(docRef, {
          rows: rows.map(r => r.id === editingRow.id ? editingRow : r)
        })
      } else {
        // Add new row
        await updateDoc(docRef, {
          rows: arrayUnion(editingRow)
        })
      }
      
      setEditingRow(null)
    } catch (error) {
      console.error('Błąd zapisywania wiersza:', error)
    }
  }

  const handleDeleteRow = async (row: Row) => {
    if (!confirm('Czy na pewno chcesz usunąć ten wiersz?')) return

    const docRef = doc(db, 'things-to-settle', thing.id)
    
    try {
      await updateDoc(docRef, {
        rows: arrayRemove(row)
      })
      
      // If we were editing this row, cancel editing
      if (editingRow?.id === row.id) {
        setEditingRow(null)
      }
    } catch (error) {
      console.error('Błąd usuwania wiersza:', error)
    }
  }

  const handleCancelEdit = () => {
    // If it's a new row that was never saved, remove it from local state
    if (editingRow && !rows.find(r => r.id === editingRow.id && r.kto && r.coOgarnia)) {
      setRows(rows.filter(r => r.id !== editingRow.id))
    }
    setEditingRow(null)
  }

  const isRowBeingEdited = (row: Row) => editingRow?.id === row.id

  return (
    <div className="kto-co-ogarnia">
      <div className="header">
        <button className="back-button" onClick={onBack}>← Powrót</button>
        <h1>{thing.title}</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Kto</th>
              <th>Co ogarnia</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={isRowBeingEdited(row) ? 'editing' : ''}>
                <td>
                  {isRowBeingEdited(row) ? (
                    <input
                      type="text"
                      value={editingRow!.kto}
                      onChange={(e) => setEditingRow({ ...editingRow!, kto: e.target.value })}
                      placeholder="Wpisz imię..."
                      autoFocus
                    />
                  ) : (
                    row.kto || <span className="empty">-</span>
                  )}
                </td>
                <td>
                  {isRowBeingEdited(row) ? (
                    <input
                      type="text"
                      value={editingRow!.coOgarnia}
                      onChange={(e) => setEditingRow({ ...editingRow!, coOgarnia: e.target.value })}
                      placeholder="Wpisz zadanie..."
                    />
                  ) : (
                    row.coOgarnia || <span className="empty">-</span>
                  )}
                </td>
                <td className="actions">
                  {isRowBeingEdited(row) ? (
                    <>
                      <button className="save-btn" onClick={handleSaveRow}>✓</button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>✕</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => handleEditRow(row)}>✎</button>
                      <button className="delete-btn" onClick={() => handleDeleteRow(row)}>🗑</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-row-button" onClick={handleAddRow} disabled={!!editingRow}>
          + Dodaj wiersz
        </button>
      </div>
    </div>
  )
}

export default KtoCoOgarnia
