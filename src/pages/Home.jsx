import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <div className="max-w-4xl mx-auto">
      <motion.section initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="p-8 rounded-md shadow-soft bg-surface">
        <h1 className="text-2xl font-bold">Accessible Communication Suite</h1>
        <p className="mt-2 text-muted">Tools for speech, sign, braille and translation — built with accessibility in mind.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-md bg-white shadow-sm">
            <h3 className="font-semibold">Speech Tools</h3>
            <p className="text-sm text-muted">Live speech-to-text, text-to-speech and export.</p>
          </div>
          <div className="p-4 rounded-md bg-white shadow-sm">
            <h3 className="font-semibold">Sign Language</h3>
            <p className="text-sm text-muted">Camera-based signer detection and conversion helpers.</p>
          </div>
          <div className="p-4 rounded-md bg-white shadow-sm">
            <h3 className="font-semibold">Braille</h3>
            <p className="text-sm text-muted">Convert text to braille and download outputs.</p>
          </div>
          <div className="p-4 rounded-md bg-white shadow-sm">
            <h3 className="font-semibold">Translation</h3>
            <p className="text-sm text-muted">Translate between languages with an accessible UI.</p>
          </div>
        </div>
        <div className="mt-6">
          <Link to="/dashboard" className="px-4 py-2 rounded-md bg-primary text-white">Get Started</Link>
        </div>
      </motion.section>
    </div>
  )
}
