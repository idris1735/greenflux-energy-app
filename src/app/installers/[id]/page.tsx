"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Heart, 
  Shield, 
  Check, 
  ChevronRight,
  Clock,
  Users,
  Calendar,
  Award,
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import Footer from "../../components/footer"

// Mock installer data (would come from Firebase/Firestore in production)
const MOCK_INSTALLER = {
  id: "i1",
  businessName: "SolarTech Installation Services",
  services: ["Residential", "Commercial", "Maintenance"],
  coverageArea: ["Lagos", "Ogun"],
  experienceYears: 8,
  rating: 4.8,
  reviewCount: 124,
  bio: "Professional solar installation team with over 8 years of experience. We specialize in both residential and commercial installations across Lagos and Ogun states. Our team is certified by the Nigerian Alternative Energy Association and we offer comprehensive warranties on all our work.",
  isAvailable: true,
  isFeatured: true,
  isVerified: true,
  portfolioImages: [
    "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c29sYXIlMjBpbnN0YWxsYXRpb258ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBob21lfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D"
  ],
  contactPhone: "+2348012345678",
  contactWhatsapp: "+2348012345678",
  location: "Lagos",
  joinDate: "Jan 2020",
  responseRate: "95%",
  responseTime: "Under 2 hours",
  certifications: ["Nigerian Alternative Energy Association", "Solar Energy Society of Nigeria"],
  completedProjects: 87,
  reviews: [
    {
      id: "r1",
      reviewer: "Oluwaseun A.",
      rating: 5,
      comment: "Excellent service! The team was professional, punctual, and completed the installation ahead of schedule. My solar system has been working flawlessly for 6 months now.",
      date: "3 months ago",
      verified: true
    },
    {
      id: "r2",
      reviewer: "Chinedu O.",
      rating: 4,
      comment: "Good installation service. The system works well, but there was a slight delay in the initial setup. Customer service was responsive when I had questions.",
      date: "5 months ago",
      verified: true
    },
    {
      id: "r3",
      reviewer: "Amina B.",
      rating: 5,
      comment: "Very satisfied with the installation. The team was knowledgeable and helped me understand how to maximize my solar system's efficiency.",
      date: "6 months ago",
      verified: true
    }
  ]
};

export default function InstallerDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // In production, we would fetch the installer data based on the ID
  const installer = MOCK_INSTALLER;
  
  // Reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews 
    ? installer.reviews 
    : installer.reviews.slice(0, 2);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#1a365d] text-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-400">
          <Link href="/marketplace" className="hover:text-green-400">
            Marketplace
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/installers" className="hover:text-green-400">
            Installers
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-300 truncate">{installer.businessName}</span>
        </div>
      </div>

      {/* Back Button (Mobile) */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-4">
        <Link href="/installers">
          <Button variant="outline" className="border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Installers
          </Button>
        </Link>
      </div>

      {/* Installer Details Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Portfolio Images */}
            <div className="lg:w-1/2">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                <Image
                  src={installer.portfolioImages[selectedImage]}
                  alt={`${installer.businessName} - Portfolio Image`}
                  fill
                  className="object-cover"
                />
                {installer.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500/80">
                    Featured Installer
                  </Badge>
                )}
                {!installer.isAvailable && (
                  <Badge className="absolute top-4 right-4 bg-gray-500/80">
                    Currently Unavailable
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {installer.portfolioImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-white/20"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${installer.businessName} - Portfolio Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Portfolio Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Project Portfolio</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <ImageIcon className="w-5 h-5 text-green-400 mr-2" />
                      <h3 className="font-medium">Recent Installations</h3>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {installer.completedProjects} Projects
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {installer.portfolioImages.map((image, index) => (
                      <div 
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`${installer.businessName} - Project ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-white/20 hover:bg-white/10"
                  >
                    View All Projects
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Installer Info */}
            <div className="lg:w-1/2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{installer.businessName}</h1>
                      {installer.isVerified && (
                        <Badge className="bg-green-500/20 text-green-400">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(installer.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-300">
                        {installer.rating} ({installer.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  {installer.bio}
                </p>
                
                {/* Key Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-green-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-400">Based in</div>
                      <div>{installer.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-400">Experience</div>
                      <div>{installer.experienceYears} years</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-400">Coverage Area</div>
                      <div>{installer.coverageArea.join(", ")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-400 mr-2" />
                    <div>
                      <div className="text-sm text-gray-400">Member Since</div>
                      <div>{installer.joinDate}</div>
                    </div>
                  </div>
                </div>
                
                {/* Services Offered */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {installer.services.map((service, index) => (
                      <Badge key={index} className="bg-white/10">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Certifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {installer.certifications.map((certification, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-400 mr-2" />
                        <span>{certification}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Contact Installer Section */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Contact Installer</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      variant={contactMethod === "whatsapp" ? "default" : "outline"}
                      className={
                        contactMethod === "whatsapp"
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-white/20 hover:bg-white/10"
                      }
                      onClick={() => setContactMethod("whatsapp")}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant={contactMethod === "call" ? "default" : "outline"}
                      className={
                        contactMethod === "call"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-white/20 hover:bg-white/10"
                      }
                      onClick={() => setContactMethod("call")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Installer
                    </Button>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600">
                    {contactMethod === "whatsapp" ? (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat on WhatsApp
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Your contact information is kept private
                    </div>
                    <div>Response time: {installer.responseTime}</div>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    {installer.rating} / 5
                  </Badge>
                </div>
                
                <div className="space-y-4 mb-4">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{review.reviewer}</div>
                          <div className="text-xs text-gray-400">{review.date}</div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{review.comment}</p>
                      {review.verified && (
                        <div className="flex items-center mt-1 text-xs text-green-400">
                          <Check className="w-3 h-3 mr-1" />
                          Verified Installation
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {installer.reviews.length > 2 && (
                  <Button
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Show Less" : `View All ${installer.reviews.length} Reviews`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 