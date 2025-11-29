const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const WebSocket = require('ws')

const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '5mb'}))

// Simple in-memory profile store (for demo)
let userProfile = {
  name: 'Demo User',
  preferences: {
    theme: 'auto',
    largeText: false,
    highContrast: false,
    dyslexia: false,
    reduceMotion: false
  }
}

// Mock translation endpoint
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'ta', name: 'தமிழ்' }
]

app.get('/api/languages', (req, res) => {
  res.json({ languages: SUPPORTED_LANGUAGES })
})

app.post('/api/translate', async (req, res) => {
  const { text, from, to } = req.body || {}
  if (!text) return res.status(400).json({ error: 'text required' })
  
  try{
    // Use free MyMemory translation API (no key required, respects rate limits)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from || 'en'}|${to || 'es'}`
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText){
      const translated = data.responseData.translatedText
      return res.json({ from: from || 'en', to: to || 'es', translated })
    }else{
      // Fallback if quota exceeded or error
      return res.status(503).json({ error: 'Translation service temporary limit. Try again.' })
    }
  }catch(err){
    console.error('Translation error:', err)
    res.status(500).json({ error: 'Translation service unavailable' })
  }
})

// Braille conversion endpoint
const BRAILLE_MAP = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵', ' ': ' '
}
function toBraille(text){
  return text.toLowerCase().split('').map(c => BRAILLE_MAP[c] || '?').join('')
}

app.post('/api/braille', (req, res) => {
  const { text } = req.body || {}
  if (!text) return res.status(400).json({ error: 'text required' })
  const braille = toBraille(text)
  res.json({ braille })
})

// Profile endpoints
app.get('/api/profile', (req, res) => {
  res.json(userProfile)
})

app.post('/api/profile', (req, res) => {
  const { name, preferences } = req.body || {}
  if (name) userProfile.name = name
  if (preferences) userProfile.preferences = { ...userProfile.preferences, ...preferences }
  res.json(userProfile)
})

// Placeholder for sign recognition - demo
app.post('/api/sign/recognize', (req, res) => {
  // Accepts image/frame data, returns placeholder
  res.json({ text: 'recognized sign (demo)', confidence: 0.6 })
})

// Create HTTP server and WebSocket server for live events
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'welcome', message: 'connected to live backend' }))
  ws.on('message', (msg) => {
    // echo messages for demo — in production, forward to processing pipeline
    try{
      const data = JSON.parse(msg)
      if (data.type === 'transcript'){
        // broadcast to all clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: 'transcript', text: data.text }))
        })
      }
    }catch(e){ }
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Accessibility backend running on http://localhost:${PORT}`)
})

// If a frontend build exists, serve it as static from the repo root `dist/` folder.
// This allows deploying a single container that serves both frontend and backend.
const fs = require('fs')
const path = require('path')
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
  console.log('Serving frontend from', distPath)
}
