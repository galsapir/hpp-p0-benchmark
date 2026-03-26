// ABOUTME: Metrics dashboard with accuracy table, capability matrix, latency, and token charts.
// ABOUTME: Uses Recharts for bar chart visualizations of model performance data.
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { accuracyPromptA, latencyData, tokenData, capabilityMatrix, models } from '../data/groundTruth'

const modelColors = {
  'HPP (P0)': '#00dfa2',
  'GPT-5.4': '#74aa9c',
  'Claude Opus': '#d4a574',
  'Gemini': '#8b9cf7',
  'Sonar Pro': '#20b2aa',
}

export default function MetricsDashboard() {
  const [latencyPrompt, setLatencyPrompt] = useState('promptA')

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
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
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

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Latency */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 0 }}>Latency</SectionHeader>
            <div className="toggle-group" style={{ marginLeft: 'auto' }}>
              <button
                className={`toggle-btn ${latencyPrompt === 'promptA' ? 'active' : ''}`}
                onClick={() => setLatencyPrompt('promptA')}
                style={{ fontSize: 11, padding: '4px 12px' }}
              >
                A
              </button>
              <button
                className={`toggle-btn ${latencyPrompt === 'promptB' ? 'active' : ''}`}
                onClick={() => setLatencyPrompt('promptB')}
                style={{ fontSize: 11, padding: '4px 12px' }}
              >
                B
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={latencyData[latencyPrompt]} layout="vertical" margin={{ left: 80, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                tickFormatter={v => `${v}s`} />
              <YAxis type="category" dataKey="model" tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'var(--font-mono)' }} width={80} />
              <Tooltip
                contentStyle={{ background: '#1a2740', border: '1px solid #2d3f55', borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`${v}s`, 'Latency']}
              />
              <Bar dataKey="seconds" radius={[0, 4, 4, 0]}>
                {latencyData[latencyPrompt].map((entry) => (
                  <Cell key={entry.model} fill={modelColors[entry.model] || '#8b949e'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{
            fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8,
            fontStyle: 'italic',
          }}>
            HPP uses 12 sequential tool calls — higher latency for grounded results.
          </div>
        </div>

        {/* Token Usage */}
        <div>
          <SectionHeader>Token Usage (Prompt B)</SectionHeader>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tokenData} layout="vertical" margin={{ left: 80, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="model" tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'var(--font-mono)' }} width={80} />
              <Tooltip
                contentStyle={{ background: '#1a2740', border: '1px solid #2d3f55', borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`${v.toLocaleString()} tokens`]}
              />
              <Bar dataKey="prompt" stackId="a" fill="#8b9cf744" radius={[0, 0, 0, 0]} name="Prompt" />
              <Bar dataKey="completion" stackId="a" fill="#8b9cf7" radius={[0, 4, 4, 0]} name="Completion" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{
            fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8,
            fontStyle: 'italic',
          }}>
            HPP token data N/A — uses tool-based pipeline, not single-prompt inference.
          </div>
        </div>
      </div>
    </div>
  )
}

const thStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
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
      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
      letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
      marginBottom: 20, ...style,
    }}>
      {children}
    </div>
  )
}
