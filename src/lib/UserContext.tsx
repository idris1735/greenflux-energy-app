"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useFirebaseAuth } from "./firebaseAuthHelpers";
import { getUserProfile, getSellerProfile, getInstallerProfile } from "./firebaseHelpers";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useRouter } from "next/navigation";

interface UserContextValue {
  user: any;
  loading: boolean;
  userType: string | null;
  userProfile: any;
  sellerProfile: any;
  installerProfile: any;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  getDisplayName: () => string;
  getDisplayEmail: () => string;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  userType: null,
  userProfile: null,
  sellerProfile: null,
  installerProfile: null,
  isAuthenticated: false,
  logout: async () => {},
  refreshSession: async () => {},
  refreshProfiles: async () => {},
  getDisplayName: () => "",
  getDisplayEmail: () => "",
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useFirebaseAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [installerProfile, setInstallerProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshSession = async () => {
    if (user) {
      try {
        await user.reload();
        // Re-fetch user profile after session refresh
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        setUserType(profile?.user_type || null);
        
        if (profile?.user_type === 'seller') {
          const sellerProfile = await getSellerProfile(user.uid);
          setSellerProfile(sellerProfile);
        } else if (profile?.user_type === 'installer') {
          const installerProfile = await getInstallerProfile(user.uid);
          setInstallerProfile(installerProfile);
        }
      } catch (error) {
        console.error('Session refresh error:', error);
        // If session refresh fails, logout user
        await logout();
      }
    }
  };

  const refreshProfiles = async () => {
    if (user) {
      try {
        // Re-fetch all profile data
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        setUserType(profile?.user_type || null);
        
        if (profile?.user_type === 'seller') {
          const sellerProfile = await getSellerProfile(user.uid);
          setSellerProfile(sellerProfile);
        } else if (profile?.user_type === 'installer') {
          const installerProfile = await getInstallerProfile(user.uid);
          setInstallerProfile(installerProfile);
        }
      } catch (error) {
        console.error('Profile refresh error:', error);
      }
    }
  };

  const getDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email || 'User';
  };

  const getDisplayEmail = () => {
    // For sellers/installers, show business email if available, otherwise auth email
    if (userType === 'seller' && sellerProfile?.email) {
      return sellerProfile.email;
    }
    if (userType === 'installer' && installerProfile?.email) {
      return installerProfile.email;
    }
    return user?.email || '';
  };

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      
      // Check if user token is still valid
      user.getIdTokenResult().then((tokenResult) => {
        const currentTime = Date.now() / 1000;
        if (tokenResult.expirationTime && currentTime > Number(tokenResult.expirationTime)) {
          // Token expired, logout user
          logout();
          return;
        }
      }).catch((error) => {
        console.error('Token validation error:', error);
        logout();
        return;
      });
      
      // Load user profile with error handling
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          setUserProfile(profile);
          setUserType(profile.user_type || null);
          
          // Load role-specific profile
          if (profile.user_type === 'seller') {
            getSellerProfile(user.uid).then((sellerProfile) => {
              setSellerProfile(sellerProfile);
            }).catch((error) => {
              console.error('Error loading seller profile:', error);
            });
          } else if (profile.user_type === 'installer') {
            getInstallerProfile(user.uid).then((installerProfile) => {
              setInstallerProfile(installerProfile);
            }).catch((error) => {
              console.error('Error loading installer profile:', error);
            });
          }
        } else {
          // No profile found, redirect to registration
          router.push('/register');
        }
      }).catch((error) => {
        console.error('Error loading user profile:', error);
        // If profile loading fails, logout user
        logout();
      });
    } else {
      setIsAuthenticated(false);
      setUserProfile(null);
      setSellerProfile(null);
      setInstallerProfile(null);
      setUserType(null);
    }
  }, [user, router]);

  // Set up periodic session check (every 5 minutes)
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        user.getIdTokenResult().then((tokenResult) => {
          const currentTime = Date.now() / 1000;
          if (tokenResult.expirationTime && currentTime > Number(tokenResult.expirationTime)) {
            logout();
          }
        }).catch(() => {
          logout();
        });
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      userType, 
      userProfile, 
      sellerProfile, 
      installerProfile, 
      isAuthenticated,
      logout,
      refreshSession,
      refreshProfiles,
      getDisplayName,
      getDisplayEmail
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 