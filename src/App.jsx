import React, { useState } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import Layout from './components/Layout.jsx'
import TabBar from './components/TabBar.jsx'
import LinkedInGenerator from './components/LinkedInGenerator.jsx'
import NewsletterGenerator from './components/NewsletterGenerator.jsx'
import Planning from './components/Planning.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import StreamPick from './components/StreamPick.jsx'
import { generateContent, generateVisualPrompt } from './gemini.js'

export default function App() {
  const [section, setSection] = useState(null) // null = home | 'vdt' | 'prive'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vdt_gemini_key') || '')
  const [activeTab, setActiveTab] = useState('streampick')
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

  function handleClear() {
    setOutput(null)
    setError(null)
    setVisual(null)
    setVisualError(null)
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    handleClear()
  }

  function goHome() {
    setSection(null)
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
      setVisualLoading(true)
      generateVisualPrompt(apiKey, type, formData)
        .then((v) => setVisual(v))
        .catch((err) => setVisualError(err.message))
        .finally(() => setVisualLoading(false))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Home ────────────────────────────────────────────────────────────────────
  if (!section) {
    return <HomeScreen onSelect={setSection} />
  }

  // ── Toby Privé ──────────────────────────────────────────────────────────────
  if (section === 'prive') {
    return (
      <Layout onLogout={null} onHome={goHome} sectionLabel="Toby Privé" dark>
        <StreamPick />
      </Layout>
    )
  }

  // ── VDT ─────────────────────────────────────────────────────────────────────
  if (!apiKey) {
    return (
      <Layout onLogout={null} onHome={goHome} sectionLabel="VDT">
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-6">
          <ApiKeySetup onSave={handleKeyChange} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout onLogout={handleLogout} onHome={goHome} sectionLabel="VDT">
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

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
