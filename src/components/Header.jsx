import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import styles from './Header.module.css'

export function Header() {
  const { favoritesCount } = useFavorites()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          Met Collection
        </Link>

        <button 
          type="button" 
          className={styles.burgerBtn} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? styles.burgerOpen : ''}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} 
            onClick={closeMenu}
            end
          >
            Головна
          </NavLink>
          <NavLink 
            to="/catalog" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            onClick={closeMenu}
          >
            Каталог
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            onClick={closeMenu}
          >
            Обране <span className={styles.badge}>{favoritesCount}</span>
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            onClick={closeMenu}
          >
            Про нас
          </NavLink>

          <button 
            type="button" 
            className={styles.themeToggleBtn} 
            onClick={toggleTheme}
            aria-label="Переключити тему"
          >
            {theme === 'light' ? (
              
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}