"use client"

import { useState } from "react"
import { NowPlaying } from "./now-playing"
import { PlaylistView } from "./playlist-view"
import { LibraryView } from "./library-view"

export function MusicPlayer() {
  const [activeView, setActiveView] = useState<"now-playing" | "playlist" | "library">("now-playing")

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {activeView === "now-playing" && <NowPlaying />}
        {activeView === "playlist" && <PlaylistView />}
        {activeView === "library" && <LibraryView />}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveView("now-playing")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === "now-playing" ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Now Playing
          </button>
          <button
            onClick={() => setActiveView("library")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === "library" ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveView("playlist")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === "playlist" ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Playlists
          </button>
        </div>
      </div>
    </div>
  )
}
