import './HomeScreen.css'

interface HomeScreenProps {
  onNext: () => void
}

function HomeScreen({ onNext }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <h1>Ustalmy Cosik</h1>
      <p className="subtitle">Wspólne ustalenia w czasie rzeczywistym</p>
      
      <button className="main-button" onClick={onNext}>
        COSIK DO USTALENIA
      </button>
    </div>
  )
}

export default HomeScreen
