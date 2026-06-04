import React, { useState, useRef } from 'react'
import Spinner from './Spinner.jsx'

function parseNewsletter(content) {
  // Extract subject, preheader, and HTML body from the structured response
  const subjectMatch = content.match(/ONDERWERPREGEL:\s*(.+)/i)
  const preheaderMatch = content.match(/PREHEADER:\s*(.+)/i)
  const htmlMatch = content.match(/HTML:\s*([\s\S]+)/i)

  return {
    subject: subjectMatch ? subjectMatch[1].trim() : null,
    preheader: preheaderMatch ? preheaderMatch[1].trim() : null,
    html: htmlMatch ? htmlMatch[1].trim() : null,
  }
}

export default function OutputPanel({ output, loading, error, onClear }) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('preview') // 'preview' | 'source'
  const textareaRef = useRef(null)

  const isNewsletter = output?.type === 'newsletter'
  const parsed = isNewsletter && output?.content ? parseNewsletter(output.content) : null

  async function handleCopy() {
    const text = isNewsletter
      ? (viewMode === 'source' && parsed?.html ? parsed.html : output?.content)
      : output?.content

    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      if (textareaRef.current) {
        textareaRef.current.select()
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-gray-300" />
          <h2 className="text-base font-semibold text-gray-900">Gegenereerde content</h2>
        </div>

        <div className="flex items-center gap-2">
          {isNewsletter && output?.content && (
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-[#2FA766] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Voorbeeld
              </button>
              <button
                onClick={() => setViewMode('source')}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === 'source'
                    ? 'bg-[#2FA766] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                HTML
              </button>
            </div>
          )}

          {output?.content && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-[#2FA766]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Gekopieerd!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Kopieer
                  </>
                )}
              </button>

              <button
                onClick={onClear}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Wissen
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
            <Spinner size="lg" />
            <p className="text-sm">Content wordt gegenereerd…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-700">Er ging iets mis</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !output && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Vul het formulier in en klik op genereren</p>
          </div>
        )}

        {!loading && !error && output?.content && (
          <>
            {/* Newsletter: subject + preheader info */}
            {isNewsletter && parsed && (
              <div className="mb-4 space-y-2">
                {parsed.subject && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Onderwerpregel</p>
                    <p className="text-sm font-medium text-gray-800">{parsed.subject}</p>
                  </div>
                )}
                {parsed.preheader && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Preheader</p>
                    <p className="text-sm text-gray-700">{parsed.preheader}</p>
                  </div>
                )}
              </div>
            )}

            {/* Newsletter HTML preview / source */}
            {isNewsletter && parsed?.html ? (
              viewMode === 'preview' ? (
                <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ height: '500px' }}>
                  <iframe
                    srcDoc={parsed.html}
                    title="E-mail voorbeeld"
                    className="w-full h-full"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  readOnly
                  value={parsed.html}
                  className="w-full h-96 rounded-lg border border-gray-200 px-3 py-3 text-xs font-mono text-gray-700 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-[#2FA766]"
                />
              )
            ) : (
              /* LinkedIn plain text or fallback */
              <textarea
                ref={textareaRef}
                readOnly
                value={output.content}
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-800 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-[#2FA766]"
                style={{ minHeight: '320px' }}
              />
            )}

            {/* Character count for LinkedIn */}
            {!isNewsletter && (
              <p className="text-xs text-gray-400 mt-1.5 text-right">
                {output.content.length} tekens
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
