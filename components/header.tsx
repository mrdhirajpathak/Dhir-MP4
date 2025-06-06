"use client"

import type React from "react"

import { useState } from "react"
import { useMusic } from "@/contexts/music-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload } from "lucide-react"

export function Header() {
  const { handleFileUpload } = useMusic()
  const [searchQuery, setSearchQuery] = useState("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>

          <input
            id="file-upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </header>
  )
}
