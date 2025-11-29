import React, { useEffect, useRef, useState } from 'react'

const speakText = (text) => {
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
  
  throw new Error(`File type not supported: ${fileType}`)
}

export default function SignLanguageTool({compact}){
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const start = async ()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setRunning(true)
    }catch(err){
      console.error(err)
      alert('Camera access is required for the Sign Language tool.')
    }
  }

  const stop = ()=>{
    if (streamRef.current){
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setRunning(false)
  }

  useEffect(()=>()=>{ if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()) }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await extractTextFromFile(file)
      setOutput(text)
      setError('')
    } catch (err) {
      setError(`File upload failed: ${err.message}`)
    }
  }

  return (
    <section aria-labelledby="sign-heading">
      <h3 id="sign-heading" className="font-semibold">Sign Language Interface</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black rounded overflow-hidden" style={{minHeight:200}}>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" aria-label="Camera preview" />
        </div>
        <div>
          <div className="p-3 bg-surface rounded mb-2">
            <textarea 
              value={output} 
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Type text or upload file..."
              className="w-full p-2 rounded border text-sm"
              rows={4}
            />
          </div>
          <div className="p-3 bg-surface rounded">{output ? 'Output: ' + output.substring(0, 50) + '...' : 'Output panel (text/speech) will appear here.'}</div>
          <div className="mt-3 flex gap-3 flex-wrap">
            <button onClick={start} disabled={running} className="px-3 py-2 rounded bg-primary text-white">Start</button>
            <button onClick={stop} disabled={!running} className="px-3 py-2 rounded bg-surface">Stop</button>
            <button onClick={()=>speakText(output)} disabled={!output} className="px-3 py-2 rounded bg-blue-500 text-white text-sm" aria-label="Speak output">🔊 Speak</button>
            <label className="px-3 py-2 rounded bg-blue-100 text-blue-700 cursor-pointer text-sm font-medium">
              📁 Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".txt,.pdf" />
            </label>
          </div>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          <div className="mt-3 text-sm text-muted">Helpful instructions: Position yourself in frame, ensure good lighting.</div>
        </div>
      </div>
    </section>
  )
}
