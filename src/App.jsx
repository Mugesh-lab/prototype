import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SpeechTool from './pages/SpeechTool'
import SignLanguageTool from './pages/SignLanguageTool'
import BrailleTool from './pages/BrailleTool'
import TranslationTool from './pages/TranslationTool'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export default function App(){
  return (
    <div className="min-h-screen flex bg-bg text-text">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/speech" element={<SpeechTool/>} />
            <Route path="/sign" element={<SignLanguageTool/>} />
            <Route path="/braille" element={<BrailleTool/>} />
            <Route path="/translate" element={<TranslationTool/>} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
