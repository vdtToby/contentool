import React, { useState, useEffect } from 'react'
import Layout from './components/Layout.jsx'
import TabBar from './components/TabBar.jsx'
import LinkedInGenerator from './components/LinkedInGenerator.jsx'
import NewsletterGenerator from './components/NewsletterGenerator.jsx'
import Planning from './components/Planning.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import { generateContent, generateVisualPrompt } from './gemini.js'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vdt_gemini_key') || '')
  const [activeTab, setActiveTab] = useState('linkedin')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visual, setVisual] = useState(null)
  const [visualLoading, setVisualLoading] = useState(false)
  const [visualError, setVisualError] = useState(null)

  function handleKeyChange(newKey) {
    setApiKey(newKey)
  }

  function handleLogout() {
    localStorage.removeItem('vdt_gemini_key')
    setApiKey('')
    setOutput(null)
    setError(null)
  }

  async function handleGenerate(type, formData) {
    setLoading(true)
    setError(null)
    setOutput(null)
    setVisual(null)
    setVisualError(null)

    try {
      const content = await generateContent(apiKey, type, formData)
      setOutput({ type, content })
      // Generate image prompt in parallel (non-blocking)
      setVisualLoading(true)
      generateVisualPrompt(apiKey, type, formData)
        .then(v => setVisual(v))
        .catch(err => setVisualError(err.message))
        .finally(() => setVisualLoading(false))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setOutput(null)
    setError(null)
    setVisual(null)
    setVisualError(null)
  }

  if (!apiKey) {
    return <ApiKeySetup onSave={handleKeyChange} />
  }

  return (
    <Layout onLogout={handleLogout}>
      <TabBar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); handleClear() }} />

      {activeTab === 'planning' ? (
        <div className="mt-6">
          <Planning apiKey={apiKey} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {activeTab === 'linkedin' && (
              <LinkedInGenerator onGenerate={handleGenerate} loading={loading} />
            )}
            {activeTab === 'newsletter' && (
              <NewsletterGenerator onGenerate={handleGenerate} loading={loading} />
            )}
          </div>
          <div>
            <OutputPanel
              output={output}
              loading={loading}
              error={error}
              onClear={handleClear}
              visual={visual}
              visualLoading={visualLoading}
              visualError={visualError}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}
