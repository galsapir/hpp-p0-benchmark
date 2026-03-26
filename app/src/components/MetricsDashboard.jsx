// ABOUTME: Metrics dashboard with accuracy table and capability matrix.
// ABOUTME: Compares numerical accuracy and feature coverage across models.
import { accuracyPromptA, capabilityMatrix, models } from '../data/groundTruth'

const modelColors = {
  'HPP (P0)': '#00dfa2',
  'GPT-5.4': '#74aa9c',
  'Claude Opus': '#d4a574',
  'Gemini': '#8b9cf7',
  'Sonar Pro': '#20b2aa',
}

export default function MetricsDashboard() {
  return (
    <div className="container">
      <span className="section-label">Metrics</span>
      <h2 className="section-title">Performance Dashboard</h2>
      <p className="section-subtitle" style={{ marginBottom: 48 }}>
        Accuracy, capabilities, latency, and token usage across all models.
      </p>

      {/* Accuracy Table */}
      <div style={{ marginBottom: 64 }}>
        <SectionHeader>Numerical Accuracy — Prompt A</SectionHeader>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontSize: 14,
          }}>
            <thead>
              <tr>
                {['Model', 'Claims', 'Correct', 'Accuracy', 'Worst Error'].map(h => (
                  <th key={h} style={{
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
                    padding: '12px 16px', textAlign: 'left',
                    borderBottom: '2px solid var(--border)', background: 'var(--bg-secondary)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accuracyPromptA.map(row => {
                const isHpp = row.model === 'HPP (P0)'
                return (
                  <tr key={row.model}>
                    <td style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                      color: isHpp ? 'var(--hpp-green)' : 'var(--text-primary)',
                    }}>
                      {row.model}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {row.claims}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {row.correct}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 80, height: 6, background: 'var(--bg-secondary)',
                          borderRadius: 3, overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${row.accuracy}%`, height: '100%',
                            background: isHpp ? 'var(--hpp-green)' :
                              row.accuracy >= 80 ? '#74aa9c' :
                              row.accuracy >= 50 ? 'var(--warning-orange)' : 'var(--error-red)',
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                          color: isHpp ? 'var(--hpp-green)' :
                            row.accuracy >= 80 ? 'var(--text-primary)' :
                            row.accuracy >= 50 ? 'var(--warning-orange)' : 'var(--error-red)',
                        }}>
                          {row.accuracy}%
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      fontSize: 13, color: isHpp ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                      fontStyle: isHpp ? 'italic' : 'normal',
                    }}>
                      {row.worst}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capability Matrix */}
      <div style={{ marginBottom: 64 }}>
        <SectionHeader>Capability Matrix</SectionHeader>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Capability</th>
                {models.map(m => (
                  <th key={m.id} style={{
                    ...thStyle, textAlign: 'center',
                    color: m.isHpp ? 'var(--hpp-green)' : 'var(--text-secondary)',
                  }}>
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilityMatrix.map(row => (
                <tr key={row.capability}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{row.capability}</td>
                  {models.map(m => (
                    <td key={m.id} style={{ ...tdStyle, textAlign: 'center' }}>
                      {row[m.id] ? (
                        <span style={{ color: 'var(--hpp-green)', fontSize: 16 }}>✓</span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: 16 }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

const thStyle = {
  fontSize: 11, fontWeight: 600,
  letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
  padding: '12px 16px', textAlign: 'left',
  borderBottom: '2px solid var(--border)', background: 'var(--bg-secondary)',
}

const tdStyle = {
  padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 13,
}

function SectionHeader({ children, style }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600,
      letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
      marginBottom: 20, ...style,
    }}>
      {children}
    </div>
  )
}
