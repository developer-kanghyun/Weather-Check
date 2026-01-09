import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from '@/features/favorite-manage';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { MainLayout } from '@/app/layout/MainLayout';
import { HomePage } from '@/pages/home/ui/HomePage';
import { DetailPage } from '@/pages/detail/ui/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/detail/:locationId" element={<DetailPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
