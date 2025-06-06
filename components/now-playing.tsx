"use client"

import { useState } from "react"
import { useMusic } from "@/contexts/music-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Settings,
  Timer,
  Music,
} from "lucide-react"
import { EqualizerDialog } from "./equalizer-dialog"
import { SleepTimerDialog } from "./sleep-timer-dialog"

export function NowPlaying() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = useMusic()

  const [showEqualizer, setShowEqualizer] = useState(false)
  const [showSleepTimer, setShowSleepTimer] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (value: number[]) => {
    seekTo(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const getRepeatIcon = () => {
    switch (repeat) {
      case "one":
        return <Repeat1 className="w-5 h-5" />
      case "all":
        return <Repeat className="w-5 h-5" />
      default:
        return <Repeat className="w-5 h-5 opacity-50" />
    }
  }

  if (!currentSong) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white/70">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl mb-2">No song selected</p>
          <p>Choose a song from your library to start playing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-white">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-sm border-white/10 p-8">
        {/* Album Art */}
        <div className="relative mb-8">
          <div className="w-80 h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={currentSong.albumArt || "/placeholder.svg?height=320&width=320"}
              alt={currentSong.album}
              className="w-full h-full object-cover"
            />
          </div>
          {isPlaying && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-500/20 to-transparent animate-pulse" />
          )}
        </div>

        {/* Song Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 truncate">{currentSong.title}</h1>
          <p className="text-lg text-gray-300 mb-1 truncate">{currentSong.artist}</p>
          <p className="text-gray-400 truncate">{currentSong.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            className={`text-white hover:bg-white/10 ${shuffle ? "text-purple-400" : "text-gray-400"}`}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={previousSong} className="text-white hover:bg-white/10">
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={nextSong} className="text-white hover:bg-white/10">
            <SkipForward className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRepeat}
            className={`text-white hover:bg-white/10 ${repeat !== "off" ? "text-purple-400" : "text-gray-400"}`}
          >
            {getRepeatIcon()}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 mb-6">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <Slider value={[volume * 100]} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
        </div>

        {/* Additional Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEqualizer(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSleepTimer(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Timer className="w-5 h-5" />
          </Button>

          {currentSong.lyrics && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLyrics(!showLyrics)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Lyrics
            </Button>
          )}
        </div>

        {/* Lyrics */}
        {showLyrics && currentSong.lyrics && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <h3 className="font-semibold mb-2">Lyrics</h3>
            <p className="text-sm text-gray-300 whitespace-pre-line">{currentSong.lyrics}</p>
          </div>
        )}
      </Card>

      {/* Dialogs */}
      <EqualizerDialog open={showEqualizer} onOpenChange={setShowEqualizer} />
      <SleepTimerDialog open={showSleepTimer} onOpenChange={setShowSleepTimer} />
    </div>
  )
}
