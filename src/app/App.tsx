import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from '@/features/favorite-manage';
import { HomePage } from '@/pages/home/ui/HomePage';
import { DetailPage } from '@/pages/detail/ui/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:locationId" element={<DetailPage />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
