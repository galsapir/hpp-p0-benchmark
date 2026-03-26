// ABOUTME: Collapsible raw data explorer showing input data and model responses.
// ABOUTME: Allows viewing the patient data bundle and individual markdown files.
import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import { groundTruth } from '../data/groundTruth'

const dataFiles = [
  { key: '16_input_data_sent_to_external_models.md', label: 'Input Data Bundle', desc: 'The exact patient data sent to external models' },
  { key: '14_comparison_prompt_a_detailed.md', label: 'Detailed Comparison (Prompt A)', desc: '10-section analysis of Prompt A responses' },
  { key: '15_final_report_both_prompts.md', label: 'Full Report (Both Prompts)', desc: 'Complete benchmark report with fact-checking' },
]

export default function RawDataExplorer({ data }) {
  const [openFile, setOpenFile] = useState(null)
  const [showGroundTruth, setShowGroundTruth] = useState(false)

  return (
    <div className="container">
      <span className="section-label">Reference</span>
      <h2 className="section-title">Raw Data Explorer</h2>
      <p className="section-subtitle" style={{ marginBottom: 32 }}>
        Explore the source data — what HPP's tools computed vs. what external models received.
      </p>

      {/* Ground Truth */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="collapsible-header"
          onClick={() => setShowGroundTruth(!showGroundTruth)}
          style={{ width: '100%' }}
        >
          <div>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--hpp-green)',
            }}>
              Ground Truth Metrics
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Validated CGM values computed by iglu-python
            </div>
          </div>
          <ChevronIcon open={showGroundTruth} />
        </button>
        {showGroundTruth && (
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)',
            padding: 24, overflow: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Metric</th>
                  <th style={thStyle}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groundTruth).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{
                      ...tdStyle,
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      color: 'var(--text-secondary)',
                    }}>
                      {key}
                    </td>
                    <td style={{
                      ...tdStyle,
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                      color: 'var(--hpp-green)',
                    }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data files */}
      {dataFiles.map(file => (
        <div key={file.key} style={{ marginBottom: 12 }}>
          <button
            className="collapsible-header"
            onClick={() => setOpenFile(openFile === file.key ? null : file.key)}
            style={{ width: '100%' }}
          >
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--text-primary)',
              }}>
                {file.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                {file.desc}
              </div>
            </div>
            <ChevronIcon open={openFile === file.key} />
          </button>
          {openFile === file.key && data[file.key] && (
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              padding: 24, maxHeight: 600, overflow: 'auto',
            }}>
              <MarkdownRenderer content={data[file.key]} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const thStyle = {
  fontSize: 11, fontWeight: 600,
  letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-secondary)',
  padding: '10px 16px', textAlign: 'left',
  borderBottom: '2px solid var(--border)',
}

const tdStyle = {
  padding: '10px 16px', borderBottom: '1px solid var(--border)',
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20" fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0)',
        transition: 'transform 0.3s ease',
        color: 'var(--text-secondary)', flexShrink: 0,
      }}
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
