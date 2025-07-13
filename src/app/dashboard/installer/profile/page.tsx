"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { InstallerRouteGuard } from "@/lib/routeGuard";
import { 
  getInstallerProfile, 
  updateInstallerProfile,
  uploadImage 
} from "@/lib/firebaseHelpers";
import { Toast } from "@/app/components/ui/toast";
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface InstallerProfile {
  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  
  // Business Information
  company_name: string;
  business_description: string;
  business_logo?: string;
  contact_person: string;
  location: string;
  service_areas: string[];
  specialties: string[];
  certifications: string[];
  experience_years: number;
  
  // Business Details
  business_phone: string;
  business_email: string;
  website?: string;
  social_media?: {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
  };
  
  // Professional Information
  is_verified: boolean;
  is_available: boolean;
  average_rating: number;
  review_count: number;
  completed_installations: number;
  total_earnings: number;
}

export default function InstallerProfilePage() {
  const { user, userProfile, refreshProfiles } = useUser();
  const [profile, setProfile] = useState<InstallerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    
    // Business Information
    company_name: "",
    business_description: "",
    contact_person: "",
    location: "",
    service_areas: [] as string[],
    specialties: [] as string[],
    certifications: [] as string[],
    experience_years: 0,
    
    // Business Details
    business_phone: "",
    business_email: "",
    website: "",
    social_media: {
      whatsapp: "",
      facebook: "",
      instagram: ""
    }
  });

  const [newServiceArea, setNewServiceArea] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getInstallerProfile(user.uid);
      
      if (profileData) {
        setProfile(profileData as any);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          company_name: profileData.company_name || "",
          business_description: profileData.business_description || "",
          contact_person: profileData.contact_person || "",
          location: profileData.location || "",
          service_areas: profileData.service_areas || [],
          specialties: profileData.specialties || [],
          certifications: profileData.certifications || [],
          experience_years: profileData.experience_years || 0,
          business_phone: profileData.business_phone || "",
          business_email: profileData.business_email || "",
          website: profileData.website || "",
          social_media: profileData.social_media || {
            whatsapp: "",
            facebook: "",
            instagram: ""
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return "";
    
    try {
      setUploadingLogo(true);
      const logoPath = await uploadImage(logoFile, `installers/${user.uid}/logo`);
      return logoPath;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return "";
    } finally {
      setUploadingLogo(false);
    }
  };

  const addServiceArea = () => {
    if (newServiceArea.trim() && !formData.service_areas.includes(newServiceArea.trim())) {
      setFormData(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, newServiceArea.trim()]
      }));
      setNewServiceArea("");
    }
  };

  const removeServiceArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter(a => a !== area)
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let logoPath = "";
      if (logoFile) {
        logoPath = await uploadLogo();
      }

      // Get current profile to compare changes
      const currentProfile = await getInstallerProfile(user.uid);
      
      // Only update business fields that have been changed
      const updateData: any = {};
      if (formData.company_name !== currentProfile?.company_name) updateData.company_name = formData.company_name;
      if (formData.business_description !== currentProfile?.business_description) updateData.business_description = formData.business_description;
      if (formData.contact_person !== currentProfile?.contact_person) updateData.contact_person = formData.contact_person;
      if (formData.location !== currentProfile?.location) updateData.location = formData.location;
      if (formData.business_phone !== currentProfile?.business_phone) updateData.business_phone = formData.business_phone;
      if (formData.business_email !== currentProfile?.business_email) updateData.business_email = formData.business_email;
      if (formData.website !== currentProfile?.website) updateData.website = formData.website;
      if (formData.experience_years !== currentProfile?.experience_years) updateData.experience_years = formData.experience_years;
      if (JSON.stringify(formData.service_areas) !== JSON.stringify(currentProfile?.service_areas)) updateData.service_areas = formData.service_areas;
      if (JSON.stringify(formData.specialties) !== JSON.stringify(currentProfile?.specialties)) updateData.specialties = formData.specialties;
      if (JSON.stringify(formData.certifications) !== JSON.stringify(currentProfile?.certifications)) updateData.certifications = formData.certifications;
      if (JSON.stringify(formData.social_media) !== JSON.stringify(currentProfile?.social_media)) updateData.social_media = formData.social_media;
      if (logoPath && logoPath !== currentProfile?.business_logo) updateData.business_logo = logoPath;

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateInstallerProfile(user.uid, {
          ...updateData,
          updated_at: new Date()
        });
        
        // Refresh profiles in context to update UI everywhere
        await refreshProfiles();
        
        setToastMessage("Profile updated successfully! Your changes are now visible across the platform.");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMessage("No changes detected. Your profile is already up to date.");
        setToastType("success");
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setToastMessage("Error updating profile. Please try again.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const getProfileCompletion = () => {
    const requiredFields = [
      formData.first_name,
      formData.last_name,
      formData.company_name,
      formData.business_description,
      formData.location,
      formData.business_phone,
      formData.business_email
    ];
    
    const completed = requiredFields.filter(field => field.trim() !== "").length;
    return Math.round((completed / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <InstallerRouteGuard>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </InstallerRouteGuard>
    );
  }

  const completionPercentage = getProfileCompletion();

  return (
    <InstallerRouteGuard>
      <div className="pt-4">
        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your business information and professional details
          </p>
        </div>

        {/* Profile Completion Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-blue-100">
                A complete profile helps you get more leads and build trust with customers
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <div className="text-blue-100 text-sm">Complete</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Account Settings Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Business Information */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={formData.company_name || "e.g., SolarTech Installations Ltd"}
                    required
                  />
                  {formData.company_name && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Business name is set
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={formData.business_description}
                    onChange={(e) => handleInputChange("business_description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your installation services and expertise..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange("contact_person", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Lagos, Nigeria"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Contact Details */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Business Contact Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.business_phone}
                    onChange={(e) => handleInputChange("business_phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    value={formData.business_email}
                    onChange={(e) => handleInputChange("business_email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.social_media.whatsapp}
                    onChange={(e) => handleInputChange("social_media.whatsapp", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="2348030000000"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>
              </div>
              
              <div className="space-y-4">
                {/* Service Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Areas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newServiceArea}
                      onChange={(e) => setNewServiceArea(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., Lagos, Ikeja"
                    />
                    <button
                      type="button"
                      onClick={addServiceArea}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.service_areas.map((area, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => removeServiceArea(area)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., Residential Solar"
                    />
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., NABCEP Certified"
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((certification, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {certification}
                        <button
                          type="button"
                          onClick={() => removeCertification(certification)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Logo */}
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Business Logo</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {(logoPreview || profile?.business_logo) ? (
                      <Image
                        src={logoPreview || profile?.business_logo || ""}
                        alt="Business Logo"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                    >
                      {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </InstallerRouteGuard>
  );
} 