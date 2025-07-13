"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { SellerRouteGuard } from "@/lib/routeGuard";
import { getSellerProfile, updateSellerProfile, uploadImage, checkBusinessNameUnique, createSellerProfile } from "@/lib/firebaseHelpers";
import { Toast } from "@/app/components/ui/toast";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  Award,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  X
} from "lucide-react";
import Link from "next/link";

interface SellerProfile {
  // Personal information (from signup)
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  
  // Business information (to be filled in profile)
  business_name: string; // Required and should be unique
  company_name: string; // Alias for business_name
  contact_person_name: string;
  company_description: string;
  company_logo_url: string;
  address: string;
  city: string;
  state: string;
  website: string;
  years_in_business: number;
  specialties: string[];
  certifications: string[];
  service_areas: string[];
  business_hours: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };
  social_media: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  
  // Profile completion status
  profile_completed: boolean;
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const SOLAR_SPECIALTIES = [
  "Residential Solar", "Commercial Solar", "Industrial Solar", "Off-grid Systems",
  "Grid-tied Systems", "Solar Water Pumping", "Solar Street Lighting", "Solar Inverters",
  "Battery Systems", "Solar Panels", "Charge Controllers", "Mounting Systems",
  "Solar Accessories", "System Design", "Installation", "Maintenance", "Consulting"
];

const COMMON_CERTIFICATIONS = [
  "NAFDAC Certified", "SON Certified", "ISO 9001", "ISO 14001", "OHSAS 18001",
  "Solar Energy International", "NABCEP Certified", "Local Government License",
  "Electrical Contractor License", "Renewable Energy Certification"
];

export default function SellerProfilePage() {
  const router = useRouter();
  const { user, refreshProfiles } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [profile, setProfile] = useState<SellerProfile>({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    phone_number: "",
    business_name: "",
    company_name: "",
    contact_person_name: "",
    company_description: "",
    company_logo_url: "",
    address: "",
    city: "",
    state: "",
    website: "",
    years_in_business: 0,
    specialties: [],
    certifications: [],
    service_areas: [],
    business_hours: {},
    social_media: {},
    profile_completed: false
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getSellerProfile(user.uid);
      if (profileData) {
        // Handle both business_name and company_name fields from database
        const businessName = profileData.business_name || profileData.company_name || "";
        
        setProfile({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          full_name: profileData.full_name || "",
          email: profileData.email || "",
          phone_number: profileData.phone_number || "",
          business_name: businessName,
          company_name: businessName, // Keep both fields in sync
          contact_person_name: profileData.contact_person_name || "",
          company_description: profileData.company_description || "",
          company_logo_url: profileData.company_logo_url || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          website: profileData.website || "",
          years_in_business: profileData.years_in_business || 0,
          specialties: profileData.specialties || [],
          certifications: profileData.certifications || [],
          service_areas: profileData.service_areas || [],
          business_hours: profileData.business_hours || {},
          social_media: profileData.social_media || {},
          profile_completed: profileData.profile_completed || false
        });
        setLogoPreview(profileData.company_logo_url || "");
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayToggle = (field: keyof SellerProfile, value: string) => {
    setProfile(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.business_name.trim()) {
      setError("Business name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      // Check if business name is unique (only if it's being changed)
      const currentProfile = await getSellerProfile(user.uid);
      const currentBusinessName = currentProfile?.business_name || currentProfile?.company_name || "";
      if (currentBusinessName !== profile.business_name) {
        const isUnique = await checkBusinessNameUnique(profile.business_name, user.uid);
        if (!isUnique) {
          setError("Business name already exists. Please choose a different name.");
          return;
        }
      }

      let logoUrl = profile.company_logo_url;
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, `sellers/${user.uid}/logo`);
      }

      // Only update business fields that have been changed
      const updateData: any = {};
      if (profile.business_name !== currentBusinessName) {
        updateData.business_name = profile.business_name;
        updateData.company_name = profile.business_name; // Keep both fields in sync
      }
      if (profile.contact_person_name !== currentProfile?.contact_person_name) updateData.contact_person_name = profile.contact_person_name;
      if (profile.company_description !== currentProfile?.company_description) updateData.company_description = profile.company_description;
      if (profile.address !== currentProfile?.address) updateData.address = profile.address;
      if (profile.city !== currentProfile?.city) updateData.city = profile.city;
      if (profile.state !== currentProfile?.state) updateData.state = profile.state;
      if (profile.website !== currentProfile?.website) updateData.website = profile.website;
      if (profile.years_in_business !== currentProfile?.years_in_business) updateData.years_in_business = profile.years_in_business;
      if (JSON.stringify(profile.specialties) !== JSON.stringify(currentProfile?.specialties)) updateData.specialties = profile.specialties;
      if (JSON.stringify(profile.certifications) !== JSON.stringify(currentProfile?.certifications)) updateData.certifications = profile.certifications;
      if (JSON.stringify(profile.service_areas) !== JSON.stringify(currentProfile?.service_areas)) updateData.service_areas = profile.service_areas;
      if (logoUrl !== currentProfile?.company_logo_url) updateData.company_logo_url = logoUrl;

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        try {
          await updateSellerProfile(user.uid, updateData);
        } catch (err: any) {
          // If update fails due to missing document, create it instead
          if (err.message && err.message.includes('No document to update')) {
            await createSellerProfile(user.uid, {
              ...currentProfile,
              ...updateData,
              updated_at: new Date(),
              created_at: currentProfile?.created_at || new Date(),
            });
          } else {
            throw err;
          }
        }
        // Refresh profiles in context to update UI everywhere
        await refreshProfiles();
        setSuccess(true);
        setToastMessage("Profile updated successfully! Your changes are now visible across the platform.");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setToastMessage("No changes detected. Your profile is already up to date.");
        setToastType("success");
        setShowToast(true);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || "Failed to update profile");
      setToastMessage(err.message || "Failed to update profile");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerRouteGuard>
        <div className="pt-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        </div>
      </SellerRouteGuard>
    );
  }

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <p className="text-gray-600 mt-1">Update your company information and branding</p>
            </div>
            <Link
              href="/dashboard/seller"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Settings Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Personal Information</h3>
                <p className="text-blue-700 text-sm">
                  To update your personal information (name, phone, email), please visit your 
                  <Link href="/dashboard/settings" className="text-blue-800 font-medium hover:underline"> Account Settings</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={profile.business_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={profile.business_name || "Enter your business name"}
                />
                {profile.business_name && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Business name is set
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  This is the name that will appear on your products
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={profile.contact_person_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={profile.contact_person_name || "Primary contact person"}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  name="company_description"
                  value={profile.company_description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell customers about your company, experience, and what makes you unique..."
                />
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Company Logo
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: Square image, 512x512 pixels or larger
                </p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={profile.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={profile.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Business Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business
                </label>
                <input
                  type="number"
                  name="years_in_business"
                  value={profile.years_in_business}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Specialties
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SOLAR_SPECIALTIES.map(specialty => (
                  <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.specialties.includes(specialty)}
                      onChange={() => handleArrayToggle('specialties', specialty)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Certifications
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {COMMON_CERTIFICATIONS.map(cert => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.certifications.includes(cert)}
                      onChange={() => handleArrayToggle('certifications', cert)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </SellerRouteGuard>
  );
} 