"use client";

import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock installer data
const MOCK_INSTALLERS = [
  {
    id: "i1",
    businessName: "SolarTech Installation Services",
    services: ["Residential", "Commercial", "Maintenance"],
    location: "Ikeja, Lagos",
    rating: 4.8,
    isAvailable: true,
    isVerified: true,
    contactPhone: "+2348012345678",
    contactWhatsapp: "+2348012345678",
  },
  {
    id: "i2",
    businessName: "PowerUp Installations",
    services: ["Residential", "Battery Systems"],
    location: "Victoria Island, Lagos",
    rating: 4.6,
    isAvailable: true,
    isVerified: true,
    contactPhone: "+2348023456789",
    contactWhatsapp: "+2348023456789",
  },
  {
    id: "i3",
    businessName: "GreenWave Solar Installations",
    services: ["Commercial", "Industrial", "Maintenance"],
    location: "Abuja",
    rating: 4.9,
    isAvailable: true,
    isVerified: true,
    contactPhone: "+2348034567890",
    contactWhatsapp: "+2348034567890",
  },
  {
    id: "i4",
    businessName: "SunPro Installers",
    services: ["Residential", "Off-Grid Systems"],
    location: "Ibadan",
    rating: 4.2,
    isAvailable: false,
    isVerified: false,
    contactPhone: "+2348045678901",
    contactWhatsapp: "+2348045678901",
  },
];

type Installer = typeof MOCK_INSTALLERS[0];

export default function FindInstallersStaticPage() {
  const [search, setSearch] = useState("");

  // Fuzzy search setup
  const fuse = useMemo(() => new Fuse(MOCK_INSTALLERS, {
    keys: ["businessName", "services", "location"],
    threshold: 0.4,
  }), []);

  // Filtered installers (always at least one)
  const filteredInstallers: Installer[] = useMemo(() => {
    if (!search.trim()) return MOCK_INSTALLERS;
    const results = fuse.search(search).map(r => r.item);
    return results.length > 0 ? results : [MOCK_INSTALLERS[0]];
  }, [search, fuse]);

  return (
    <main className="relative min-h-screen w-full flex flex-col">
      {/* Animated Background Image */}
      <motion.img
        src="/installer-bg.jpg"
        alt="Installer background"
        className="fixed inset-0 w-full h-full object-cover z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      {/* Animated Dark Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/80 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Centered Content with Scrollable Results */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center min-h-screen px-4 py-8">
          {/* Search Bar */}
        <div className="w-full max-w-xl mx-auto flex gap-2 bg-white/10 rounded-xl p-4 shadow-lg backdrop-blur-lg border border-white/20">
              <Input
                type="text"
            placeholder="Search for installers, services, or locations..."
            className="flex-1 bg-transparent text-white placeholder-gray-300 border-none focus:ring-0 text-base md:text-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button className="bg-gradient-to-r from-green-500 to-yellow-500 px-4">
                <Search className="w-5 h-5" />
              </Button>
        </div>

        {/* Installer Results (Scrollable) */}
        <AnimatePresence>
          {(search || filteredInstallers.length > 0) && (
            <motion.div
              className="mt-8 w-full max-w-xl max-h-[60vh] overflow-y-auto bg-white/90 rounded-2xl shadow-xl p-4 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {filteredInstallers.map(installer => (
                <div
                  key={installer.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-2 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-gray-900 truncate">{installer.businessName}</div>
                    <div className="text-sm text-gray-600 mb-1 truncate">{installer.location}</div>
                    <div className="flex flex-wrap gap-2 text-xs mb-1">
                      {installer.services.map(service => (
                        <span key={service} className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className={installer.isVerified ? "text-green-600" : "text-gray-400"}>
                        {installer.isVerified ? "Verified" : "Not Verified"}
                      </span>
                      <span className={installer.isAvailable ? "text-blue-600" : "text-gray-400"}>
                        {installer.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      <span className="text-yellow-600 font-bold">{installer.rating}★</span>
              </div>
            </div>
                  <div className="flex gap-2 mt-2 md:mt-0 shrink-0">
                    <a
                      href={`tel:${installer.contactPhone}`}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-1 text-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${installer.contactWhatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500 flex items-center gap-1 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
    </motion.div>
          )}
        </AnimatePresence>
          </div>
    </main>
  );
} 