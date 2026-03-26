// ABOUTME: Scrollable gallery of fabricated quotes from competitor models with ground truth.
// ABOUTME: Each card shows the verbatim quote, error type badge, and the correct value.
import { fabrications, hppQuotes, severityColors, categoryColors } from '../data/quotes'

export default function QuotesGallery() {
  return (
    <div className="container">
      <span className="section-label">Fact Check</span>
      <h2 className="section-title">What They Said vs. What's True</h2>
      <p className="section-subtitle" style={{ marginBottom: 48 }}>
        Every quote is verbatim from the model's output. Ground truth is from validated CGM tools.
      </p>

      {/* Fabrication quotes */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: 20, marginBottom: 64,
      }}>
        {fabrications.map(fab => (
          <FabricationCard key={fab.id} fab={fab} />
        ))}
      </div>

      {/* HPP correct quotes */}
      <div style={{ marginTop: 64 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', color: 'var(--hpp-green)',
          marginBottom: 24,
        }}>
          What HPP Said Instead
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: 20,
        }}>
          {hppQuotes.map(q => (
            <div key={q.id} className="card card--hpp" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 16, right: 16,
              }}>
                <span className="badge badge--green">GROUNDED</span>
              </div>
              <blockquote style={{
                fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
                color: 'var(--text-primary)', borderLeft: '3px solid var(--hpp-green)',
                paddingLeft: 16, margin: '0 0 16px', fontStyle: 'italic',
                paddingRight: 80,
              }}>
                "{q.quote}"
              </blockquote>
              <div style={{
                fontSize: 13, color: 'var(--hpp-green)',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>✓</span>
                <span>{q.why}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FabricationCard({ fab }) {
  const colors = severityColors[fab.severity]
  const badgeClass = fab.severity === 'red' ? 'badge--red' :
                     fab.severity === 'orange' ? 'badge--orange' : 'badge--yellow'

  return (
    <div className="card" style={{
      borderColor: `${colors.border}30`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
          color: colors.text,
        }}>
          {fab.modelName}
        </span>
        <span className={`badge ${badgeClass}`}>
          {fab.category}
        </span>
      </div>

      {/* Quote */}
      <blockquote style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
        color: 'var(--text-primary)', borderLeft: `3px solid ${colors.border}`,
        paddingLeft: 16, margin: '0 0 16px', fontStyle: 'italic',
        flex: 1,
      }}>
        "{fab.quote}"
      </blockquote>

      {/* Ground truth */}
      <div style={{
        background: 'rgba(0,223,162,0.06)',
        border: '1px solid rgba(0,223,162,0.15)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          color: 'var(--hpp-green)', letterSpacing: 1, whiteSpace: 'nowrap',
          marginTop: 2,
        }}>
          TRUTH
        </span>
        <span style={{
          fontSize: 13, color: 'var(--hpp-green)', fontWeight: 500,
          lineHeight: 1.5,
        }}>
          {fab.groundTruth}
        </span>
      </div>

      {/* Error explanation */}
      <div style={{
        marginTop: 12, fontSize: 12, color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        {fab.error}
      </div>
    </div>
  )
}
