import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FavoritesProvider } from '@/features/favorite-manage';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { MainLayout } from '@/app/layout/MainLayout';
import { HomePage } from '@/pages/home/ui/HomePage';
import { DetailPage } from '@/pages/detail/ui/DetailPage';

const App = () => {
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
          <Toaster 
            position="bottom-center"
            containerStyle={{
              bottom: 150,
            }}
            toastOptions={{
              className: 'glass-panel !bg-white/80 !text-[#111618] !rounded-full !px-6 !py-3 !shadow-xl !backdrop-blur-md border border-white/20',
              duration: 3000,
            }}
          />
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
