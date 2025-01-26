import { useState } from 'react'
import './App.css'
import TileCamera from './components/TileCamera'
// import PreviewImage from './components/PreviewImage'
import PreviewEditor from './components/PreviewEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <TileCamera />
        {/* <PreviewImage /> */}
        <PreviewEditor />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
