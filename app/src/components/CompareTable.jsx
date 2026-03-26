// ABOUTME: Standalone comparison page for marketing — clean scoring table across all models.
// ABOUTME: Accessible via #compare hash route, designed to be shared as a direct link.
import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import { models, fileMap, capabilityMatrix } from '../data/groundTruth'

const modelScores = [
  {
    id: 'hpp', name: 'HPP (P0)', color: '#00dfa2', isHpp: true,
    accuracy: '10/10', accuracyPct: 100,
    verdict: 'Every numerical claim verified against tool outputs. Zero errors.',
    highlights: [
      'Population percentiles with N=298 cohort',
      'Meal-level PPGR computation',
      'Disclosed confidence per domain (R², AUC)',
      'Refused CV risk without BP data',
    ],
    errors: [],
  },
  {
    id: 'gpt54', name: 'GPT-5.4', color: '#74aa9c',
    accuracy: '4/5', accuracyPct: 80,
    verdict: 'Decent accuracy but fewer verifiable claims. One significant numerical error.',
    highlights: [
      'Best diet pattern recognition among competitors',
      'Actionable meal-specific suggestions',
    ],
    errors: [
      'TAR >140: claimed ~50%, actual 67.4% (off by 17 pts)',
      'Claimed "lows/near-lows" — zero time below 70 mg/dL',
    ],
  },
  {
    id: 'claude', name: 'Claude Opus 4.6', color: '#d4a574',
    accuracy: '3/6', accuracyPct: 50,
    verdict: 'Clinically dangerous fabrications including a false hypoglycemia diagnosis.',
    highlights: [
      'Detected dawn phenomenon pattern',
      'Detailed dietary analysis',
    ],
    errors: [
      'TIR: claimed ~68%, actual 75.8% (flips ADA target status)',
      'Invented "reactive hypoglycemia" — zero hypo episodes',
      'Fabricated ASCVD >15-20% without BP or lipid data',
    ],
  },
  {
    id: 'gemini', name: 'Gemini 3.1 Pro', color: '#8b9cf7',
    accuracy: '2/5', accuracyPct: 40,
    verdict: 'Severe alarmist tone. Graded near-target patient as "F (Critical)."',
    highlights: [
      'None unique — all useful content was also wrong or alarmist',
    ],
    errors: [
      'Graded "F (Critical)" for TIR 75.8% (near ADA target)',
      '"Sandpaper on blood vessels" — TAR >250 only 0.8%',
      'CV Risk "D (High)" without BP/lipid data',
      'Unsourced "bottom 25%" percentile claim',
    ],
  },
  {
    id: 'perplexity', name: 'Sonar Pro', color: '#20b2aa',
    accuracy: '2/4', accuracyPct: 50,
    verdict: 'Largest single numerical error across all models. Multiple unsourced percentiles.',
    highlights: [
      'Attempted structured metric summary',
    ],
    errors: [
      'TIR: claimed ~45-55%, actual 75.8% (off by 20-30 pts)',
      'TAR >180: claimed ~35%, actual 24.2% (off by 11 pts)',
      'Four unsourced population percentiles (Bottom 30/40/35/25%)',
    ],
  },
]

const scoringDimensions = [
  { key: 'numerical', label: 'Numerical Accuracy', description: 'Are the specific numbers correct?' },
  { key: 'grounding', label: 'Data Grounding', description: 'Are claims backed by computed values?' },
  { key: 'population', label: 'Population Context', description: 'Cited cohort with N, age/sex group?' },
  { key: 'literature', label: 'Literature Citations', description: 'Named studies with DOIs, effect sizes?' },
  { key: 'risk', label: 'Risk Modeling', description: 'Validated predictive models with disclosed accuracy?' },
  { key: 'guardrails', label: 'Guardrails', description: 'Discloses limitations and missing data?' },
  { key: 'tone', label: 'Clinical Tone', description: 'Appropriate severity, not alarmist?' },
]

const dimensionScores = {
  hpp:        { numerical: 3, grounding: 3, population: 3, literature: 3, risk: 3, guardrails: 3, tone: 3 },
  gpt54:      { numerical: 2, grounding: 1, population: 0, literature: 0, risk: 0, guardrails: 0, tone: 2 },
  claude:     { numerical: 1, grounding: 1, population: 0, literature: 0, risk: 0, guardrails: 0, tone: 1 },
  gemini:     { numerical: 0, grounding: 0, population: 0, literature: 0, risk: 0, guardrails: 0, tone: 0 },
  perplexity: { numerical: 0, grounding: 1, population: 0, literature: 0, risk: 0, guardrails: 0, tone: 2 },
}

const scoreLabels = { 0: '✗', 1: '~', 2: '○', 3: '●' }
const scoreColors = { 0: 'var(--error-red)', 1: 'var(--warning-orange)', 2: 'var(--text-secondary)', 3: 'var(--hpp-green)' }

export default function CompareTable({ data }) {
  const [selectedPrompt, setSelectedPrompt] = useState('promptA')
  const [selectedModel, setSelectedModel] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <a href="#" style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)',
            textDecoration: 'none', display: 'block', marginBottom: 4,
          }}>
            ← Back to full benchmark
          </a>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)',
          }}>
            HPP vs. Frontier LLMs — Side-by-Side Scoring
          </h1>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)',
          textAlign: 'right', lineHeight: 1.6,
        }}>
          Patient: 66yo M, T2D, 13-day CGM<br />
          Models tested: base versions (not health-specific variants)
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>

        {/* Scoring Matrix */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase', color: 'var(--hpp-green)',
            marginBottom: 20,
          }}>
            Scoring Matrix
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Dimension</th>
                  {modelScores.map(m => (
                    <th key={m.id} style={{
                      ...thStyle, textAlign: 'center', minWidth: 120,
                      color: m.isHpp ? 'var(--hpp-green)' : 'var(--text-secondary)',
                    }}>
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoringDimensions.map(dim => (
                  <tr key={dim.key}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      <div>{dim.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>
                        {dim.description}
                      </div>
                    </td>
                    {modelScores.map(m => {
                      const score = dimensionScores[m.id][dim.key]
                      return (
                        <td key={m.id} style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{
                            fontSize: 18, color: scoreColors[score],
                          }}>
                            {scoreLabels[score]}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {/* Total row */}
                <tr>
                  <td style={{
                    ...tdStyle, fontWeight: 700, borderTop: '2px solid var(--border)',
                  }}>
                    Total
                  </td>
                  {modelScores.map(m => {
                    const scores = dimensionScores[m.id]
                    const total = Object.values(scores).reduce((a, b) => a + b, 0)
                    const max = scoringDimensions.length * 3
                    return (
                      <td key={m.id} style={{
                        ...tdStyle, textAlign: 'center', fontWeight: 700,
                        borderTop: '2px solid var(--border)',
                        fontFamily: 'var(--font-mono)', fontSize: 15,
                        color: m.isHpp ? 'var(--hpp-green)' : total > 10 ? 'var(--text-primary)' : total > 5 ? 'var(--warning-orange)' : 'var(--error-red)',
                      }}>
                        {total}/{max}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{
            marginTop: 12, display: 'flex', gap: 20, fontSize: 12,
            color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
          }}>
            <span><span style={{ color: 'var(--hpp-green)' }}>●</span> Full</span>
            <span><span style={{ color: 'var(--text-secondary)' }}>○</span> Partial</span>
            <span><span style={{ color: 'var(--warning-orange)' }}>~</span> Attempted, significant errors</span>
            <span><span style={{ color: 'var(--error-red)' }}>✗</span> Not present or wrong</span>
          </div>
        </div>

        {/* Model Cards with verdict + errors */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase', color: 'var(--hpp-green)',
          marginBottom: 20,
        }}>
          Per-Model Summary
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
          gap: 16, marginBottom: 64,
        }}>
          {modelScores.map(m => (
            <div key={m.id} className={`card ${m.isHpp ? 'card--hpp' : ''}`}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                  color: m.isHpp ? 'var(--hpp-green)' : 'var(--text-primary)',
                }}>
                  {m.name}
                </span>
                <span className={`badge ${m.isHpp ? 'badge--green' : m.accuracyPct >= 80 ? 'badge--green' : m.accuracyPct >= 50 ? 'badge--orange' : 'badge--red'}`}
                  style={{ marginLeft: 'auto' }}>
                  {m.accuracy}
                </span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                {m.verdict}
              </p>

              {m.highlights.length > 0 && (
                <div style={{ marginBottom: m.errors.length ? 12 : 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                    letterSpacing: 1, color: m.isHpp ? 'var(--hpp-green)' : 'var(--text-tertiary)',
                    marginBottom: 6,
                  }}>
                    {m.isHpp ? 'KEY STRENGTHS' : 'WHAT IT DID WELL'}
                  </div>
                  {m.highlights.map((h, i) => (
                    <div key={i} style={{
                      fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
                      paddingLeft: 12, position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0,
                        color: m.isHpp ? 'var(--hpp-green)' : 'var(--text-tertiary)',
                      }}>·</span>
                      {h}
                    </div>
                  ))}
                </div>
              )}

              {m.errors.length > 0 && (
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                    letterSpacing: 1, color: 'var(--error-red)',
                    marginBottom: 6,
                  }}>
                    ERRORS FOUND
                  </div>
                  {m.errors.map((e, i) => (
                    <div key={i} style={{
                      fontSize: 12, color: 'var(--error-red)', lineHeight: 1.6,
                      paddingLeft: 12, position: 'relative', opacity: 0.8,
                    }}>
                      <span style={{ position: 'absolute', left: 0 }}>·</span>
                      {e}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side-by-side full responses */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase', color: 'var(--hpp-green)',
          marginBottom: 20,
        }}>
          Full Response Comparison
        </div>

        <div style={{
          display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${selectedPrompt === 'promptA' ? 'active' : ''}`}
              onClick={() => setSelectedPrompt('promptA')}
            >
              Prompt A — Scorecard
            </button>
            <button
              className={`toggle-btn ${selectedPrompt === 'promptB' ? 'active' : ''}`}
              onClick={() => setSelectedPrompt('promptB')}
            >
              Prompt B — Meal Analysis
            </button>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            Click a model to expand its full response:
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(selectedModel === m.id ? null : m.id)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                background: selectedModel === m.id ? `${m.color}20` : 'var(--bg-secondary)',
                border: `1px solid ${selectedModel === m.id ? m.color : 'var(--border)'}`,
                color: selectedModel === m.id ? m.color : 'var(--text-secondary)',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {selectedModel && (
          <div className="card" style={{
            maxHeight: '70vh', overflow: 'auto',
            borderColor: models.find(m => m.id === selectedModel)?.isHpp
              ? 'rgba(0,223,162,0.3)' : 'var(--border)',
          }}>
            <MarkdownRenderer
              content={data[fileMap[selectedPrompt][selectedModel]] || ''}
              modelId={selectedModel}
            />
          </div>
        )}

        {/* Methodology note */}
        <div style={{
          marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)',
          fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7,
          maxWidth: 700,
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Methodology:</strong>{' '}
          HPP orchestrated 20 validated analysis tools on Bedrock Claude Opus 4.6.
          External models (base versions, not health-specific variants) received the same raw patient data via OpenRouter API.
          Single patient benchmark — architecture validation, not a statistical study.{' '}
          <a href="#" style={{ color: 'var(--hpp-green)' }}>View full benchmark →</a>
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
