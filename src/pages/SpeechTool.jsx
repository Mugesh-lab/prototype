import React, { useEffect, useRef, useState } from 'react'
import MicrophoneButton from '../components/UIControls/MicrophoneButton'

const extractTextFromFile = async (file) => {
  const fileType = file.type || file.name.split('.').pop().toLowerCase()
  
  if (fileType.includes('text') || fileType === 'txt' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }
  
  if (fileType.includes('pdf') || file.name.endsWith('.pdf')) {
    return `PDF File: ${file.name} - Text extraction requires PDF.js library. Please use .txt format.`
  }
  
  if (fileType.includes('csv') || file.name.endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }
  
  throw new Error(`File type not supported: ${fileType}`)
}

export default function SpeechTool({compact}){
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [ttsRate, setTtsRate] = useState(0.85)
  const [ttsPitch, setTtsPitch] = useState(1.0)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.interimResults = true
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
    }
    rec.onerror = (e) => {
      console.error('Speech recognition error:', e.error)
    }
    recognitionRef.current = rec
  }, [])

  // Load voices when they become available
  useEffect(()=>{
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        // Priority: Google US English → en-US voices → any English voice
        let googleUSVoice = availableVoices.find(v => 
          v.name.includes('Google US English') || 
          (v.name.includes('Google') && v.lang === 'en-US')
        )
        
        if (!googleUSVoice) {
          googleUSVoice = availableVoices.find(v => v.lang === 'en-US')
        }
        
        if (!googleUSVoice) {
          googleUSVoice = availableVoices.find(v => v.lang.includes('en'))
        }
        
        // Set voice list to all English voices for dropdown
        const englishVoices = availableVoices.filter(v => v.lang.includes('en'))
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices)
        
        // Set default to Google US English if found
        if (googleUSVoice) {
          setSelectedVoice(googleUSVoice)
        } else if (englishVoices.length > 0) {
          setSelectedVoice(englishVoices[0])
        }
      }
    }
    
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await extractTextFromFile(file)
      setTranscript(text)
      setError('')
    } catch (err) {
      setError(`File upload failed: ${err.message}`)
    }
  }

  const toggle = ()=>{
    if (!recognitionRef.current) return
    if (!listening){
      recognitionRef.current.start()
      setListening(true)
    } else {
      recognitionRef.current.stop()
      setListening(false)
    }
  }

  const speak = (text, rate = ttsRate, pitch = ttsPitch) => {
    if (!window.speechSynthesis || !text) return
    
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    
    utt.rate = rate
    utt.pitch = pitch
    utt.volume = 1.0
    utt.lang = 'en-US'  // Force US English
    
    if (selectedVoice) {
      utt.voice = selectedVoice
    }
    
    utt.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
    }
    
    utt.onend = () => {
      console.log('Speech synthesis complete')
    }
    
    console.log('Speaking with voice:', utt.voice?.name)
    window.speechSynthesis.speak(utt)
  }

  const exportText = () => {
    const blob = new Blob([transcript || ''], {type: 'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Optionally send transcript to backend (demo)
  const sendToServer = async (text)=>{
    try{ await fetch('/api/transcript', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text})}) }catch(e){}
  }

  return (
    <section aria-labelledby="speech-heading">
      <h3 id="speech-heading" className="font-semibold">Speech Interface</h3>
      <div className="mt-3 flex flex-col gap-4">
        
        {/* Microphone Controls */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Speech Recognition</h4>
          <div className="flex items-center gap-3 flex-wrap">
            <MicrophoneButton onToggle={toggle} active={listening} />
            <span className="text-sm text-muted">{listening ? 'Listening...' : 'Ready'}</span>
            <label className="px-3 py-2 rounded bg-blue-100 text-blue-700 cursor-pointer text-sm font-medium">
              📁 Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.pdf,.csv" />
            </label>
          </div>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        {/* Transcript Display */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Transcript</h4>
          <div className="p-3 bg-white rounded h-32 overflow-auto border" role="region" aria-live="polite">
            {transcript || <span className="text-muted">No transcript yet — Click Start to begin</span>}
          </div>
        </div>

        {/* Text-to-Speech Controls */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Text-to-Speech</h4>
          <div className="space-y-2">
            {/* Rate Control */}
            <div className="flex items-center gap-3">
              <label className="text-sm w-24">Speed:</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={ttsRate} 
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="flex-1"
                aria-label="Speech rate"
              />
              <span className="text-xs text-muted w-12">{ttsRate.toFixed(1)}x</span>
            </div>
            
            {/* Pitch Control */}
            <div className="flex items-center gap-3">
              <label className="text-sm w-24">Pitch:</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={ttsPitch} 
                onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                className="flex-1"
                aria-label="Speech pitch"
              />
              <span className="text-xs text-muted w-12">{ttsPitch.toFixed(1)}x</span>
            </div>

            {/* Voice Selection */}
            {voices.length > 0 && (
              <div className="flex items-center gap-3">
                <label htmlFor="voice-select" className="text-sm w-24">Voice:</label>
                <select 
                  id="voice-select"
                  value={selectedVoice?.name || ''} 
                  onChange={(e) => {
                    const selected = voices.find(v => v.name === e.target.value)
                    setSelectedVoice(selected)
                  }}
                  className="flex-1 px-2 py-1 rounded border text-sm"
                  aria-label="Voice selection"
                >
                  {voices.map((voice, idx) => (
                    <option key={idx} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Play Button */}
            <button 
              onClick={()=>speak(transcript, ttsRate, ttsPitch)} 
              disabled={!transcript}
              className="w-full px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
              aria-label="Play text-to-speech"
            >
              🔊 Speak Text
            </button>
          </div>
        </div>

        {/* Export & Send */}
        <div className="flex gap-2">
          <button onClick={exportText} disabled={!transcript} className="px-3 py-2 rounded bg-surface disabled:opacity-50">Export</button>
          <button onClick={()=>sendToServer(transcript)} disabled={!transcript} className="px-3 py-2 rounded bg-surface disabled:opacity-50">Send to Server</button>
          <button onClick={()=>setTranscript('')} disabled={!transcript} className="px-3 py-2 rounded bg-surface disabled:opacity-50">Clear</button>
        </div>
      </div>
    </section>
  )
}
