"use client"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Sun, Users, Heart, Lightbulb, Leaf, Trophy, MapPin } from "lucide-react"
import Image from "next/image"
import Footer from "../components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Fun Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/about-us-hero.jpg"
            alt="GreenFlux Team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <Badge className="bg-green-900/50 text-green-400 border-green-500/20 mb-4">
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-3xl">
            Bringing <span className="text-yellow-400">Sunshine</span> to Every Nigerian Home
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            We're not just another solar company. We're your neighbors, dreamers, and 
            problem-solvers passionate about lighting up Nigeria, one solar panel at a time.
          </p>
        </div>
      </section>

      {/* Fun Facts Grid */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">5MW+</div>
              <div className="text-gray-600">Solar Power Installed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">2,000+</div>
              <div className="text-gray-600">Happy Families</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">10k+</div>
              <div className="text-gray-600">Trees Worth of CO₂ Saved</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">#1</div>
              <div className="text-gray-600">Most Trusted Solar Brand</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 text-white rounded-2xl p-8 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
              <div className="h-px w-24 bg-green-400 mb-6" />
              <p className="text-gray-100 text-lg leading-relaxed">
                To revolutionize Nigeria's energy landscape by making reliable, sustainable solar power 
                accessible to every home and business, reducing dependence on traditional power sources 
                while building a greener future for generations to come.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-8 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
              <div className="h-px w-24 bg-white mb-6" />
              <p className="text-gray-100 text-lg leading-relaxed">
                To be the driving force behind Nigeria's solar revolution, creating a future where 
                sustainable energy is not just an alternative, but the primary source of power for 
                every Nigerian, fostering economic growth and environmental sustainability.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">Every decision we make starts with our customers' needs and satisfaction.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">We maintain the highest standards in every installation and service we provide.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">We're committed to creating a greener, more sustainable future for Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/team-at-work.jpg"
                alt="Our Team at Work"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white">
                  <div className="text-sm mb-1">Featured Project</div>
                  <div className="font-semibold">Lagos Community Solar Initiative</div>
                </div>
              </div>
            </div>
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">Our Journey</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From a Small Workshop to Nigeria's Solar Leader
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  It all started in 2018 with three friends in a tiny Lagos workshop, 
                  armed with nothing but solar panels and a dream to solve Nigeria's 
                  power problems.
                </p>
                <p>
                  Fast forward to today, we're a team of 50+ passionate individuals, 
                  from engineers to installers, all united by one mission: making 
                  reliable solar power accessible to every Nigerian home and business.
                </p>
                <p>
                  But what makes us different? We're not just installers - we're your 
                  partners in sustainable living. We dance at our customers' home-lighting 
                  ceremonies, celebrate at their business launches, and share in their 
                  joy of uninterrupted power.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">The Dream Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Meet the Sunshine Spreaders</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mr Marvel",
                role: "Chief Executive Officer",
                image: "/profile-placeholder.jpg",
                fun: "The visionary behind GreenFlux, turning Nigeria's sunshine into a power revolution ⚡️"
              },
              {
                name: "Big Beasty",
                role: "Operations Director",
                image: "/profile-placeholder.jpg",
                fun: "The guardian of quality, making sure every installation is perfect down to the last bolt 💪"
              },
              {
                name: "Idris M",
                role: "Lead Developer",
                image: "/profile-placeholder.jpg",
                fun: "The architect of our systems, building the future of solar tech one line of code at a time 🚀"
              }
            ].map((member, i) => (
              <div key={i} className="group relative">
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <div className="text-green-400 mb-2">{member.role}</div>
                    <p className="text-sm text-gray-300">{member.fun}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to Find Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-green-100 text-green-700 mb-4">Visit Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Drop By For Some Sunshine ☀️</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Our doors (and hearts) are always open. Come see solar power in action at our 
            experience center, or just stop by for some solar-powered coffee!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lagos Experience Center</h3>
              <p className="text-gray-600">
                123 Solar Street, Victoria Island<br />
                Lagos, Nigeria
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Mon - Fri: 9am - 6pm<br />
                Sat: 10am - 4pm
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Abuja Solar Hub</h3>
              <p className="text-gray-600">
                45 Power Avenue, Wuse II<br />
                Abuja, Nigeria
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Mon - Fri: 9am - 6pm<br />
                Sat: 10am - 4pm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-900 to-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">Join Our Mission</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Spread Some Sunshine?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            We're always looking for passionate people to join our mission of lighting up Nigeria. 
            Whether you're an engineer, installer, or just passionate about solar, we'd love to hear from you!
          </p>
          <Button className="bg-white text-green-900 hover:bg-gray-100">
            View Open Positions
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
} 