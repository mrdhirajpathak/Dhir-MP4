"use client"

import { useState } from "react"
import { useMusic } from "@/contexts/music-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SleepTimerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SleepTimerDialog({ open, onOpenChange }: SleepTimerDialogProps) {
  const { sleepTimer, setSleepTimer } = useMusic()
  const [customMinutes, setCustomMinutes] = useState("")

  const presetTimes = [15, 30, 45, 60, 90, 120]

  const handleSetTimer = (minutes: number) => {
    setSleepTimer(minutes)
    onOpenChange(false)
  }

  const handleCustomTimer = () => {
    const minutes = Number.parseInt(customMinutes)
    if (minutes > 0) {
      handleSetTimer(minutes)
      setCustomMinutes("")
    }
  }

  const handleCancelTimer = () => {
    setSleepTimer(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Sleep Timer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {sleepTimer && (
            <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <p className="text-white text-center">Sleep timer active: {sleepTimer} minutes</p>
              <Button
                onClick={handleCancelTimer}
                variant="outline"
                className="w-full mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Cancel Timer
              </Button>
            </div>
          )}

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Select</h3>
            <div className="grid grid-cols-3 gap-2">
              {presetTimes.map((minutes) => (
                <Button
                  key={minutes}
                  variant="outline"
                  onClick={() => handleSetTimer(minutes)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {minutes}m
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Custom Time</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Minutes"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
                min="1"
                max="999"
              />
              <Button
                onClick={handleCustomTimer}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!customMinutes || Number.parseInt(customMinutes) <= 0}
              >
                Set
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <p>Music will automatically pause when the timer expires.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
