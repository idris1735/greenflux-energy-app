"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupWithEmailAndRole } from "@/lib/firebaseAuthHelpers";
import { useUser } from "@/lib/UserContext";
import { Eye, EyeOff, User, Building, Wrench, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, userType } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'installer'>('buyer');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    business_name: "",
    location: "",
    description: "",
    services_offered: ['Residential'],
    experience_years: 1,
    bio: "",
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: 'buyer' | 'seller' | 'installer') => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        user_type: selectedRole,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        business_name: formData.business_name,
        location: formData.location,
        description: formData.description,
        services_offered: formData.services_offered,
        experience_years: formData.experience_years,
        bio: formData.bio,
      };

      await signupWithEmailAndRole({
        email: formData.email,
        password: formData.password,
        userData,
      });

      // Redirect to appropriate dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join GreenFlux Energy NG and start your solar journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`w-5 h-5 ${selectedRole === 'buyer' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Buyer</div>
                    <div className="text-sm text-gray-500">Browse and purchase solar products</div>
                  </div>
                  {selectedRole === 'buyer' && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('seller')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    selectedRole === 'seller'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className={`w-5 h-5 ${selectedRole === 'seller' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Seller</div>
                    <div className="text-sm text-gray-500">Sell solar products and equipment</div>
                  </div>
                  {selectedRole === 'seller' && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('installer')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    selectedRole === 'installer'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wrench className={`w-5 h-5 ${selectedRole === 'installer' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Installer</div>
                    <div className="text-sm text-gray-500">Provide solar installation services</div>
                  </div>
                  {selectedRole === 'installer' && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
        </div>

            {/* Business Information (for sellers/installers) */}
            {(selectedRole === 'seller' || selectedRole === 'installer') && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
        </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location (City/State)
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Lagos, Abuja"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
        </div>

                {selectedRole === 'installer' && (
                  <div>
                    <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <select
                      id="experience_years"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={1}>1 year</option>
                      <option value={2}>2 years</option>
                      <option value={3}>3 years</option>
                      <option value={4}>4 years</option>
                      <option value={5}>5+ years</option>
          </select>
        </div>
                )}
              </div>
            )}

            {/* Contact Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="e.g., 2348030000000"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
        </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 