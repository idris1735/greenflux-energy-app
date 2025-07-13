import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from "firebase/auth";
import { createUserProfile, createSellerProfile, createInstallerProfile } from "./firebaseHelpers";
import { useEffect, useState } from "react";

// --- SIGNUP WITH ROLE ---
export async function signupWithEmailAndRole({ 
  email, 
  password, 
  userData 
}: { 
  email: string; 
  password: string; 
  userData: {
    user_type: 'buyer' | 'seller' | 'installer';
    first_name: string;
    last_name: string;
    phone_number?: string;
    business_name?: string;
    [key: string]: any;
  }
}) {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create base user profile
  await createUserProfile(user.uid, {
    email,
    user_type: userData.user_type,
    first_name: userData.first_name,
    last_name: userData.last_name,
    phone_number: userData.phone_number || '',
    full_name: `${userData.first_name} ${userData.last_name}`,
    profile_picture_url: '',
  });

  // Create role-specific profile
  if (userData.user_type === 'seller') {
    await createSellerProfile(user.uid, {
      business_name: userData.business_name || '',
      contact_phone: userData.phone_number || '',
      contact_whatsapp: userData.phone_number || '',
      location: userData.location || '',
      description: userData.description || '',
    });
  } else if (userData.user_type === 'installer') {
    await createInstallerProfile(user.uid, {
      business_name: userData.business_name || '',
      contact_phone: userData.phone_number || '',
      contact_whatsapp: userData.phone_number || '',
      services_offered: userData.services_offered || ['Residential'],
      coverage_area: userData.coverage_area || [],
      experience_years: userData.experience_years || 1,
      bio: userData.bio || '',
    });
  }

  return user;
}

// --- SIGNUP (Legacy - for backward compatibility) ---
export async function signupWithEmail({ email, password, userData }: { email: string; password: string; userData: any }) {
  return signupWithEmailAndRole({ email, password, userData });
}

// --- LOGIN ---
export async function loginWithEmail(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// --- LOGOUT ---
export async function logout() {
  await signOut(auth);
}

// --- USER STATE HOOK ---
export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
} 