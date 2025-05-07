import { Route, Routes } from 'react-router-dom'
import './App.css'
import BoardList from './pages/BoardList'
import BoardPage from './pages/BoardPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<BoardList />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
    </Routes>
  )
}

export default App
