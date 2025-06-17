"use client"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  HeadphonesIcon,
  AlertCircle,
  ChevronDown,
  Send
} from "lucide-react"
import Image from "next/image"
import Footer from "../components/footer"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-900 to-green-800 text-white py-16">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let's Talk About Your Solar Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Whether you have questions about our solutions or need support, 
            our team is here to help light up your world.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <Phone className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">24/7 Support Line</p>
              <p className="text-white font-semibold">+234 800 GREEN FLUX</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <Mail className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">Quick Response Within 24hrs</p>
              <p className="text-white font-semibold">hello@greenflux.ng</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <MessageSquare className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-300">Available 9am - 6pm WAT</p>
              <p className="text-white font-semibold">Start Chat →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">
                Send Us a Message
              </Badge>
              <h2 className="text-2xl font-bold mb-6">
                How Can We Help You?
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input placeholder="+234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                    <option>Select an option</option>
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Installation Query</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us how we can help..."
                    className="h-32"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">
                Visit Our Offices
              </Badge>
              <h2 className="text-2xl font-bold mb-6">
                Experience Solar In Person
              </h2>
              
              <div className="space-y-6">
                {/* Lagos Office */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    Lagos Experience Center
                  </h3>
                  <p className="text-gray-600 mb-4">
                    123 Solar Street, Victoria Island<br />
                    Lagos, Nigeria
                  </p>
                  <div className="flex items-start gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Mon - Fri: 9am - 6pm
                    </div>
                    <div>Sat: 10am - 4pm</div>
                  </div>
                </div>

                {/* Abuja Office */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-green-600 mr-2" />
                    Abuja Solar Hub
                  </h3>
                  <p className="text-gray-600 mb-4">
                    45 Power Avenue, Wuse II<br />
                    Abuja, Nigeria
                  </p>
                  <div className="flex items-start gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Mon - Fri: 9am - 6pm
                    </div>
                    <div>Sat: 10am - 4pm</div>
                  </div>
                </div>

                {/* Emergency Support */}
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Emergency Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For urgent technical issues or system failures, 
                    our emergency team is available 24/7.
                  </p>
                  <div className="text-red-600 font-semibold">
                    Emergency Hotline: +234 800 FIX SOLAR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 mb-4">
              Quick Answers
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our solar solutions and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "How long does installation take?",
                a: "Typical residential installations take 1-2 days, while commercial projects may take 3-5 days depending on system size."
              },
              {
                q: "What maintenance is required?",
                a: "Our systems require minimal maintenance. We recommend annual inspections and occasional panel cleaning."
              },
              {
                q: "Do you offer warranties?",
                a: "Yes, we provide comprehensive warranties: 25 years for panels, 10 years for inverters, and 5 years for batteries."
              },
              {
                q: "What payment options are available?",
                a: "We offer flexible payment plans, including outright purchase, installment payments, and lease-to-own options."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <button className="w-full flex items-center justify-between text-left">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 