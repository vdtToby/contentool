import React, { useState } from 'react'
import Layout from './components/Layout.jsx'
import TabBar from './components/TabBar.jsx'
import LinkedInGenerator from './components/LinkedInGenerator.jsx'
import NewsletterGenerator from './components/NewsletterGenerator.jsx'
import OutputPanel from './components/OutputPanel.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('linkedin')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate(type, formData) {
    setLoading(true)
    setError(null)
    setOutput(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, formData }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Er ging iets mis.')
      }

      setOutput({ type, content: data.content })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setOutput(null)
    setError(null)
  }

  return (
    <Layout>
      <TabBar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); handleClear() }} />

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
          />
        </div>
      </div>
    </Layout>
  )
}
