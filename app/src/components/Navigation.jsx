// ABOUTME: Sticky top navigation bar with section links and scroll-to behavior.
// ABOUTME: Highlights active section based on scroll position.
import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'comparison', label: 'Compare' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'advantages', label: 'Why HPP' },
  { id: 'data', label: 'Raw Data' },
]

export default function Navigation() {
  const [active, setActive] = useState('hero')

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
        </div>
      </div>
    </nav>
  )
}
