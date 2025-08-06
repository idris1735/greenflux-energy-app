"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "../../lib/UserContext";
import { logout } from "../../lib/firebaseAuthHelpers";
import { useState, useRef, useEffect } from "react";
import { Calculator, ShoppingCart, Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { QuickCalculatorModal } from "./quick-calculator-modal";

export default function Navbar() {
  const { user, userProfile, userType, isAuthenticated, getDisplayName } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const getProfileLink = () => {
    if (userType === 'seller') {
      return '/dashboard/seller/profile';
    }
    if (userType === 'installer') {
      return '/dashboard/installer/profile';
    }
    if (userType === 'buyer') {
      return '/dashboard/buyer';
    }
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-green-500/20 sticky">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Sun */}
                  <circle cx="35" cy="25" r="12" fill="#F59E0B" />
                  <rect x="32" y="8" width="6" height="8" rx="3" fill="#F59E0B" />
                  <rect x="45" y="12" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(45 48 16)" />
                  <rect x="45" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 48 32)" />
                  <rect x="19" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 22 32)" />
                  
                  {/* Wrench */}
                  <path d="M45 35 L65 55 L68 52 L58 42 L62 38 L68 44 L72 40 L58 26 L45 35Z" fill="#EA580C" />
                  <circle cx="68" cy="44" r="3" fill="white" />
                  
                  {/* Shopping Cart */}
                  <path d="M15 45 L20 45 L25 70 L70 70 L75 55 L30 55 L25 45 L85 45" 
                        stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="35" cy="80" r="4" fill="#059669" />
                  <circle cx="60" cy="80" r="4" fill="#059669" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-green-500">GREEN</span>
                <span className="text-yellow-500">FLUX</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/solutions" 
              className={`text-sm transition-colors ${
                pathname === "/solutions" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Solutions
            </Link>
            <Link 
              href="/home" 
              className={`text-sm transition-colors ${
                pathname === "/home" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/installers" 
              className={`text-sm transition-colors ${
                pathname === "/installers" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Find Installers
            </Link>
            <Link 
              href="/about" 
              className={`text-sm transition-colors ${
                pathname === "/about" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm transition-colors ${
                pathname === "/contact" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop nav actions */}
          <div className="hidden md:flex items-center gap-4">
            <QuickCalculatorModal />
            <Link href="/marketplace" className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:from-green-500 hover:to-yellow-500">
              <ShoppingCart className="w-5 h-5" />
              Marketplace
            </Link>
            {/* Profile Menu Button */}
            <div className="flex items-center gap-4 relative" ref={menuRef}>
              <button
                className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center bg-white/10 focus:outline-none"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Profile menu"
              >
                {userProfile?.profile_picture_url ? (
                  <Image
                    src={userProfile.profile_picture_url}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute left-0 md:right-0 md:left-auto top-full w-56 bg-white rounded shadow-2xl py-2 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <Link 
                          href={getProfileLink()}
                          className="text-gray-800 font-semibold hover:text-green-600 transition-colors block"
                        >
                          {getDisplayName()}
                        </Link>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Dashboard</Link>
                      {userType === 'seller' && (
                        <Link href="/dashboard/seller/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Company Profile</Link>
                      )}
                      {userType === 'installer' && (
                        <Link href="/dashboard/installer/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Company Profile</Link>
                      )}
                      {userType === 'buyer' && (
                        <Link href="/dashboard/buyer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Account</Link>
                      )}
                      <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</Link>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 text-gray-800 font-semibold">Not logged in</div>
                      <Link href="/login" className="block px-4 py-2 text-green-600 hover:bg-gray-100">Login</Link>
                      <Link href="/register" className="block px-4 py-2 text-yellow-600 hover:bg-gray-100">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col gap-4">
              <Link 
                href="/solutions" 
                className={`text-sm transition-colors ${
                  pathname === "/solutions" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                href="/home" 
                className={`text-sm transition-colors ${
                  pathname === "/home" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/installers" 
                className={`text-sm transition-colors ${
                  pathname === "/installers" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Installers
              </Link>
              <Link 
                href="/about" 
                className={`text-sm transition-colors ${
                  pathname === "/about" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className={`text-sm transition-colors ${
                  pathname === "/contact" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            
            <div className="pt-4 border-t border-gray-600">
              <QuickCalculatorModal />
              <Link 
                href="/marketplace" 
                className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:from-green-500 hover:to-yellow-500 mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                Marketplace
              </Link>
            </div>

            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-gray-600">
                <div className="px-4 py-2 text-white font-semibold">
                  <Link 
                    href={getProfileLink()}
                    className="hover:text-green-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getDisplayName()}
                  </Link>
                </div>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userType === 'seller' && (
                  <Link 
                    href="/dashboard/seller/profile" 
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Company Profile
                  </Link>
                )}
                {userType === 'installer' && (
                  <Link 
                    href="/dashboard/installer/profile" 
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Company Profile
                  </Link>
                )}
                {userType === 'buyer' && (
                  <Link 
                    href="/dashboard/buyer" 
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                )}
                <Link 
                  href="/dashboard/settings" 
                  className="block px-4 py-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-600">
                <div className="px-4 py-2 text-gray-300 font-semibold">Not logged in</div>
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-green-400 hover:text-green-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-2 text-yellow-400 hover:text-yellow-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 