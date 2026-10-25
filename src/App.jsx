import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { DetailsPage } from './pages/DetailsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

function RouteTitleAndScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)

    if (pathname === '/') {
      document.title = 'Головна | Met Collection'
    } else if (pathname.startsWith('/catalog') && pathname !== '/catalog') {
      document.title = 'Деталі експоната | Met Collection'
    } else if (pathname === '/catalog') {
      document.title = 'Каталог експонатів | Met Collection'
    } else if (pathname === '/favorites') {
      document.title = 'Обрані експонати | Met Collection'
    } else if (pathname === '/about') {
      document.title = 'Про проєкт | Met Collection'
    } else {
      document.title = 'Сторінку не знайдено | Met Collection'
    }
  }, [pathname])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <RouteTitleAndScroll />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<DetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App