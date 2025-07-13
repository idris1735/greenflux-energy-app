"use client";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import { DashboardRouteGuard } from "@/lib/routeGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userType, logout } = useUser();
  
  return (
    <DashboardRouteGuard>
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-gradient-to-b from-green-900 to-green-700 text-white p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
          
          {/* User Actions */}
          <div className="mb-6 space-y-2">
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
          
          {userType === "seller" && (
            <nav className="space-y-2">
              <Link href="/dashboard/seller" className="block hover:bg-green-800 rounded px-3 py-2">Overview</Link>
              <Link href="/dashboard/seller/my-products" className="block hover:bg-green-800 rounded px-3 py-2">My Products</Link>
              <Link href="/dashboard/seller/leads" className="block hover:bg-green-800 rounded px-3 py-2">Leads</Link>
              <Link href="/dashboard/seller/analytics" className="block hover:bg-green-800 rounded px-3 py-2">Analytics</Link>
              <Link href="/dashboard/seller/profile" className="block hover:bg-green-800 rounded px-3 py-2">Company Profile</Link>
              <Link href="/dashboard/settings" className="block hover:bg-green-800 rounded px-3 py-2">Settings</Link>
            </nav>
          )}
          {userType === "installer" && (
            <nav className="space-y-2">
              <Link href="/dashboard/installer" className="block hover:bg-green-800 rounded px-3 py-2">Overview</Link>
              <Link href="/dashboard/installer/profile" className="block hover:bg-green-800 rounded px-3 py-2">Company Profile</Link>
              <Link href="/dashboard/installer/leads" className="block hover:bg-green-800 rounded px-3 py-2">Leads</Link>
              <Link href="/dashboard/installer/reviews" className="block hover:bg-green-800 rounded px-3 py-2">Reviews</Link>
              <Link href="/dashboard/installer/availability" className="block hover:bg-green-800 rounded px-3 py-2">Availability</Link>
              <Link href="/dashboard/settings" className="block hover:bg-green-800 rounded px-3 py-2">Settings</Link>
            </nav>
          )}
          {userType === "buyer" && (
            <nav className="space-y-2">
              <Link href="/dashboard/buyer" className="block hover:bg-green-800 rounded px-3 py-2">Overview</Link>
              <Link href="/dashboard/buyer/saved-products" className="block hover:bg-green-800 rounded px-3 py-2">Saved Products</Link>
              <Link href="/dashboard/buyer/my-inquiries" className="block hover:bg-green-800 rounded px-3 py-2">My Inquiries</Link>
              <Link href="/dashboard/settings" className="block hover:bg-green-800 rounded px-3 py-2">Settings</Link>
            </nav>
          )}
        </aside>
        <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-20">{children}</main>
      </div>
    </DashboardRouteGuard>
  );
} 