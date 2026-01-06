import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route path="/" element={<div className="p-8 text-2xl font-bold text-black">홈페이지 준비 중...</div>} />
          <Route path="/detail/:favoriteId" element={<div>상세 페이지 준비 중...</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
