"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useMusic } from "@/contexts/music-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload, Search, Play, Plus } from "lucide-react"

export function LibraryView() {
  const { currentPlaylist, currentSong, play, handleFileUpload, addToPlaylist, playlists } = useMusic()
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredSongs = currentPlaylist.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Music Library</h1>

        {/* Upload and Search */}
        <div className="flex gap-4 mb-4">
          <Button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-auto">
        <div className="grid gap-2">
          {filteredSongs.map((song, index) => (
            <Card
              key={song.id}
              className={`p-4 bg-black/20 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
                currentSong?.id === song.id ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => play(song)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={song.albumArt || "/placeholder.svg?height=48&width=48"}
                    alt={song.album}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{song.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  <p className="text-gray-500 text-xs truncate">{song.album}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{formatDuration(song.duration)}</span>

                  {playlists.length > 0 && (
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add to first playlist for demo
                          if (playlists[0]) {
                            addToPlaylist(playlists[0].id, song)
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      play(song)
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl mb-2">No songs found</p>
            <p>Upload some music files to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
