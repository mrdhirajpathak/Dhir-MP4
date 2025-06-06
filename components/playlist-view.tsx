"use client"

import { useState } from "react"
import { useMusic } from "@/contexts/music-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Play, Trash2, Music } from "lucide-react"

export function PlaylistView() {
  const { playlists, createPlaylist, deletePlaylist, removeFromPlaylist, setCurrentPlaylist, play } = useMusic()

  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setShowCreateDialog(false)
    }
  }

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId)
    if (playlist && playlist.songs.length > 0) {
      setCurrentPlaylist(playlist.songs)
      play(playlist.songs[0])
    }
  }

  const selectedPlaylistData = playlists.find((p) => p.id === selectedPlaylist)

  return (
    <div className="h-full flex">
      {/* Playlists Sidebar */}
      <div className="w-80 border-r border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Playlists</h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                  onKeyPress={(e) => e.key === "Enter" && handleCreatePlaylist()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreatePlaylist} className="bg-purple-600 hover:bg-purple-700">
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className={`p-4 bg-black/20 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
                selectedPlaylist === playlist.id ? "ring-2 ring-purple-500" : ""
              }`}
              onClick={() => setSelectedPlaylist(playlist.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {playlist.songs.length} song{playlist.songs.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayPlaylist(playlist.id)
                    }}
                    className="text-gray-400 hover:text-white w-8 h-8"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePlaylist(playlist.id)
                      if (selectedPlaylist === playlist.id) {
                        setSelectedPlaylist(null)
                      }
                    }}
                    className="text-gray-400 hover:text-red-400 w-8 h-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {playlists.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No playlists yet</p>
            <p className="text-sm">Create your first playlist</p>
          </div>
        )}
      </div>

      {/* Playlist Content */}
      <div className="flex-1 p-6">
        {selectedPlaylistData ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedPlaylistData.name}</h1>
                <p className="text-gray-400">
                  {selectedPlaylistData.songs.length} song{selectedPlaylistData.songs.length !== 1 ? "s" : ""}
                </p>
              </div>
              {selectedPlaylistData.songs.length > 0 && (
                <Button
                  onClick={() => handlePlayPlaylist(selectedPlaylistData.id)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play All
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {selectedPlaylistData.songs.map((song, index) => (
                <Card
                  key={`${song.id}-${index}`}
                  className="p-4 bg-black/20 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-colors"
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
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => play(song)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromPlaylist(selectedPlaylistData.id, song.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedPlaylistData.songs.length === 0 && (
              <div className="text-center text-gray-400 mt-12">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">This playlist is empty</p>
                <p>Add songs from your library to get started</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">Select a playlist</p>
              <p>Choose a playlist from the sidebar to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
