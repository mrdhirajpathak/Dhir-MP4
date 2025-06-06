"use client"

import { useMusic } from "@/contexts/music-context"
import { Card } from "@/components/ui/card"
import { Music, Play, Pause } from "lucide-react"

export function Sidebar() {
  const { currentSong, isPlaying, togglePlayPause } = useMusic()

  return (
    <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music className="w-8 h-8 text-purple-400" />
          Dhir MP4
        </h1>
        <p className="text-gray-400 text-sm">Advanced Music Player</p>
      </div>

      {/* Mini Player */}
      {currentSong && (
        <Card className="p-4 bg-black/30 backdrop-blur-sm border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={currentSong.albumArt || "/placeholder.svg?height=48&width=48"}
                alt={currentSong.album}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm truncate">{currentSong.title}</h4>
              <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
          </div>
        </Card>
      )}

      {/* Features List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Offline Playback</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Playlist Management</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Shuffle & Repeat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Equalizer Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Sleep Timer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Lyrics Display</span>
          </div>
        </div>
      </div>
    </div>
  )
}
