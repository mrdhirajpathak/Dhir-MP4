"use client"

import { useMusic } from "@/contexts/music-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface EqualizerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EqualizerDialog({ open, onOpenChange }: EqualizerDialogProps) {
  const { equalizerSettings, setEqualizerSettings } = useMusic()

  const frequencies = ["60Hz", "170Hz", "310Hz", "600Hz", "1kHz", "3kHz", "6kHz", "12kHz", "14kHz", "16kHz"]

  const handleSliderChange = (index: number, value: number[]) => {
    const newSettings = [...equalizerSettings]
    newSettings[index] = value[0]
    setEqualizerSettings(newSettings)
  }

  const resetEqualizer = () => {
    setEqualizerSettings(new Array(10).fill(0))
  }

  const presets = {
    Rock: [5, 4, -1, -2, 1, 3, 4, 3, 2, 1],
    Pop: [2, 3, 2, 0, -1, -1, 0, 2, 3, 3],
    Jazz: [4, 3, 1, 2, -1, -1, 0, 1, 2, 3],
    Classical: [5, 4, 3, 2, -1, -2, -1, 2, 3, 4],
    Electronic: [4, 3, 1, 0, -1, 2, 1, 2, 3, 4],
  }

  const applyPreset = (preset: number[]) => {
    setEqualizerSettings(preset)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Equalizer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Presets */}
          <div>
            <h3 className="text-white font-semibold mb-3">Presets</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([name, values]) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(values)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {name}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={resetEqualizer}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Frequency Sliders */}
          <div>
            <h3 className="text-white font-semibold mb-4">Manual Adjustment</h3>
            <div className="grid grid-cols-5 gap-4">
              {frequencies.map((freq, index) => (
                <div key={freq} className="text-center">
                  <div className="h-32 flex items-end justify-center mb-2">
                    <Slider
                      orientation="vertical"
                      value={[equalizerSettings[index]]}
                      min={-10}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleSliderChange(index, value)}
                      className="h-full"
                    />
                  </div>
                  <div className="text-xs text-gray-400">{freq}</div>
                  <div className="text-xs text-white font-mono">
                    {equalizerSettings[index] > 0 ? "+" : ""}
                    {equalizerSettings[index]}dB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
