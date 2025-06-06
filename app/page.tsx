"use client"

import { useState, useEffect } from "react"
import { MusicPlayer } from "@/components/music-player"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MusicProvider } from "@/contexts/music-context"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading Dhir MP4...</div>
      </div>
    )
  }

  return (
    <MusicProvider>
      <div className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">
            <MusicPlayer />
          </main>
        </div>
      </div>
    </MusicProvider>
  )
}
