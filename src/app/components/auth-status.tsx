"use client";

import { useUser } from "@/lib/UserContext";
import { LogOut, User } from "lucide-react";

export function AuthStatus() {
  const { user, isAuthenticated, userType, logout } = useUser();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <User className="w-4 h-4" />
        <span className="capitalize">{userType}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
} 