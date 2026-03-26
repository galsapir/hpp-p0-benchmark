// ABOUTME: Root application component orchestrating all sections of the benchmark showcase.
// ABOUTME: Loads deliverables data and routes between main page and compare view via hash.
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import SideBySide from './components/SideBySide'
import QuotesGallery from './components/QuotesGallery'
import MetricsDashboard from './components/MetricsDashboard'
import Advantages from './components/Advantages'
import RawDataExplorer from './components/RawDataExplorer'
import CompareTable from './components/CompareTable'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const theme = localStorage.getItem('hpp-theme') || 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}all_deliverables.json`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load data:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'var(--font-mono)', color: 'var(--hpp-green)',
        fontSize: 14, letterSpacing: 2,
      }}>
        LOADING BENCHMARK DATA...
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: 'var(--error-red)',
      }}>
        Failed to load benchmark data.
      </div>
    )
  }

  if (route === '#compare') {
    return <CompareTable data={data} />
  }

  return (
    <>
      <Navigation />
      <main style={{ paddingTop: 64 }}>
        <section id="hero">
          <Hero />
        </section>
        <section id="quotes" className="section">
          <QuotesGallery />
        </section>
        <section id="comparison" className="section">
          <SideBySide data={data} />
        </section>
        <section id="metrics" className="section">
          <MetricsDashboard />
        </section>
        <section id="advantages" className="section">
          <Advantages />
        </section>
        <section id="data" className="section">
          <RawDataExplorer data={data} />
        </section>
      </main>
    </>
  )
}

export default App
