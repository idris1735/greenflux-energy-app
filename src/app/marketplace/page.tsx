"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Package, Zap, Clock, Send } from "lucide-react"
import Footer from "../components/footer"

export default function MarketplacePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the email subscription
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const features = [
    {
      icon: Package,
      title: "Premium Solar Products",
      description: "Curated selection of top-tier solar panels, inverters, and batteries from leading manufacturers."
    },
    {
      icon: Zap,
      title: "Smart Energy Solutions",
      description: "Advanced monitoring systems and smart home integration for optimal energy management."
    },
    {
      icon: Clock,
      title: "Express Installation",
      description: "Quick and professional installation services across Nigeria, backed by warranty."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#1a365d] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-yellow-500/30"
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              Something Big is Coming
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              We're building Nigeria's first premium marketplace for solar energy products. 
              Get ready to transform your energy future.
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
              {["30", "12", "45", "10"].map((number, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-400">{number}</div>
                  <div className="text-sm text-gray-400">{["Days", "Hours", "Minutes", "Seconds"][index]}</div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full hover:from-green-600 hover:to-yellow-600 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 mt-2"
                >
                  Thank you! We'll keep you updated.
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="relative py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-yellow-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser Stats */}
      <section className="relative py-16 sm:py-24 bg-black/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Products Coming" },
              { number: "24/7", label: "Support Ready" },
              { number: "100%", label: "Quality Assured" },
              { number: "30+", label: "Brand Partners" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 