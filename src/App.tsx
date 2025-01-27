import './App.css'
// import TileCamera from './components/TileCamera'
import PreviewImage from './components/PreviewImage'
// import PreviewEditor from './components/PreviewEditor'
import EditorLayout from './components/EditorLayout'

function App() {

  return (
    <>
      <div className="card">
        {/* <TileCamera /> */}
        {/* <PreviewImage /> */}
        {/* <PreviewEditor /> */}
        <EditorLayout />
      </div>
      <p className="read-the-docs">
        HTML Canvas + React
      </p>
    </>
  )
}

export default App;
