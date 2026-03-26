// ABOUTME: HPP differentiator feature cards showing 5 key advantages over raw LLMs.
// ABOUTME: Each card highlights a specific capability with an icon and description.

const advantages = [
  {
    icon: '👥',
    title: 'Population Context',
    subtitle: 'N=298, named cohort',
    description: 'Every percentile cites a specific cohort of 298 males aged 65–70. External models fabricate "bottom X%" with no source, no sample size, no methodology.',
    stat: '298',
    statLabel: 'peer cohort size',
  },
  {
    icon: '🔬',
    title: 'Data Grounding',
    subtitle: 'Tool-computed, not guessed',
    description: 'Every metric — mean glucose, TIR, PPGR — comes from a validated computation tool. No LLM is eyeballing a CSV and hoping the math is right.',
    stat: '100%',
    statLabel: 'numerical accuracy',
  },
  {
    icon: '📄',
    title: 'Literature Grounding',
    subtitle: 'Cited papers with effect sizes',
    description: 'Recommendations reference specific studies with DOIs, sample sizes, and effect magnitudes. External models say "per ADA guidelines" at best.',
    stat: '3',
    statLabel: 'cited papers with DOIs',
  },
  {
    icon: '📊',
    title: 'Validated Risk Scores',
    subtitle: 'SCORE2 with disclosed AUC/R²',
    description: 'Predictive models include metabolic age, dysglycemia probability, and 2-year risk — each with disclosed model accuracy (R², AUC). No other model even attempts this.',
    stat: '5',
    statLabel: 'predictive models',
  },
  {
    icon: '🛡️',
    title: 'Guardrails',
    subtitle: '"Not assessed" line',
    description: 'When data is missing (BP, lipids), HPP says "not assessed" instead of fabricating a cardiovascular risk grade. Every competitor invented a CV risk score they couldn\'t compute.',
    stat: '0',
    statLabel: 'fabricated claims',
  },
]

export default function Advantages() {
  return (
    <div className="container">
      <span className="section-label">Why HPP</span>
      <h2 className="section-title">The Trust Difference</h2>
      <p className="section-subtitle" style={{ marginBottom: 48 }}>
        Five capabilities that separate HPP from raw LLMs on clinical health analysis.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {advantages.map((adv, i) => (
          <div key={i} className="card card--hpp" style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            borderColor: 'rgba(0,223,162,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{adv.icon}</div>
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
                  marginBottom: 2,
                }}>
                  {adv.title}
                </h3>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--hpp-green)',
                  fontWeight: 600, letterSpacing: 0.5,
                }}>
                  {adv.subtitle}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                  color: 'var(--hpp-green)', lineHeight: 1,
                }}>
                  {adv.stat}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)',
                  letterSpacing: 0.5, marginTop: 4,
                }}>
                  {adv.statLabel}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>
              {adv.description}
            </p>
          </div>
        ))}
      </div>

      {/* Summary callout */}
      <div style={{
        marginTop: 48, background: 'var(--bg-secondary)',
        border: '1px solid rgba(0,223,162,0.2)',
        borderRadius: 'var(--radius-md)', padding: '32px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)',
          marginBottom: 12,
        }}>
          HPP's advantage is <span style={{ color: 'var(--hpp-green)', fontStyle: 'italic' }}>trust</span>
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          Every number is tool-computed, every percentile has an N, every prediction has a disclosed accuracy metric,
          and when data is missing, HPP says so instead of guessing.
        </p>
      </div>
    </div>
  )
}
