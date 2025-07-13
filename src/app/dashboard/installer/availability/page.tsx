"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { InstallerRouteGuard } from "@/lib/routeGuard";
import { 
  getInstallerProfile,
  updateInstallerAvailability
} from "@/lib/firebaseHelpers";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Save,
  Settings,
  MapPin,
  Phone
} from "lucide-react";

interface Availability {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  available: boolean;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  max_bookings: number;
  notes?: string;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

const defaultAvailability: Availability = {
  monday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
  tuesday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
  wednesday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
  thursday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
  friday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
  saturday: { available: false, start_time: "09:00", end_time: "15:00", max_bookings: 2 },
  sunday: { available: false, start_time: "10:00", end_time: "14:00", max_bookings: 1 }
};

export default function InstallerAvailabilityPage() {
  const { user } = useUser();
  const [installerProfile, setInstallerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [availability, setAvailability] = useState<Availability>(defaultAvailability);

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
        setInstallerProfile(profileData);
        setIsAvailable(profileData.is_available || true);
        
        if (profileData.availability) {
          // Merge backend data with default to ensure all days are present
          setAvailability({
            ...defaultAvailability,
            ...profileData.availability
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day: string, field: string, value: any) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof Availability],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      await updateInstallerAvailability(user.uid, {
        availability,
        is_available: isAvailable
      });
      
      // Reload profile to get updated data
      await loadProfile();
      
      alert("Availability updated successfully!");
    } catch (error) {
      console.error('Error saving availability:', error);
      alert("Error updating availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const copySchedule = (fromDay: string) => {
    const schedule = availability[fromDay as keyof Availability];
    const newAvailability = { ...availability };
    
    DAYS.forEach(day => {
      if (day.key !== fromDay) {
        newAvailability[day.key as keyof Availability] = { ...schedule };
      }
    });
    
    setAvailability(newAvailability);
  };

  const resetSchedule = () => {
    setAvailability({
      monday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
      tuesday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
      wednesday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
      thursday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
      friday: { available: true, start_time: "08:00", end_time: "17:00", max_bookings: 3 },
      saturday: { available: false, start_time: "09:00", end_time: "15:00", max_bookings: 2 },
      sunday: { available: false, start_time: "10:00", end_time: "14:00", max_bookings: 1 }
    });
  };

  if (loading) {
    return (
      <InstallerRouteGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
        </div>
      </InstallerRouteGuard>
    );
  }

  return (
    <InstallerRouteGuard>
      <div className="pt-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Availability & Schedule</h1>
          <p className="text-gray-600 mt-1">
            Set your working hours and availability for installation requests
          </p>
        </div>

        {/* Overall Availability Toggle */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Availability</h3>
              <p className="text-gray-600 text-sm">
                {isAvailable 
                  ? "You are currently available for new installation requests"
                  : "You are currently unavailable for new installation requests"
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {isAvailable ? "Available" : "Unavailable"}
              </span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
            <div className="flex gap-2">
              <button
                onClick={resetSchedule}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {DAYS.map((day) => {
              // Use fallback to default for safety
              const schedule = availability[day.key as keyof Availability] || defaultAvailability[day.key as keyof Availability];
              
              return (
                <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={(e) => handleDayChange(day.key, 'available', e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <h4 className="font-medium text-gray-900">{day.label}</h4>
                      {schedule.available ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => copySchedule(day.key)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Copy to other days
                    </button>
                  </div>
                  
                  {schedule.available && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <select
                          value={schedule.start_time}
                          onChange={(e) => handleDayChange(day.key, 'start_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {TIME_SLOTS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <select
                          value={schedule.end_time}
                          onChange={(e) => handleDayChange(day.key, 'end_time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {TIME_SLOTS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Bookings
                        </label>
                        <input
                          type="number"
                          value={schedule.max_bookings}
                          onChange={(e) => handleDayChange(day.key, 'max_bookings', parseInt(e.target.value) || 1)}
                          min="1"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Weekday Schedule</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const newAvailability = { ...availability };
                    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                      newAvailability[day as keyof Availability] = {
                        available: true,
                        start_time: "08:00",
                        end_time: "17:00",
                        max_bookings: 3
                      };
                    });
                    setAvailability(newAvailability);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Set 8 AM - 5 PM (Mon-Fri)
                </button>
                
                <button
                  onClick={() => {
                    const newAvailability = { ...availability };
                    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
                      newAvailability[day as keyof Availability] = {
                        available: true,
                        start_time: "09:00",
                        end_time: "18:00",
                        max_bookings: 4
                      };
                    });
                    setAvailability(newAvailability);
                  }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  Set 9 AM - 6 PM (Mon-Fri)
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Weekend Schedule</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const newAvailability = { ...availability };
                    ['saturday', 'sunday'].forEach(day => {
                      newAvailability[day as keyof Availability] = {
                        available: true,
                        start_time: "09:00",
                        end_time: "15:00",
                        max_bookings: 2
                      };
                    });
                    setAvailability(newAvailability);
                  }}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                >
                  Set 9 AM - 3 PM (Sat-Sun)
                </button>
                
                <button
                  onClick={() => {
                    const newAvailability = { ...availability };
                    ['saturday', 'sunday'].forEach(day => {
                      newAvailability[day as keyof Availability] = {
                        available: false,
                        start_time: "10:00",
                        end_time: "14:00",
                        max_bookings: 1
                      };
                    });
                    setAvailability(newAvailability);
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Set Unavailable (Sat-Sun)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Business Phone</p>
                <p className="font-medium text-gray-900">
                  {installerProfile?.business_phone || "Not set"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Service Areas</p>
                <p className="font-medium text-gray-900">
                  {installerProfile?.service_areas?.length > 0 
                    ? installerProfile.service_areas.join(", ")
                    : "Not set"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
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
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </InstallerRouteGuard>
  );
} 