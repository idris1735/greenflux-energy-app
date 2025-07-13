"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'buyer' | 'seller' | 'installer';
  redirectTo?: string;
}

export function RouteGuard({ children, requiredRole, redirectTo = '/login' }: RouteGuardProps) {
  const { user, loading, userType, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated || !user) {
        router.push(redirectTo);
        return;
      }

      // If role is required but user doesn't have the required role
      if (requiredRole && userType !== requiredRole) {
        // Redirect to appropriate dashboard based on user's actual role
        if (userType === 'buyer') {
          router.push('/dashboard/buyer');
        } else if (userType === 'seller') {
          router.push('/dashboard/seller');
        } else if (userType === 'installer') {
          router.push('/dashboard/installer');
        } else {
          // Unknown role, redirect to login
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [loading, isAuthenticated, user, userType, requiredRole, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    return null;
  }

  // If role is required but user doesn't have the required role, don't render children
  if (requiredRole && userType !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

// Specific route guards for each role
export function BuyerRouteGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard requiredRole="buyer">{children}</RouteGuard>;
}

export function SellerRouteGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard requiredRole="seller">{children}</RouteGuard>;
}

export function InstallerRouteGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard requiredRole="installer">{children}</RouteGuard>;
}

// Dashboard route guard (any authenticated user)
export function DashboardRouteGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard>{children}</RouteGuard>;
} 