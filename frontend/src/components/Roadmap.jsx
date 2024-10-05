"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

const milestones = [
  {
    year: 2025,
    quarter: "Q1",
    title: "Bridging & Compression",
    description: "Implement cross-chain limit orders and develop transaction compression mechanisms.",
    icon: "🌉"
  },
  {
    year: 2025,
    quarter: "Q2",
    title: "Team Expansion",
    description: "Recruit top talent and establish proprietary liquidity pools.",
    icon: "👥"
  },
  {
    year: 2025,
    quarter: "Q3",
    title: "Community Growth",
    description: "Launch referral program and introduce new incentive structures.",
    icon: "🚀"
  },
  {
    year: 2025,
    quarter: "Q4",
    title: "Marketing & TGE",
    description: "Execute peer marketing initiatives and conduct Token Generation Event.",
    icon: "💎"
  }
]

const MovingVerticalLine = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      ref={ref}
      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 origin-top"
      style={{ scaleY }}
    />
  )
}

const Milestone = ({ milestone, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex items-start mb-16"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          {milestone.quarter}
        </div>
        {/* Changed <div> to span for inline block context */}
        <span className="absolute left-8 top-16 bottom-0 w-1 bg-purple-300" />
      </div>
      <div className="ml-8 pt-2">
        <h3 className="text-2xl font-bold mb-2">{milestone.title}</h3>
        <p className="text-gray-300 mb-2">{milestone.description}</p>
        <div className="text-4xl">{milestone.icon}</div>
      </div>
    </motion.div>
  )
}

const RollingNumber = ({ number, isChanging }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, isChanging ? -number * 20 - 20 : -number * 20, -number * 20]
  )
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className="h-20 overflow-hidden">
      <motion.div style={{ y: smoothY }}>
        {[...Array(number + 2)].map((_, i) => (
          <div key={i} className="h-20 flex items-center justify-center text-6xl font-bold">
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Roadmap() {
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(prev => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-black text-white p-8">
      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Roadmap: A Journey Through Time
        </h1>
        <MovingVerticalLine />
        <div className="pl-16">
          <div className="flex items-center mb-16">
            <RollingNumber number={8} isChanging={false} />
            <RollingNumber number={0} isChanging={false} />
            <RollingNumber number={8} isChanging={false} />
            <RollingNumber number={20} isChanging={false} />
          </div>
          {milestones.map((milestone, index) => (
            <Milestone key={index} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
