import { useState } from 'react'
import './App.css'
import HomeScreen from './components/HomeScreen'
import ThingsList from './components/ThingsList'
import KtoCoOgarnia from './components/KtoCoOgarnia'
import UstalenieDaty from './components/UstalenieDaty'

type View = 'home' | 'list' | 'detail'

export interface ThingToSettle {
  id: string
  type: 'KtoCoOgarnia' | 'UstalenieDaty'
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
        selectedThing.type === 'KtoCoOgarnia' ? (
          <KtoCoOgarnia 
            thing={selectedThing}
            onBack={handleBackToList}
          />
        ) : selectedThing.type === 'UstalenieDaty' ? (
          <UstalenieDaty 
            thing={selectedThing}
            onBack={handleBackToList}
          />
        ) : null
      )}
    </div>
  )
}

export default App
