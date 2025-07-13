"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { DashboardRouteGuard } from "@/lib/routeGuard";
import { updateUserProfile, getUserProfile } from "@/lib/firebaseHelpers";
import { Toast } from "@/app/components/ui/toast";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  AlertCircle,
  CheckCircle,
  Save,
  Shield,
  Key
} from "lucide-react";
import Link from "next/link";

interface SettingsForm {
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_email: string; // This is different from login email
}

export default function SettingsPage() {
  const { user, userProfile, userType, refreshProfiles } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  
  const [formData, setFormData] = useState<SettingsForm>({
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_email: ""
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        phone_number: userProfile.phone_number || "",
        profile_email: userProfile.profile_email || userProfile.email || ""
      });
      setLoading(false);
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Get current profile to compare changes
      const currentProfile = await getUserProfile(user.uid);
      
      // Only update fields that have been changed
      const updateData: any = {};
      if (formData.first_name !== currentProfile?.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name !== currentProfile?.last_name) updateData.last_name = formData.last_name;
      if (formData.phone_number !== currentProfile?.phone_number) updateData.phone_number = formData.phone_number;
      if (formData.profile_email !== currentProfile?.profile_email) updateData.profile_email = formData.profile_email;

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateUserProfile(user.uid, {
          ...updateData,
          updated_at: new Date()
        });
        
        // Refresh profiles to update UI everywhere
        await refreshProfiles();
        
        setToastMessage("Account settings updated successfully!");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMessage("No changes detected. Your settings are already up to date.");
        setToastType("success");
        setShowToast(true);
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      setToastMessage(error.message || "Failed to update settings");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const getProfileLink = () => {
    if (userType === 'seller') return '/dashboard/seller/profile';
    if (userType === 'installer') return '/dashboard/installer/profile';
    if (userType === 'buyer') return '/dashboard/buyer';
    return '/dashboard';
  };

  if (loading) {
    return (
      <DashboardRouteGuard>
        <div className="pt-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        </div>
      </DashboardRouteGuard>
    );
  }

  return (
    <DashboardRouteGuard>
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
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your personal account information and security</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={formData.first_name || "Your first name"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={formData.last_name || "Your last name"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={formData.phone_number || "+234 801 234 5678"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Email
                    </label>
                    <input
                      type="email"
                      name="profile_email"
                      value={formData.profile_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={formData.profile_email || "your@email.com"}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This email is used for profile display and communications
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Change your account password</p>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Email Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Email Addresses</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-blue-800">Login Email</p>
                  <p className="text-sm text-blue-700">{user?.email}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Used for authentication - cannot be changed here
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-blue-800">Profile Email</p>
                  <p className="text-sm text-blue-700">{formData.profile_email}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Used for communications and display
                  </p>
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Account Type</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{userType}</span>
                </div>
                
                {userType === 'seller' && (
                  <Link 
                    href="/dashboard/seller/profile"
                    className="text-sm text-green-600 hover:text-green-700 block"
                  >
                    Manage Business Profile →
                  </Link>
                )}
                
                {userType === 'installer' && (
                  <Link 
                    href="/dashboard/installer/profile"
                    className="text-sm text-blue-600 hover:text-blue-700 block"
                  >
                    Manage Business Profile →
                  </Link>
                )}

                {userType === 'buyer' && (
                  <Link 
                    href="/dashboard/buyer"
                    className="text-sm text-green-600 hover:text-green-700 block"
                  >
                    Manage Personal Profile →
                  </Link>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Security Notice</h3>
              </div>
              
              <p className="text-sm text-yellow-800">
                Your login email is used for authentication and cannot be changed through this interface. 
                Contact support if you need to change your login email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardRouteGuard>
  );
} 