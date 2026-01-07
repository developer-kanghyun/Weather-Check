import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchBox } from '@/features/search-location'
import { WEATHER_THEMES, type WeatherStatus } from '@/shared/lib/weather-theme'

function App() {
  const [weather] = useState<WeatherStatus>('Clear');
  const theme = WEATHER_THEMES[weather];

  return (
    <BrowserRouter>
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-700`} />
      
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 lg:px-8 items-center">
                <h1 className="text-3xl font-extrabold text-[#111618] dark:text-white mb-8">Weather Check</h1>
                
                <SearchBox onSelect={(loc) => console.log('Selected:', loc)} />
              </div>
            } 
          />
          <Route path="/detail/:favoriteId" element={<div>상세 페이지 준비 중...</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
