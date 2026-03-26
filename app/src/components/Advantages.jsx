// ABOUTME: HPP differentiator feature cards showing 5 key advantages over raw LLMs.
// ABOUTME: Each card includes a verbatim HPP quote as evidence and a competitor contrast.

const advantages = [
  {
    icon: '👥',
    title: 'Population Context',
    pitch: 'Not just the individual',
    subtitle: 'N=298, named cohort',
    description: 'HPP places every patient in context — not just "your glucose is high" but exactly where you stand relative to peers. External models fabricate vague rankings with no source.',
    hppQuote: '"100th percentile mean glucose, 0th percentile TIR; N=298 males 65–70"',
    competitorQuote: '"Bottom 25% of your age demographic" — Gemini (no source, no N, no methodology)',
    stat: '298',
    statLabel: 'peer cohort size',
  },
  {
    icon: '🔬',
    title: 'Grounding in Your Data',
    pitch: 'What are YOUR values, and what do they mean?',
    subtitle: 'Tool-computed, not guessed',
    description: 'Every metric — mean glucose, TIR, PPGR, variability — is computed by a validated tool from the patient\'s own CGM and diet data. No LLM eyeballing a CSV.',
    hppQuote: '"Rice + Schnitzel + Vegetable pie + Salad — PPGR 161.1 (mg/dL)·h, 104 g carbs, peak 254 mg/dL"',
    competitorQuote: '"~45-55% Time in Range" — Sonar Pro (actual: 75.8% — a 20-30 point error)',
    stat: '100%',
    statLabel: 'numerical accuracy',
  },
  {
    icon: '📚',
    title: 'Grounding in Science',
    pitch: 'Grounded in the world, not just the model',
    subtitle: 'Cited papers with DOIs & effect sizes',
    description: 'Recommendations link to specific studies with DOIs, sample sizes, and measured effect magnitudes — so clinicians can verify and patients can understand the evidence.',
    hppQuote: '"Substituting fiber-fortified rice lowered 2-h iAUC from 160 to 114 mmol/L·min (−29%, p=0.046; Yusri et al. 2025)"',
    competitorQuote: 'Best competitor reference: "per ADA guidelines" — no DOI, no effect size, no N',
    stat: '3',
    statLabel: 'cited papers with DOIs',
  },
  {
    icon: '📊',
    title: 'Validated Risk Scores',
    pitch: 'Actual tools doctors use',
    subtitle: 'Disclosed R², AUC per model',
    description: 'HPP runs 5 predictive models — metabolic age, dysglycemia probability, visceral fat, future trajectory — each with disclosed accuracy metrics so you know how much to trust each score.',
    hppQuote: '"Dysglycemia current MEDIUM (AUC=0.67) | Future trajectory MEDIUM-HIGH (AUC=0.71) | Metabolic age LOW (R²=0.09)"',
    competitorQuote: 'No competitor attempted predictive modeling. Zero disclosed accuracy metrics across all 4 models.',
    stat: '5',
    statLabel: 'predictive models with disclosed accuracy',
  },
  {
    icon: '🛡️',
    title: 'Guardrails & Limitations',
    pitch: '"We know what we don\'t know"',
    subtitle: 'Explicit about boundaries',
    description: 'When data is missing, HPP says so. When confidence is low, HPP flags it. Every competitor fabricated a cardiovascular risk grade they had no data to compute.',
    hppQuote: '"Not assessed: ApoB, Lp(a), blood pressure, lipid panel. SCORE2 could not be computed without BP."',
    competitorQuote: '"Cardiovascular Risk: D (High)" — Gemini (no BP, no lipids, no valid risk calculation)',
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
        Five capabilities that separate HPP from raw LLMs on clinical health analysis —
        each backed by evidence from this benchmark.
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {advantages.map((adv, i) => (
          <div key={i} className="card card--hpp advantage-card" style={{
            borderColor: 'rgba(0,223,162,0.15)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
          }}>
            {/* Left: description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{adv.icon}</div>
                  <h3 style={{
                    fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
                    marginBottom: 2,
                  }}>
                    {adv.title}
                  </h3>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)',
                    fontStyle: 'italic', marginBottom: 4,
                  }}>
                    {adv.pitch}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--hpp-green)',
                    fontWeight: 600, letterSpacing: 0.5,
                  }}>
                    {adv.subtitle}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                    color: 'var(--hpp-green)', lineHeight: 1,
                  }}>
                    {adv.stat}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)',
                    letterSpacing: 0.5, marginTop: 4, maxWidth: 100,
                  }}>
                    {adv.statLabel}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>
                {adv.description}
              </p>
            </div>

            {/* Right: evidence quotes */}
            <div className="advantage-evidence" style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              borderLeft: '1px solid var(--border)', paddingLeft: 24,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                  color: 'var(--hpp-green)', marginBottom: 8,
                }}>
                  HPP said
                </div>
                <blockquote style={{
                  fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7,
                  borderLeft: '3px solid var(--hpp-green)', paddingLeft: 12,
                  margin: 0, fontStyle: 'italic',
                }}>
                  {adv.hppQuote}
                </blockquote>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                  color: 'var(--error-red)', marginBottom: 8,
                }}>
                  Competitors said
                </div>
                <blockquote style={{
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
                  borderLeft: '3px solid var(--error-red)', paddingLeft: 12,
                  margin: 0, fontStyle: 'italic',
                }}>
                  {adv.competitorQuote}
                </blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary callout */}
      <div style={{
        marginTop: 48, background: 'var(--bg-secondary)',
        border: '1px solid rgba(0,223,162,0.2)',
        borderRadius: 'var(--radius-md)', padding: '40px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)',
          marginBottom: 28, textAlign: 'center',
        }}>
          Five things frontier LLMs <span style={{ color: 'var(--error-red)', fontStyle: 'italic' }}>can't</span> do
        </div>
        <div className="advantages-summary-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20,
          textAlign: 'center',
        }}>
          {advantages.map((adv, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{adv.icon}</div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
                marginBottom: 4, lineHeight: 1.3,
              }}>
                {adv.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-secondary)',
                fontStyle: 'italic', lineHeight: 1.4,
              }}>
                {adv.pitch}
              </div>
            </div>
          ))}
        </div>
        <p style={{
          fontSize: 15, color: 'var(--text-secondary)', maxWidth: 700,
          margin: '24px auto 0', lineHeight: 1.7, textAlign: 'center',
        }}>
          Population context with a real cohort. Your data computed, not guessed. Recommendations grounded in published science.
          Risk scores from validated clinical models. And when data is missing — HPP says so instead of fabricating an answer.
        </p>
      </div>
    </div>
  )
}
