"use client"

import { useState } from "react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Calculator,
  Sun,
  Battery,
  Zap,
  Clock,
  DollarSign,
  Leaf,
  Plus,
  Minus,
  Info,
  PlusCircle
} from "lucide-react"
import Footer from "../components/footer"

interface Appliance {
  watts: number;
  typical_hours: number;
}

interface ApplianceDatabase {
  [key: string]: Appliance;
}

// Nigerian appliance database with typical power ratings
const commonAppliances: ApplianceDatabase = {
  "Standing Fan": { watts: 50, typical_hours: 8 },
  "Air Conditioner (1HP)": { watts: 750, typical_hours: 6 },
  "Air Conditioner (1.5HP)": { watts: 1120, typical_hours: 6 },
  "Television (32\")": { watts: 55, typical_hours: 6 },
  "Television (43\")": { watts: 100, typical_hours: 6 },
  "Refrigerator": { watts: 150, typical_hours: 24 },
  "Freezer": { watts: 200, typical_hours: 24 },
  "Electric Iron": { watts: 1000, typical_hours: 1 },
  "Water Heater": { watts: 3000, typical_hours: 1 },
  "LED Bulb": { watts: 9, typical_hours: 6 },
  "Security Light": { watts: 20, typical_hours: 12 },
  "Water Pump (1HP)": { watts: 750, typical_hours: 2 },
  "Laptop": { watts: 65, typical_hours: 4 },
  "Phone Charger": { watts: 5, typical_hours: 3 }
}

// NERC tariffs (approximate average across regions)
const electricityRate = 66.0 // Naira per kWh
const generatorFuelCost = 700 // Naira per liter
const generatorFuelEfficiency = 0.7 // liters per kWh
const averageSunHours = 6 // Average sun hours in Nigeria

export default function CalculatorPage() {
  const [selectedAppliances, setSelectedAppliances] = useState<{
    [key: string]: { count: number; hours: number; watts?: number }
  }>({})
  const [customAppliance, setCustomAppliance] = useState({
    name: "",
    watts: "",
    hours: ""
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [results, setResults] = useState<{
    dailyUsage: number
    recommendedSystem: {
      panels: number
      batteries: number
      inverter: number
    }
    costs: {
      estimated: number
      monthlyGridSavings: number
      monthlyGeneratorSavings: number
      paybackPeriod: number
    }
    environmental: {
      yearlyCO2Reduction: number
      treesEquivalent: number
    }
  } | null>(null)

  const calculateSystem = () => {
    // Calculate total daily energy usage
    const dailyUsage = Object.entries(selectedAppliances).reduce(
      (total, [appliance, details]) => {
        const watts = commonAppliances[appliance as keyof typeof commonAppliances]?.watts || details.watts || 0
        return total + (watts * details.hours * details.count) / 1000 // Convert to kWh
      },
      0
    )

    // System sizing calculations
    const systemSize = (dailyUsage / averageSunHours) * 1.3 // 30% buffer
    const numberOfPanels = Math.ceil(systemSize * 1000 / 400) // Assuming 400W panels
    const batterySize = dailyUsage * 1.2 // 20% depth of discharge buffer
    const numberOfBatteries = Math.ceil(batterySize * 1000 / 200) // Assuming 200Ah 12V batteries
    const inverterSize = Math.ceil(
      Math.max(
        ...Object.entries(selectedAppliances).map(
          ([appliance, details]) =>
            commonAppliances[appliance as keyof typeof commonAppliances].watts *
            details.count
        )
      ) * 1.25 // 25% surge buffer
    )

    // Cost calculations (in Naira)
    const estimatedCost =
      numberOfPanels * 200000 + // 200,000 per panel
      numberOfBatteries * 300000 + // 300,000 per battery
      (inverterSize / 1000) * 400000 + // 400,000 per kVA
      150000 // Installation and other costs

    const monthlyGridSavings = dailyUsage * electricityRate * 30
    const monthlyGeneratorSavings =
      dailyUsage * generatorFuelCost * generatorFuelEfficiency * 30

    // Environmental impact
    const yearlyGridCO2 = dailyUsage * 0.5 * 365 // 0.5kg CO2 per kWh
    const yearlyGeneratorCO2 = dailyUsage * 0.8 * 365 // 0.8kg CO2 per kWh
    const totalCO2Reduction = yearlyGridCO2 + yearlyGeneratorCO2
    const treesEquivalent = Math.round(totalCO2Reduction / 20) // 1 tree absorbs ~20kg CO2 per year

    setResults({
      dailyUsage,
      recommendedSystem: {
        panels: numberOfPanels,
        batteries: numberOfBatteries,
        inverter: inverterSize
      },
      costs: {
        estimated: estimatedCost,
        monthlyGridSavings,
        monthlyGeneratorSavings,
        paybackPeriod:
          estimatedCost / (monthlyGridSavings + monthlyGeneratorSavings) / 12
      },
      environmental: {
        yearlyCO2Reduction: totalCO2Reduction,
        treesEquivalent
      }
    })
  }

  const addCustomAppliance = () => {
    if (customAppliance.name && customAppliance.watts && customAppliance.hours) {
      setSelectedAppliances({
        ...selectedAppliances,
        [customAppliance.name]: {
          count: 1,
          hours: parseInt(customAppliance.hours),
          watts: parseInt(customAppliance.watts)
        }
      })
      setCustomAppliance({ name: "", watts: "", hours: "" })
      setShowCustomForm(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-[#0a1833] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-yellow-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              Solar Calculator
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              Calculate Your Solar Needs
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Get a customized solar solution based on your energy usage and save money
              while contributing to a greener Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Appliance Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Select Your Appliances</h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Custom
                </Button>
              </div>

              {showCustomForm && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Add Custom Appliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Appliance Name"
                      className="px-3 py-2 rounded-lg border text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={customAppliance.name}
                      onChange={(e) => setCustomAppliance({ ...customAppliance, name: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Watts"
                      className="px-3 py-2 rounded-lg border text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={customAppliance.watts}
                      onChange={(e) => setCustomAppliance({ ...customAppliance, watts: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Hours/day"
                      className="px-3 py-2 rounded-lg border text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={customAppliance.hours}
                      onChange={(e) => setCustomAppliance({ ...customAppliance, hours: e.target.value })}
                    />
                  </div>
                  <button 
                    className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={addCustomAppliance}
                  >
                    Add Appliance
                  </button>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Common Appliances */}
                {Object.entries(commonAppliances).map(([appliance, specs]) => (
                  <div
                    key={appliance}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">{appliance}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {specs.watts}W
                          </span>
                          <span className="text-sm text-gray-600">
                            Typical: {specs.typical_hours}hrs/day
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                          <button
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 border-r"
                            onClick={() => {
                              const currentCount = selectedAppliances[appliance]?.count || 0
                              if (currentCount > 0) {
                                setSelectedAppliances({
                                  ...selectedAppliances,
                                  [appliance]: {
                                    count: currentCount - 1,
                                    hours: selectedAppliances[appliance]?.hours || specs.typical_hours
                                  }
                                })
                              }
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            className="w-16 text-center border-x text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            min="0"
                            value={selectedAppliances[appliance]?.count || ""}
                            onChange={(e) =>
                              setSelectedAppliances({
                                ...selectedAppliances,
                                [appliance]: {
                                  count: parseInt(e.target.value) || 0,
                                  hours: selectedAppliances[appliance]?.hours || specs.typical_hours
                                }
                              })
                            }
                          />
                          <button
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 border-l"
                            onClick={() => {
                              const currentCount = selectedAppliances[appliance]?.count || 0
                              setSelectedAppliances({
                                ...selectedAppliances,
                                [appliance]: {
                                  count: currentCount + 1,
                                  hours: selectedAppliances[appliance]?.hours || specs.typical_hours
                                }
                              })
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="number"
                          placeholder="Hrs"
                          className="w-20 px-3 py-2 rounded-lg border text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                          min="0"
                          max="24"
                          value={selectedAppliances[appliance]?.hours || ""}
                          onChange={(e) =>
                            setSelectedAppliances({
                              ...selectedAppliances,
                              [appliance]: {
                                count: selectedAppliances[appliance]?.count || 0,
                                hours: parseInt(e.target.value) || 0
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Custom Appliances */}
                {Object.entries(selectedAppliances)
                  .filter(([name]) => !commonAppliances[name])
                  .map(([appliance, details]) => (
                    <div
                      key={appliance}
                      className="bg-green-50 rounded-xl p-4 hover:bg-green-100/70 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900 text-lg">{appliance}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              {details.watts}W
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                            <button
                              className="px-3 py-2 text-gray-700 hover:bg-gray-100 border-r"
                              onClick={() => {
                                if (details.count > 1) {
                                  setSelectedAppliances({
                                    ...selectedAppliances,
                                    [appliance]: { ...details, count: details.count - 1 }
                                  })
                                } else {
                                  const newAppliances = { ...selectedAppliances }
                                  delete newAppliances[appliance]
                                  setSelectedAppliances(newAppliances)
                                }
                              }}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              className="w-16 text-center border-x text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                              min="0"
                              value={details.count || ""}
                              onChange={(e) =>
                                setSelectedAppliances({
                                  ...selectedAppliances,
                                  [appliance]: { ...details, count: parseInt(e.target.value) || 0 }
                                })
                              }
                            />
                            <button
                              className="px-3 py-2 text-gray-700 hover:bg-gray-100 border-l"
                              onClick={() =>
                                setSelectedAppliances({
                                  ...selectedAppliances,
                                  [appliance]: { ...details, count: (details.count || 0) + 1 }
                                })
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="number"
                            placeholder="Hrs"
                            className="w-20 px-3 py-2 rounded-lg border text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                            min="0"
                            max="24"
                            value={details.hours || ""}
                            onChange={(e) =>
                              setSelectedAppliances({
                                ...selectedAppliances,
                                [appliance]: { ...details, hours: parseInt(e.target.value) || 0 }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600"
                size="lg"
                onClick={calculateSystem}
              >
                Calculate System
              </Button>
            </div>

            {/* Results Section */}
            <div className="lg:sticky lg:top-24 h-fit">
              {results ? (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Your Results</h2>
                  </div>

                  {/* Daily Usage */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Daily Energy Usage</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {results.dailyUsage.toFixed(1)} kWh/day
                    </p>
                  </div>

                  {/* Recommended System */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Recommended System</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold text-xl text-green-700">{results.recommendedSystem.panels}</div>
                        <div className="text-sm text-green-600">Solar Panels</div>
                        <div className="text-xs text-green-500">400W each</div>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-green-700">{results.recommendedSystem.batteries}</div>
                        <div className="text-sm text-green-600">Batteries</div>
                        <div className="text-xs text-green-500">200Ah each</div>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-green-700">{(results.recommendedSystem.inverter / 1000).toFixed(1)}</div>
                        <div className="text-sm text-green-600">Inverter</div>
                        <div className="text-xs text-green-500">kVA</div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Analysis */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-900">Cost Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-yellow-700 mb-1">Estimated System Cost</div>
                        <div className="text-2xl font-bold text-yellow-800">
                          ₦{results.costs.estimated.toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-yellow-700 mb-1">Monthly Savings</div>
                          <div className="font-bold text-yellow-800">
                            ₦{Math.round(results.costs.monthlyGridSavings + results.costs.monthlyGeneratorSavings).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-yellow-700 mb-1">Payback Period</div>
                          <div className="font-bold text-yellow-800">
                            {results.costs.paybackPeriod.toFixed(1)} years
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-semibold text-emerald-900">Environmental Impact</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-emerald-700 mb-1">CO₂ Reduction</div>
                        <div className="font-bold text-emerald-800">
                          {Math.round(results.environmental.yearlyCO2Reduction).toLocaleString()} kg/year
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-emerald-700 mb-1">Equivalent to</div>
                        <div className="font-bold text-emerald-800">
                          {results.environmental.treesEquivalent} trees planted
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                    <Info className="w-4 h-4" />
                    <p>These calculations are estimates and may vary based on actual usage and conditions.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Calculation Yet</h3>
                  <p className="text-gray-500">
                    Select your appliances and their usage hours to get a customized solar system recommendation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 