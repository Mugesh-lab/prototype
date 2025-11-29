import React, { useEffect, useState } from 'react'

const speakText = (text, language = 'en-US') => {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'en-US'  // Force Google US English
  utt.rate = 0.85
  utt.pitch = 1.0
  utt.volume = 1.0
  
  // Try to select Google US English voice
  const voices = window.speechSynthesis.getVoices()
  const googleVoice = voices.find(v => 
    v.name.includes('Google US English') || 
    (v.name.includes('Google') && v.lang === 'en-US')
  )
  if (googleVoice) utt.voice = googleVoice
  
  window.speechSynthesis.speak(utt)
}

const extractTextFromFile = async (file) => {
  const fileType = file.type || file.name.split('.').pop().toLowerCase()
  
  // Handle text files
  if (fileType.includes('text') || fileType === 'txt' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }
  
  // Handle PDF files
  if (fileType.includes('pdf') || file.name.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      // For PDF parsing, we'll use a simple approach: show file received message
      // In production, you'd use pdfjs-dist library
      return `[PDF File: ${file.name} - Text extraction requires PDF.js library. Please use .txt format for best results]`
    } catch (e) {
      return `[PDF File: ${file.name} received but requires PDF.js library]`
    }
  }
  
  // Handle other document types by attempting text extraction
  if (fileType.includes('word') || fileType.includes('document') || 
      file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
    return `[Document File: ${file.name} - For best results, export as .txt or .pdf]`
  }
  
  // CSV and other text-based formats
  if (fileType.includes('sheet') || fileType.includes('csv') || 
      file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
  
  throw new Error(`File type not supported: ${fileType}`)
}

export default function TranslationTool({compact}){
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('es')
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    const loadLanguages = async ()=>{
      try{
        const res = await fetch('/api/languages')
        const json = await res.json()
        if (!mounted) return
        setLanguages(json.languages || [])
        if (json.languages && json.languages.length){
          setFrom(json.languages[0].code)
          setTo(json.languages[1]?.code || json.languages[0].code)
        }
      }catch(e){
        try{
          const res2 = await fetch('http://localhost:4000/api/languages')
          const json2 = await res2.json()
          if (!mounted) return
          setLanguages(json2.languages || [])
          if (json2.languages && json2.languages.length){
            setFrom(json2.languages[0].code)
            setTo(json2.languages[1]?.code || json2.languages[0].code)
          }
        }catch(e2){
          if (mounted) setLanguages([{code:'en', name:'English'},{code:'es', name:'Español'},{code:'fr', name:'Français'}])
        }
      }
    }
    loadLanguages()
    return ()=>{ mounted = false }
  }, [])

  const swap = ()=>{ setFrom(to); setTo(from); setOutput('') }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await extractTextFromFile(file)
      setInput(text)
      setError(null)
    } catch (err) {
      setError(`File upload failed: ${err.message}`)
    }
  }

  const translate = async ()=>{
    setError(null)
    setLoading(true)
    const payload = { text: input, from, to }
    try{
      const res = await fetch('/api/translate', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
      const json = await res.json()
      
      if (!res.ok){
        setError(json.error || 'Translation failed')
        setOutput('')
        setLoading(false)
        return
      }
      
      setOutput(json.translated || '')
      setError(null)
      setLoading(false)
      return
    }catch(e){
      try{
        const res2 = await fetch('http://localhost:4000/api/translate', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
        const json2 = await res2.json()
        
        if (!res2.ok){
          setError(json2.error || 'Translation failed')
          setOutput('')
          setLoading(false)
          return
        }
        
        setOutput(json2.translated || '')
        setError(null)
        setLoading(false)
        return
      }catch(e2){
        setError('Translation service unavailable. Check your internet connection.')
        setOutput('')
        setLoading(false)
      }
    }
  }

  const copyOutput = async ()=>{ if (!output) return; await navigator.clipboard.writeText(output) }

  const exportOutput = ()=>{
    const blob = new Blob([output || ''],{type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'translation.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="translate-heading">
      <h3 id="translate-heading" className="font-semibold">Translation</h3>
      <p className="text-sm text-muted">Translate text between languages</p>
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <label className="sr-only" htmlFor="translate-input">Input text</label>
          <textarea id="translate-input" className="w-full p-3 rounded border" rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Type text to translate" />

          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <select value={from} onChange={e=>setFrom(e.target.value)} className="p-2 rounded border">
              {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <button onClick={swap} className="p-2 rounded bg-surface">⇄</button>
            <select value={to} onChange={e=>setTo(e.target.value)} className="p-2 rounded border">
              {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <button onClick={translate} disabled={!input || loading} className="ml-2 px-4 py-2 rounded bg-primary text-white">{loading ? 'Translating…' : 'Translate'}</button>
            <label className="px-3 py-2 rounded bg-blue-100 text-blue-700 cursor-pointer text-sm font-medium">
              📁 Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.pdf,.doc,.docx,.csv,.xlsx" />
            </label>
          </div>
        </div>

        <div className="p-3 bg-white rounded border">
          <div className="min-h-[120px]">{output || <span className="text-muted">Output here</span>}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={()=>speakText(output, to)} disabled={!output} className="px-3 py-2 rounded bg-blue-500 text-white text-sm" aria-label="Speak translation">🔊 Speak</button>
            <button onClick={copyOutput} disabled={!output} className="px-3 py-2 rounded bg-surface text-sm">Copy</button>
            <button onClick={()=>{ setInput(''); setOutput('') }} className="px-3 py-2 rounded bg-surface text-sm">Clear</button>
            <button onClick={exportOutput} disabled={!output} className="px-3 py-2 rounded bg-surface text-sm">Export</button>
          </div>
          {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
        </div>
      </div>
    </section>
  )
}
