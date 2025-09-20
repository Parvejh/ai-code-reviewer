import { useState, useEffect } from 'react'
import React from 'react'
import "./App.css"
import "prismjs/themes/prism-tomorrow.css"
import prism from 'prismjs'
import Editor from "react-simple-code-editor"
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css"

const CodeBlock = ({inline, className, children}) => {
  const [copied, setCopied] = useState(false)
  const codeText = String(children).replace(/\n$/, "")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(()=>setCopied(false), 1500)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  if (inline) {
    return <code className={className}>{children}</code>
  }

  return (
    <div className="code-block">
      <button
        className={"copy-btn"}
        onClick={handleCopy}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  )
}

const App = () => {
  const [code, setCode] = useState(``)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [mobileView, setMobileView] = useState('both')
  const BACKEND_ORIGIN = import.meta.BACKEND_ORIGIN || "http://localhost:3000";


  useEffect(()=>{
    prism.highlightAll()
  }, [code, review])

  async function reviewCode(){
    setLoading(true)
    try{
      const response = await axios.post(`${BACKEND_ORIGIN}/ai/get-review`,{code})
      setReview(response.data)
    }catch(e){
      console.log("Error in fetching response from API : ", e)
    }finally{
      setLoading(false)
    }
  }

  function downloadReview(){
    const blob = new Blob([review || ''], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code-review.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app-root">
      <header className="app-header">
        <div className="brand">
          <h1>AI Code Reviewer</h1>
          <p className="tag">Instant, focused reviews — clarity, security & style suggestions</p>
        </div>

        <div className="controls">
          <div className="view-toggle" role="tablist" aria-label="View toggle">
            <button className={mobileView==='both'?'tab active':'tab'} onClick={()=>setMobileView('both')}>Both</button>
            <button className={mobileView==='editor'?'tab active':'tab'} onClick={()=>setMobileView('editor')}>Editor</button>
            <button className={mobileView==='review'?'tab active':'tab'} onClick={()=>setMobileView('review')}>Review</button>
          </div>

          <button className="btn ghost" onClick={()=>{
            setCode(`// Paste your JavaScript here
function hello(){
  console.log('Hello world')
}`)
          }}>
            Load sample
          </button>

          <button
            className={loading ? "btn primary loading" : "btn primary"}
            onClick={reviewCode}
            aria-live="polite"
          >
            {/* keep width stable by using CSS min-width instead of changing text */}
            {loading ? 'Reviewing...' : 'Request Review'}
          </button>
        </div>
      </header>

      <section className={`editor-area ${mobileView === 'editor' ? 'show-editor' : ''} ${mobileView === 'review' ? 'show-review' : ''}`}>
        <div className="panel left">
          <div className="panel-header">
            <div>
              <strong>Editor</strong>
              <div className="muted">Write or paste code (JS)</div>
            </div>
            <div className="status" aria-live="polite">{code.length ? `${code.length} chars` : 'Empty'}</div>
          </div>

          <div className="editor-wrapper" role="region" aria-label="Code editor">
            <div className="code-surface">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
                padding={12}
                style={{
                  fontFamily:`"Fira Code","Fira Mono","monospace"`,
                  fontSize:"0.95rem",
                  minHeight: '220px',
                  whiteSpace: 'pre'
                }}
              />
            </div>
          </div>

          <div className="panel-footer">
            <div className="hint">Tip: small focused snippets get better reviews — try 30–200 lines</div>
            <div className="actions">
              <button className="btn link" onClick={()=>{ setCode('') }}>Clear</button>
              <button className="btn" onClick={reviewCode}>{loading? 'Reviewing...' : 'Review'}</button>
            </div>
          </div>
        </div>

        <div className="panel right" aria-live="polite">
          <div className="panel-header">
            <div>
              <strong>Review</strong>
              <div className="muted">AI analysis (Markdown)</div>
            </div>
            <div className="status">{ review ? 'Ready' : '—' }</div>
          </div>

          <div className="review-toolbar">
            <div className="left">
              <span className="badge">{ review ? `${Math.max(1, review.split('\n').length)} lines` : 'No result' }</span>
              <span className="badge muted">Score: { review ? '—' : '—' }</span>
            </div>
            <div className="right">
              <button className="icon-btn" title="Copy review" onClick={()=>{ navigator.clipboard?.writeText(review) }}>
                Copy
              </button>
              <button className="icon-btn" title="Download" onClick={downloadReview} disabled={!review}>
                Download
              </button>
            </div>
          </div>

          <div className="review-content enhanced" role="region" aria-label="AI review">
            { review ? (
              <div className="review-inner">
                <div className="review-summary">
                  <div className="summary-left">
                    <h3>Quick Summary</h3>
                    <p className="muted small">High-level suggestions and priorities from the model</p>
                  </div>
                  <div className="summary-right">
                    <div className="pill">Security</div>
                    <div className="pill">Performance</div>
                    <div className="pill">Style</div>
                  </div>
                </div>

                <div className="review-body">
                  <Markdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: CodeBlock
                    }}
                  >
                    {review}
                  </Markdown>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7v10a2 2 0 0 0 2 2h5M21 7v10a2 2 0 0 1-2 2h-5M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p>No review yet — paste code and press <strong>Request Review</strong>.</p>
              </div>
            )}
          </div>

          <div className="panel-footer small">
            <div className="muted">You can copy or download the review. Keep sensitive data out of the editor.</div>
          </div>
        </div>
      </section>

      <footer className="app-footer">
        <div>Responsive & mobile-friendly</div>
        <div className="muted">Endpoint: <code>POST http://localhost:3000/ai/get-review</code></div>
      </footer>
    </main>
  )
}

export default App
