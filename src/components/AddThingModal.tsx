import { useState } from 'react'
import './AddThingModal.css'

interface AddThingModalProps {
  onAdd: (type: 'KtoCoOgarnia', title: string) => void
  onClose: () => void
}

type Step = 'selectType' | 'enterTitle'

function AddThingModal({ onAdd, onClose }: AddThingModalProps) {
  const [step, setStep] = useState<Step>('selectType')
  const [selectedType, setSelectedType] = useState<'KtoCoOgarnia' | null>(null)
  const [title, setTitle] = useState('')

  const handleSelectType = (type: 'KtoCoOgarnia') => {
    setSelectedType(type)
    setStep('enterTitle')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType && title.trim()) {
      onAdd(selectedType, title.trim())
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {step === 'selectType' ? (
          <>
            <h2>Wybierz typ</h2>
            <div className="type-options">
              <button
                className="type-option"
                onClick={() => handleSelectType('KtoCoOgarnia')}
              >
                <h3>Kto co ogarnia</h3>
                <p>Tabela podziału zadań i obowiązków</p>
              </button>
            </div>
            <button className="cancel-button" onClick={onClose}>
              Anuluj
            </button>
          </>
        ) : (
          <>
            <h2>Podaj tytuł</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Wigilia, Wyjazd..."
                autoFocus
                className="title-input"
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setStep('selectType')}
                >
                  Wstecz
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={!title.trim()}
                >
                  Utwórz
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AddThingModal
