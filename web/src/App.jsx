import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)
  const [agent, setAgent] = useState('groq')
  const [keysStatus, setKeysStatus] = useState({})

  // Settings Inputs
  const [krakenKey, setKrakenKey] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [geminiKey, setGeminiKey] = useState('')

  useEffect(() => {
    fetchKeysStatus()
  }, [])

  const fetchKeysStatus = async () => {
    try {
      const res = await fetch('/api/keys/status')
      if (res.ok) {
        setKeysStatus(await res.json())
      }
    } catch (e) {
      console.error("Failed to fetch key status", e)
    }
  }

  const runAnalysis = async () => {
    setLoading(true)
    setError(null)
    setAnalysisData(null)
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ia_agent: agent, show_smart_summary: true })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Analysis failed')
      }
      const data = await res.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveKey = async (name, content) => {
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: name, content })
      })
      if (res.ok) {
        alert(`${name} Key saved!`)
        fetchKeysStatus()
        // clear input
        if (name === 'kraken') setKrakenKey('')
        if (name === 'groq') setGroqKey('')
        if (name === 'gemini') setGeminiKey('')
      } else {
        alert('Failed to save key')
      }
    } catch (e) {
      alert('Error saving key')
    }
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Trading AI Control</h1>
        <div className="status-indicators">
          <span className={`badge ${keysStatus.kraken ? 'success' : 'danger'}`}>Kraken</span>
          <span className={`badge ${keysStatus.groq ? 'success' : 'warning'}`}>Groq</span>
        </div>
      </header>

      <div className="tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="content">
          <div className="card controls">
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label>AI Agent</label>
              <select value={agent} onChange={e => setAgent(e.target.value)}>
                <option value="groq">Groq</option>
                <option value="gemini">Gemini</option>
                <option value="openai">OpenAI</option>
              </select>
            </div>
            <button onClick={runAnalysis} disabled={loading}>
              {loading ? <div className="spinner small"></div> : 'Run Analysis'}
            </button>
            {error && <div className="error-msg">{error}</div>}
          </div>

          {analysisData && (
            <>
              <div className="summary-cards">
                <div className="card metric">
                  <h3>Total Value</h3>
                  <p>{analysisData.total_value ? `€${analysisData.total_value.toFixed(2)}` : '-'}</p>
                </div>
                <div className="card metric">
                  <h3>Cash</h3>
                  <p>€{analysisData.cash_eur?.toFixed(2)}</p>
                </div>
                <div className="card metric">
                  <h3>Live Assets</h3>
                  <p>{analysisData.live_assets?.length}</p>
                </div>
              </div>

              {analysisData.smart_summary && (
                <div className="card">
                  <h2>AI Smart Summary</h2>
                  <pre className="summary-text">{analysisData.smart_summary}</pre>
                </div>
              )}

              <div className="card">
                <h2>Ranking</h2>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Rank</th>
                        <th>Price</th>
                        <th>Trend</th>
                        <th>Rec. Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.ranking?.map((row, i) => (
                        <tr key={i}>
                          <td>{row.NAME}</td>
                          <td>{row.RANKING?.toFixed(1)}</td>
                          <td>€{row.CURR_PRICE}</td>
                          <td>{row.TREND?.toFixed(2)}</td>
                          <td>{row.IBS ? <span className="tag buy">BUY SET</span> : <span className="tag sell">SELL</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="content">
          <div className="card">
            <h2>API Configuration</h2>
            <p>Enter your API keys below. They are saved locally on your server.</p>

            <div className="setting-row">
              <label>Kraken API Key File Content</label>
              <textarea
                placeholder="Paste contents of kraken.key"
                value={krakenKey}
                onChange={e => setKrakenKey(e.target.value)}
              />
              <button onClick={() => saveKey('kraken', krakenKey)}>Save Kraken</button>
            </div>

            <div className="setting-row">
              <label>Groq API Key</label>
              <input
                type="password"
                placeholder="gsk_..."
                value={groqKey}
                onChange={e => setGroqKey(e.target.value)}
              />
              <button onClick={() => saveKey('groq', groqKey)}>Save Groq</button>
            </div>

            <div className="setting-row">
              <label>Gemini API Key</label>
              <input
                type="password"
                placeholder="AI..."
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
              />
              <button onClick={() => saveKey('gemini', geminiKey)}>Save Gemini</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
