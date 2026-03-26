// ABOUTME: Core comparison view with all-models overview and HPP vs one model deep-dive.
// ABOUTME: Integrates fact-check highlights with hover tooltips on ungrounded claims.
import { useState, useCallback, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import { models, fileMap, accuracyPromptA } from '../data/groundTruth'
import { fabrications } from '../data/quotes'

const accuracyByModel = {
  hpp: { accuracy: 100, label: '100%' },
  gpt54: { accuracy: 80, label: '80%' },
  claude: { accuracy: 50, label: '50%' },
  gemini: { accuracy: 40, label: '40%' },
  perplexity: { accuracy: 50, label: '50%' },
}

export default function SideBySide({ data }) {
  const [prompt, setPrompt] = useState('promptA')
  const [view, setView] = useState('deepdive')
  const [compareModel, setCompareModel] = useState('gpt54')
  const [tooltip, setTooltip] = useState(null)

  const competitors = models.filter(m => !m.isHpp)

  const getContent = (modelId) => {
    const filename = fileMap[prompt][modelId]
    return data[filename] || ''
  }

  const handleMouseMove = useCallback((e) => {
    const el = e.target.closest('[data-fab-id]')
    if (el) {
      const fabId = el.getAttribute('data-fab-id')
      const fab = fabrications.find(f => f.id === fabId)
      if (fab) {
        const rect = el.getBoundingClientRect()
        setTooltip({
          fab,
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8,
        })
        return
      }
    }
    setTooltip(null)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="container">
      <span className="section-label">Full Responses</span>
      <h2 className="section-title">Side-by-Side Comparison</h2>
      <p className="section-subtitle" style={{ marginBottom: 32 }}>
        Explore each model's complete response. In deep-dive mode, hover highlighted text
        to see the ground truth.
      </p>

      {/* Controls */}
      <div className="comparison-controls" style={{
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        marginBottom: 32,
      }}>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${prompt === 'promptA' ? 'active' : ''}`}
            onClick={() => setPrompt('promptA')}
          >
            Prompt A — Scorecard
          </button>
          <button
            className={`toggle-btn ${prompt === 'promptB' ? 'active' : ''}`}
            onClick={() => setPrompt('promptB')}
          >
            Prompt B — Meal Analysis
          </button>
        </div>

        <div className="comparison-divider" style={{ width: 1, height: 28, background: 'var(--border)' }} />

        <div className="toggle-group">
          <button
            className={`toggle-btn ${view === 'deepdive' ? 'active' : ''}`}
            onClick={() => setView('deepdive')}
          >
            Deep Dive
          </button>
          <button
            className={`toggle-btn ${view === 'overview' ? 'active' : ''}`}
            onClick={() => setView('overview')}
          >
            All Models
          </button>
        </div>

        {view === 'deepdive' && (
          <select
            className="select-dropdown"
            value={compareModel}
            onChange={(e) => setCompareModel(e.target.value)}
          >
            {competitors.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Prompt text */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '16px 20px',
        marginBottom: 32, fontSize: 14, fontStyle: 'italic',
        color: 'var(--text-secondary)',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 600,
          letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-tertiary)',
          display: 'block', marginBottom: 8, fontStyle: 'normal',
        }}>
          {prompt === 'promptA' ? 'Prompt A' : 'Prompt B'}
        </span>
        "{data[prompt === 'promptA' ? '01_prompt_a_scorecard.md' : '02_prompt_b_meal_grounded.md']?.trim()}"
      </div>

      {view === 'overview' ? (
        <OverviewGrid models={models} getContent={getContent} />
      ) : (
        <DeepDiveView
          hppContent={getContent('hpp')}
          competitorContent={getContent(compareModel)}
          competitorId={compareModel}
          competitorName={competitors.find(m => m.id === compareModel)?.name}
        />
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="tooltip-overlay"
          style={{
            left: Math.min(tooltip.x - 190, window.innerWidth - 400),
            top: tooltip.y,
          }}
        >
          <span className="tooltip-category" style={{
            color: tooltip.fab.severity === 'red' ? 'var(--error-red)' :
                   tooltip.fab.severity === 'orange' ? 'var(--warning-orange)' : 'var(--caution-yellow)',
          }}>
            {tooltip.fab.categoryLabel}
          </span>
          <div className="tooltip-error">{tooltip.fab.error}</div>
          <div className="tooltip-truth">
            <span className="tooltip-truth-label">GROUND TRUTH</span>
            <span className="tooltip-truth-value">{tooltip.fab.groundTruth}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function OverviewGrid({ models: allModels, getContent }) {
  const [expandedModel, setExpandedModel] = useState(null)

  return (
    <div className="overview-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 16,
    }}>
      {allModels.map(model => {
        const acc = accuracyByModel[model.id]
        const isExpanded = expandedModel === model.id
        return (
          <div
            key={model.id}
            className={`card ${model.isHpp ? 'card--hpp' : ''}`}
            style={{
              maxHeight: isExpanded ? 'none' : 420,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Header with accuracy badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              paddingBottom: 12, borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: model.color,
              }} />
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: model.isHpp ? 'var(--hpp-green)' : 'var(--text-primary)',
              }}>
                {model.name}
              </span>
              <span
                className={`badge ${model.isHpp ? 'badge--green' : acc.accuracy >= 80 ? 'badge--green' : acc.accuracy >= 50 ? 'badge--orange' : 'badge--red'}`}
                style={{ marginLeft: 'auto' }}
              >
                {acc.label} accurate
              </span>
            </div>
            <MarkdownRenderer
              content={getContent(model.id)}
              modelId={model.id}
            />

            {/* Fade overlay + expand button */}
            {!isExpanded && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, var(--bg-tertiary) 70%)',
                padding: '48px 24px 16px', textAlign: 'center',
              }}>
                <button
                  onClick={() => setExpandedModel(model.id)}
                  style={{
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    padding: '6px 16px', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  Read full response
                </button>
              </div>
            )}
            {isExpanded && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  onClick={() => setExpandedModel(null)}
                  style={{
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text-secondary)', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    padding: '6px 16px', cursor: 'pointer',
                  }}
                >
                  Collapse
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DeepDiveView({ hppContent, competitorContent, competitorId, competitorName }) {
  const acc = accuracyByModel[competitorId]

  return (
    <div className="deepdive-grid" style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
    }}>
      {/* HPP Column */}
      <div className="card card--hpp" style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          paddingBottom: 12, borderBottom: '1px solid rgba(0,223,162,0.2)',
          position: 'sticky', top: 0, background: 'var(--bg-tertiary)',
          zIndex: 2, margin: '-24px -24px 16px', padding: '24px 24px 12px',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--hpp-green)',
          }} />
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: 'var(--hpp-green)',
          }}>
            HPP (P0)
          </span>
          <span className="badge badge--green" style={{ marginLeft: 'auto' }}>
            100% accurate
          </span>
        </div>
        <MarkdownRenderer content={hppContent} modelId="hpp" />
      </div>

      {/* Competitor Column */}
      <div className="card" style={{
        maxHeight: '80vh', overflow: 'auto',
        borderColor: acc.accuracy >= 80 ? 'var(--border)' : 'rgba(255, 82, 114, 0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          paddingBottom: 12, borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--bg-tertiary)',
          zIndex: 2, margin: '-24px -24px 16px', padding: '24px 24px 12px',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: models.find(m => m.id === competitorId)?.color || 'var(--text-secondary)',
          }} />
          <span style={{
            fontSize: 13, fontWeight: 600,
          }}>
            {competitorName}
          </span>
          <span
            className={`badge ${acc.accuracy >= 80 ? 'badge--orange' : 'badge--red'}`}
            style={{ marginLeft: 'auto' }}
          >
            {acc.label} accurate · hover highlights
          </span>
        </div>
        <MarkdownRenderer
          content={competitorContent}
          modelId={competitorId}
        />
      </div>
    </div>
  )
}
