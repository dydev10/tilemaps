import './App.css'
import EditorLayout from './components/EditorLayout'

function App() {

  return (
    <>
      <h1 className="tilemap-title">TileMap Editor</h1>
      <div className="tilemap-card">
        <EditorLayout />
      </div>
      <p className="tilemap-footer">
        Canvas + React
      </p>
    </>
  )
}

export default App;
