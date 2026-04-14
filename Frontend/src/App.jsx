import Header from './components/Header'
import PredictionForm from './components/PredictionForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Header />
        <PredictionForm />
      </div>
    </div>
  )
}