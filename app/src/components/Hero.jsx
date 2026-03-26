// ABOUTME: Landing hero section with patient profile, headline, and accuracy visualization.
// ABOUTME: Shows the key metric comparison between HPP and competitor models.
import { useEffect, useRef } from 'react'
import { patient, accuracyPromptA, models } from '../data/groundTruth'

const accuracyBars = [
  { name: 'HPP (P0)', correct: 10, total: 10, accuracy: 100, color: '#00dfa2', isHpp: true },
  { name: 'GPT-5.4', correct: 4, total: 5, accuracy: 80, color: '#74aa9c' },
  { name: 'Claude Opus', correct: 3, total: 6, accuracy: 50, color: '#d4a574' },
  { name: 'Gemini', correct: 2, total: 5, accuracy: 40, color: '#8b9cf7' },
  { name: 'Sonar Pro', correct: 2, total: 4, accuracy: 50, color: '#20b2aa' },
]

export default function Hero() {
  const barsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 }
    )
    if (barsRef.current) observer.observe(barsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,223,162,0.06), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 32px' }}>
        {/* Patient badge */}
        <div className="animate-in hero-patient-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          borderRadius: 100, padding: '8px 20px', marginBottom: 32,
          fontSize: 13, color: 'var(--text-secondary)',
        }}>
          <span style={{ color: 'var(--hpp-green)', fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
            PATIENT
          </span>
          <span style={{ width: 1, height: 16, background: 'var(--border)' }} />
          <span>66yo Male</span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span>BMI {patient.bmi.split(' ')[0]}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span>HbA1c {patient.hba1c}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span>FG {patient.fastingGlucose}</span>
        </div>

        {/* Headline */}
        <h1 className="animate-in animate-delay-1" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          marginBottom: 20,
          maxWidth: 900,
        }}>
          HPP vs. 4 Frontier LLMs
          <br />
          <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Same Patient, Same Question
          </span>
        </h1>

        {/* Subheadline */}
        <p className="animate-in animate-delay-2" style={{
          fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640,
          lineHeight: 1.7, marginBottom: 48,
        }}>
          The gap isn't quality of writing — it's <span style={{ color: 'var(--hpp-green)', fontWeight: 700 }}>trustworthiness of numbers</span>.
          Every external model produced confident claims not grounded in the patient's data.
          HPP's claims all trace to validated tool outputs.
        </p>

        {/* Key metrics row */}
        <div className="animate-in animate-delay-3 hero-metrics-row" style={{
          display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 64,
        }}>
          <MetricCard label="HPP Accuracy" value="10/10" sub="10 verifiable claims, all correct" accent />
          <MetricCard label="Best Competitor" value="4/5" sub="GPT-5.4 — half the claims, still missed one" />
          <MetricCard label="Worst Competitor" value="2/5" sub="Gemini — 3 wrong out of 5" warn />
        </div>

        {/* Accuracy bars */}
        <div ref={barsRef} className="accuracy-bars animate-in animate-delay-4 hero-bars" style={{
          maxWidth: 700,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
            marginBottom: 20,
          }}>
            Verifiable Claims — Prompt A (Metabolic Scorecard)
          </div>
          {accuracyBars.map((bar, i) => {
            const maxClaims = 10
            const totalPct = (bar.total / maxClaims) * 100
            const correctPct = (bar.correct / maxClaims) * 100
            return (
              <div key={bar.name} style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12,
              }}>
                <div style={{
                  width: 110, fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: bar.isHpp ? 'var(--hpp-green)' : 'var(--text-secondary)',
                  fontWeight: bar.isHpp ? 600 : 400, textAlign: 'right', flexShrink: 0,
                }}>
                  {bar.name}
                </div>
                <div style={{
                  flex: 1, height: 32, background: 'var(--bg-secondary)',
                  borderRadius: 4, overflow: 'hidden', position: 'relative',
                }}>
                  {/* Total claims (dimmer background) */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${totalPct}%`,
                    background: bar.isHpp ? 'rgba(0,223,162,0.1)' : `${bar.color}15`,
                    borderRadius: 4,
                    transition: 'width 1s ease',
                    transitionDelay: `${i * 100}ms`,
                  }} />
                  {/* Correct claims (solid fill) */}
                  <div
                    className="bar-fill"
                    style={{
                      position: 'relative', height: '100%',
                      width: `${correctPct}%`,
                      background: bar.isHpp
                        ? 'linear-gradient(90deg, rgba(0,223,162,0.3), rgba(0,223,162,0.6))'
                        : `linear-gradient(90deg, ${bar.color}33, ${bar.color}66)`,
                      borderRadius: 4,
                      transition: 'width 1s ease',
                      transitionDelay: `${i * 100}ms`,
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      paddingRight: 12,
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                      color: bar.isHpp ? 'var(--hpp-green)' : bar.color,
                      whiteSpace: 'nowrap',
                    }}>
                      {bar.correct}/{bar.total}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Methodology */}
        <div className="animate-in animate-delay-5 hero-methodology" style={{
          marginTop: 48,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          maxWidth: 900,
        }}>
          {[
            {
              label: 'How it works',
              text: 'HPP orchestrates 20 validated analysis tools. External models received the same raw patient data — the way a patient would use them today.',
            },
            {
              label: 'Same base model',
              text: 'HPP runs on Claude Opus 4.6 — the same model that scored 50% without tools. The tools are the differentiator, not the LLM.',
            },
            {
              label: 'Scope',
              text: 'Single patient benchmark (66yo male, T2D, 13 days CGM + diet log). Architecture validation — not a statistical study.',
            },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg-secondary)',
              padding: '16px 20px',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1, textTransform: 'uppercase',
                color: 'var(--text-tertiary)', marginBottom: 6,
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: 48, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: 12,
        }}>
          <span>Scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <style>{`
        .accuracy-bars .bar-fill {
          width: 0% !important;
        }
        .accuracy-bars.visible .bar-fill {
          width: var(--target-width) !important;
        }
      `}</style>
    </div>
  )
}

function MetricCard({ label, value, sub, accent, warn }) {
  return (
    <div style={{
      background: 'var(--bg-tertiary)',
      border: `1px solid ${accent ? 'rgba(0,223,162,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '20px 28px',
      minWidth: 180,
      boxShadow: accent ? 'var(--shadow-glow)' : 'none',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: 1.5, textTransform: 'uppercase',
        color: 'var(--text-tertiary)', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700,
        color: accent ? 'var(--hpp-green)' : warn ? 'var(--error-red)' : 'var(--text-primary)',
        lineHeight: 1,
        marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 12, color: 'var(--text-secondary)',
      }}>
        {sub}
      </div>
    </div>
  )
}
