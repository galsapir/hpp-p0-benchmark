// ABOUTME: Renders markdown content as HTML with GFM table support and optional fact-check highlights.
// ABOUTME: Uses react-markdown with remark-gfm and applies text highlighting for fabrication detection.
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fabrications } from '../data/quotes'

function highlightText(text, modelId, onHighlightHover) {
  if (!modelId || modelId === 'hpp') return text

  const modelFabs = fabrications.filter(f => f.model === modelId)
  if (modelFabs.length === 0) return text

  let result = text
  const replacements = []

  for (const fab of modelFabs) {
    for (const searchStr of fab.searchText) {
      const idx = result.indexOf(searchStr)
      if (idx !== -1) {
        replacements.push({
          start: idx,
          end: idx + searchStr.length,
          fab,
          text: searchStr,
        })
        break
      }
    }
  }

  if (replacements.length === 0) return text

  replacements.sort((a, b) => a.start - b.start)

  const parts = []
  let lastEnd = 0

  for (const r of replacements) {
    if (r.start < lastEnd) continue
    if (r.start > lastEnd) {
      parts.push(result.slice(lastEnd, r.start))
    }
    parts.push(
      `<span class="highlight-${r.fab.severity}" data-fab-id="${r.fab.id}">${r.text}</span>`
    )
    lastEnd = r.end
  }

  if (lastEnd < result.length) {
    parts.push(result.slice(lastEnd))
  }

  return parts.join('')
}

function processChildren(children, modelId, onHighlightHover) {
  if (!children) return children
  if (typeof children === 'string') {
    const highlighted = highlightText(children, modelId, onHighlightHover)
    if (highlighted !== children) {
      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    }
    return children
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === 'string') {
        const highlighted = highlightText(child, modelId, onHighlightHover)
        if (highlighted !== child) {
          return <span key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
        }
        return child
      }
      return child
    })
  }
  return children
}

export default function MarkdownRenderer({ content, modelId, onHighlightHover }) {
  const components = modelId && modelId !== 'hpp' ? {
    p: ({ children, ...props }) => (
      <p {...props}>{processChildren(children, modelId, onHighlightHover)}</p>
    ),
    li: ({ children, ...props }) => (
      <li {...props}>{processChildren(children, modelId, onHighlightHover)}</li>
    ),
    td: ({ children, ...props }) => (
      <td {...props}>{processChildren(children, modelId, onHighlightHover)}</td>
    ),
    strong: ({ children, ...props }) => (
      <strong {...props}>{processChildren(children, modelId, onHighlightHover)}</strong>
    ),
  } : {}

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
