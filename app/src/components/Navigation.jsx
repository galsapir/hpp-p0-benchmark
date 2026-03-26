// ABOUTME: Sticky top navigation bar with section links, scroll-to, and light/dark toggle.
// ABOUTME: Highlights active section based on scroll position. Persists theme to localStorage.
import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'quotes', label: 'Fact Check' },
  { id: 'comparison', label: 'Full Responses' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'advantages', label: 'Why HPP' },
  { id: 'data', label: 'Raw Data' },
]

function getInitialTheme() {
  const stored = localStorage.getItem('hpp-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

export default function Navigation() {
  const [active, setActive] = useState('hero')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('hpp-theme', theme)
  }, [theme])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => scrollTo('hero')}>
          HPP BENCHMARK
        </button>
        <div className="nav-links">
          {sections.map(s => (
            <button
              key={s.id}
              className={`nav-link ${active === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
          <div className="theme-toggle" style={{ marginLeft: 8 }}>
            <button
              className={`theme-toggle-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Light mode"
            >
              ☀️
            </button>
            <button
              className={`theme-toggle-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Dark mode"
            >
              🌙
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
