"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

const images = [
  '/solana.png',
  '/solflare.png',
  '/helius.png',
  '/jupiter.png',
  '/compress.png',
]

export default function ImageRoller() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // Return null on server-side to avoid hydration mismatch
  }

  return (
    <div className="w-full py-4 px-4 ">
      <div className="flex animate-scroll gap-x-20"> {/* Adjust gap here */}
        {[...images, ...images].map((src, index) => (
          <div key={index} className="flex-shrink-0 w-64 h-64">
            <Image
              src={src}
              alt={`Rolling image ${index + 1}`}
              width={256}
              height={256}
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
