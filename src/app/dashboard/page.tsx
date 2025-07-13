"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { DashboardRouteGuard } from "@/lib/routeGuard";

export default function Dashboard() {
  const { userType, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userType) {
      // Redirect to role-specific dashboard
      if (userType === 'buyer') {
        router.push('/dashboard/buyer');
      } else if (userType === 'seller') {
        router.push('/dashboard/seller');
      } else if (userType === 'installer') {
        router.push('/dashboard/installer');
      }
    }
  }, [userType, loading, router]);

  return (
    <DashboardRouteGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    </DashboardRouteGuard>
  );
} 