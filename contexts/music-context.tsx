"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"

export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  src: string
  albumArt?: string
  lyrics?: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
}

interface MusicContextType {
  // Current playback state
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number

  // Playlist state
  currentPlaylist: Song[]
  currentIndex: number
  shuffle: boolean
  repeat: "off" | "one" | "all"

  // Playlists
  playlists: Playlist[]

  // Controls
  play: (song?: Song) => void
  pause: () => void
  togglePlayPause: () => void
  nextSong: () => void
  previousSong: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void

  // Playlist management
  setCurrentPlaylist: (songs: Song[], index?: number) => void
  createPlaylist: (name: string) => void
  addToPlaylist: (playlistId: string, song: Song) => void
  removeFromPlaylist: (playlistId: string, songId: string) => void
  deletePlaylist: (playlistId: string) => void

  // File handling
  handleFileUpload: (files: FileList) => void

  // Equalizer
  equalizerSettings: number[]
  setEqualizerSettings: (settings: number[]) => void

  // Sleep timer
  sleepTimer: number | null
  setSleepTimer: (minutes: number | null) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<"off" | "one" | "all">("off")
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [equalizerSettings, setEqualizerSettings] = useState<number[]>(new Array(10).fill(0))
  const [sleepTimer, setSleepTimerState] = useState<number | null>(null)

  // Sample songs for demo
  const sampleSongs: Song[] = [
    {
      id: "1",
      title: "Chill Vibes",
      artist: "Demo Artist",
      album: "Sample Album",
      duration: 180,
      src: "/placeholder-audio.mp3",
      albumArt: "/placeholder.svg?height=300&width=300",
      lyrics: "Sample lyrics for demonstration...",
    },
    {
      id: "2",
      title: "Electronic Dreams",
      artist: "Synth Master",
      album: "Digital Waves",
      duration: 240,
      src: "/placeholder-audio.mp3",
      albumArt: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "3",
      title: "Acoustic Journey",
      artist: "Folk Singer",
      album: "Unplugged Sessions",
      duration: 200,
      src: "/placeholder-audio.mp3",
      albumArt: "/placeholder.svg?height=300&width=300",
    },
  ]

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (repeat === "one") {
        audio.currentTime = 0
        audio.play()
      } else {
        nextSong()
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)

    // Initialize with sample songs
    if (currentPlaylist.length === 0) {
      setCurrentPlaylist(sampleSongs)
      setCurrentSong(sampleSongs[0])
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [repeat])

  // Sleep timer effect
  useEffect(() => {
    if (sleepTimer && sleepTimer > 0) {
      const timer = setTimeout(
        () => {
          pause()
          setSleepTimerState(null)
        },
        sleepTimer * 60 * 1000,
      )

      return () => clearTimeout(timer)
    }
  }, [sleepTimer])

  const play = (song?: Song) => {
    if (!audioRef.current) return

    if (song && song !== currentSong) {
      setCurrentSong(song)
      audioRef.current.src = song.src
      const index = currentPlaylist.findIndex((s) => s.id === song.id)
      if (index !== -1) setCurrentIndex(index)
    }

    audioRef.current.volume = volume
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(console.error)
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      if (currentSong) {
        play(currentSong)
      } else if (currentPlaylist.length > 0) {
        play(currentPlaylist[0])
      }
    }
  }

  const nextSong = () => {
    if (currentPlaylist.length === 0) return

    let nextIndex
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length)
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.length
      if (nextIndex === 0 && repeat === "off") return
    }

    setCurrentIndex(nextIndex)
    play(currentPlaylist[nextIndex])
  }

  const previousSong = () => {
    if (currentPlaylist.length === 0) return

    let prevIndex
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * currentPlaylist.length)
    } else {
      prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1
    }

    setCurrentIndex(prevIndex)
    play(currentPlaylist[prevIndex])
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleShuffle = () => setShuffle(!shuffle)

  const toggleRepeat = () => {
    const modes: ("off" | "one" | "all")[] = ["off", "all", "one"]
    const currentIndex = modes.indexOf(repeat)
    setRepeat(modes[(currentIndex + 1) % modes.length])
  }

  const setCurrentPlaylistFunc = (songs: Song[], index = 0) => {
    setCurrentPlaylist(songs)
    setCurrentIndex(index)
    if (songs.length > 0) {
      setCurrentSong(songs[index])
    }
  }

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: new Date(),
    }
    setPlaylists([...playlists, newPlaylist])
  }

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, song] } : playlist,
      ),
    )
  }

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
          : playlist,
      ),
    )
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId))
  }

  const handleFileUpload = (files: FileList) => {
    const newSongs: Song[] = []

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("audio/")) {
        const url = URL.createObjectURL(file)
        const song: Song = {
          id: `uploaded-${Date.now()}-${index}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          album: "Uploaded Music",
          duration: 0,
          src: url,
        }
        newSongs.push(song)
      }
    })

    if (newSongs.length > 0) {
      const updatedPlaylist = [...currentPlaylist, ...newSongs]
      setCurrentPlaylist(updatedPlaylist)
    }
  }

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerState(minutes)
  }

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        currentPlaylist,
        currentIndex,
        shuffle,
        repeat,
        playlists,
        play,
        pause,
        togglePlayPause,
        nextSong,
        previousSong,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        setCurrentPlaylist: setCurrentPlaylistFunc,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        handleFileUpload,
        equalizerSettings,
        setEqualizerSettings,
        sleepTimer,
        setSleepTimer,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
