"use client";
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function ComingSoon() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tighter">
          Coming Soon
          <span className="inline-block w-12 text-left">{dots}</span>
        </h1>
        <p className="text-xl text-gray-400">
          We're working hard to bring you something amazing.
        </p>
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Clock className="w-5 h-5" />
          <span>Stay tuned for updates</span>
        </div>
        <div className="pt-8">
          <input
            type="email"
            placeholder="Enter your email for updates"
            className="px-4 py-2 w-64 bg-gray-900 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-r-md hover:bg-gray-700 transition-colors">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  )
}