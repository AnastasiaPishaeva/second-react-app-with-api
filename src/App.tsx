import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import MeowFacts from './pages/meowFacts'
import Books from './pages/books'
import Memes from './pages/meme'


function App() {

  return (
    <BrowserRouter>
      <Header/>
        <Routes>
            <Route path="/" element={<MeowFacts />} />
            <Route path="/memes" element={<Memes />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default App
