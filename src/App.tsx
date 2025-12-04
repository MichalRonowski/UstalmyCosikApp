import { useState } from 'react'
import './App.css'
import HomeScreen from './components/HomeScreen'
import ThingsList from './components/ThingsList'
import KtoCoOgarnia from './components/KtoCoOgarnia'

type View = 'home' | 'list' | 'detail'

export interface ThingToSettle {
  id: string
  type: 'KtoCoOgarnia'
  title: string
  createdAt: Date
}

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedThing, setSelectedThing] = useState<ThingToSettle | null>(null)

  const handleGoToList = () => {
    setCurrentView('list')
  }

  const handleSelectThing = (thing: ThingToSettle) => {
    setSelectedThing(thing)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setSelectedThing(null)
    setCurrentView('list')
  }

  const handleBackToHome = () => {
    setSelectedThing(null)
    setCurrentView('home')
  }

  return (
    <div className="app">
      {currentView === 'home' && <HomeScreen onNext={handleGoToList} />}
      
      {currentView === 'list' && (
        <ThingsList 
          onSelectThing={handleSelectThing}
          onBack={handleBackToHome}
        />
      )}
      
      {currentView === 'detail' && selectedThing && (
        <KtoCoOgarnia 
          thing={selectedThing}
          onBack={handleBackToList}
        />
      )}
    </div>
  )
}

export default App
