import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import SubjectDetail from './pages/SubjectDetail'
import Search from './pages/Search'
import Requests from './pages/Requests'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import OfflineLibrary from './pages/OfflineLibrary'
import PdfViewer from './pages/PdfViewer'

function App() {
  return (
    <div className="bg-surface text-on-surface font-sans antialiased min-h-screen flex flex-col md:max-w-md md:mx-auto md:border-x md:border-outline-variant">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subject/:code" element={<SubjectDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/offline" element={<OfflineLibrary />} />
        <Route path="/pdf/:code/:examType/:year" element={<PdfViewer />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App