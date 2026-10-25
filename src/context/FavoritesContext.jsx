import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('met_favorites')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Помилка зчитування обраного з localStorage:', e)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('met_favorites', JSON.stringify(favorites))
    } catch (e) {
      console.error('Помилка збереження обраного в localStorage:', e)
    }
  }, [favorites])

  const toggleFavorite = (artwork) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === artwork.id)
      if (exists) {
        return prev.filter((item) => item.id !== artwork.id)
      }
      return [...prev, artwork]
    })
  }

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === Number(id))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}