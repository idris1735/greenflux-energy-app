"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Slider } from "./ui/slider"
import { Calculator, Sun, Battery, Zap, ArrowRight, ArrowLeft, X } from "lucide-react"
import Link from "next/link"

// Common Nigerian household profiles
const householdProfiles = [
  {
    name: "Small Home",
    description: "1-2 rooms, basic appliances",
    dailyUsage: 2.5,
    icon: "🏠"
  },
  {
    name: "Medium Home",
    description: "2-3 rooms, AC & electronics",
    dailyUsage: 5,
    icon: "🏘️"
  },
  {
    name: "Large Home",
    description: "4+ rooms, multiple ACs",
    dailyUsage: 8,
    icon: "🏰"
  }
]

export function QuickCalculatorModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<number | null>(null)
  const [customUsage, setCustomUsage] = useState(5)
  const [backupHours, setBackupHours] = useState(12)
  const [result, setResult] = useState<{
    cost: number
    savings: number
    panels: number
    batteries: number
  } | null>(null)

  const calculateSystem = () => {
    const dailyUsage = profile !== null ? householdProfiles[profile].dailyUsage : customUsage
    const panels = Math.ceil((dailyUsage / 6) * 1000 / 400) // 400W panels, 6 sun hours
    const batteries = Math.ceil((dailyUsage * backupHours / 24) * 1000 / 200) // 200Ah batteries
    const cost = panels * 200000 + batteries * 300000 + 400000 // Basic estimate
    const monthlySavings = dailyUsage * 66 * 30 + dailyUsage * 700 * 0.7 * 30 // Grid + Generator savings

    setResult({
      cost,
      savings: monthlySavings,
      panels,
      batteries
    })
    setStep(3)
  }

  const resetCalculator = () => {
    setStep(1)
    setProfile(null)
    setCustomUsage(5)
    setBackupHours(12)
    setResult(null)
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full font-semibold border border-gray-700 hover:bg-gray-700 transition-colors"
        onClick={() => {
          setOpen(true)
          resetCalculator()
        }}
      >
        <Calculator className="w-5 h-5" />
        Solar Calculator
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] p-4 sm:p-6 bg-black/50 border-white/10">
          <DialogClose className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </DialogClose>
          
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              Quick Solar Calculator
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70">
              Get a quick estimate for your solar needs
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4 mt-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">Choose your home type:</h3>
              <div className="grid gap-2 sm:gap-3">
                {householdProfiles.map((p, i) => (
                  <button
                    key={i}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 sm:gap-4 ${
                      profile === i 
                        ? "border-green-500 bg-green-500/10" 
                        : "border-white/10 hover:border-green-500/50 hover:bg-white/5"
                    }`}
                    onClick={() => setProfile(i)}
                  >
                    <div className="text-3xl sm:text-4xl">{p.icon}</div>
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm sm:text-base">{p.name}</div>
                      <div className="text-xs sm:text-sm text-white/70">{p.description}</div>
                      <div className="text-xs sm:text-sm text-green-400 mt-0.5 sm:mt-1">
                        ~{p.dailyUsage} kWh/day
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 sm:gap-4 ${
                    profile === null 
                      ? "border-green-500 bg-green-500/10" 
                      : "border-white/10 hover:border-green-500/50 hover:bg-white/5"
                  }`}
                  onClick={() => setProfile(null)}
                >
                  <div className="text-3xl sm:text-4xl">⚡</div>
                  <div className="text-left">
                    <div className="font-semibold text-white text-sm sm:text-base">Custom Usage</div>
                    <div className="text-xs sm:text-sm text-white/70">
                      I know my daily consumption
                    </div>
                  </div>
                </button>
              </div>
              <Button 
                className="w-full text-sm sm:text-base"
                onClick={() => setStep(2)}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mt-2">
              {profile === null && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Enter your daily consumption:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="opacity-70">Daily Usage (kWh)</span>
                      <span className="font-semibold">{customUsage} kWh</span>
                    </div>
                    <Slider
                      value={[customUsage]}
                      onValueChange={(value: number[]) => setCustomUsage(value[0])}
                      min={1}
                      max={20}
                      step={0.5}
                      className="py-4"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-white text-sm sm:text-base">How many hours of backup power do you need?</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="opacity-70">Backup Duration</span>
                    <span className="font-semibold">{backupHours} hours</span>
                  </div>
                  <Slider
                    value={[backupHours]}
                    onValueChange={(value: number[]) => setBackupHours(value[0])}
                    min={6}
                    max={24}
                    step={1}
                    className="py-4"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 text-sm sm:text-base"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="flex-1 text-sm sm:text-base"
                  onClick={calculateSystem}
                >
                  Calculate
                </Button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-4 mt-2">
              <div className="grid gap-2 sm:gap-3">
                <div className="bg-green-500/10 rounded-xl p-3 sm:p-4 border border-green-500/20">
                  <div className="text-xs sm:text-sm text-white/70 mb-1">Estimated System Cost</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-400">
                    ₦{result.cost.toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-orange-500/10 rounded-xl p-3 sm:p-4 border border-orange-500/20">
                    <div className="text-xs sm:text-sm text-white/70 mb-1">Monthly Savings</div>
                    <div className="text-lg sm:text-xl font-bold text-orange-400">
                      ₦{Math.round(result.savings).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-3 sm:p-4 border border-blue-500/20">
                    <div className="text-xs sm:text-sm text-white/70 mb-1">Payback Period</div>
                    <div className="text-lg sm:text-xl font-bold text-blue-400">
                      {(result.cost / result.savings).toFixed(1)} years
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="opacity-70">Solar Panels</span>
                    <span className="font-semibold">{result.panels} x 400W</span>
                  </div>
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="opacity-70">Batteries</span>
                    <span className="font-semibold">{result.batteries} x 200Ah</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                  onClick={resetCalculator}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Link href="/calculator" className="block">
                  <Button 
                    className="w-full text-sm sm:text-base"
                    onClick={() => setOpen(false)}
                  >
                    Get Detailed Calculation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 