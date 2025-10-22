import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  User,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import authService from "../services/authService";
import api from "../services/api";

export function ProfileSettings() {
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    role: "",
    id: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Get current user from auth service
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserProfile(currentUser);
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
      });
    }
    fetchProfile();
  }, []);

  // Fetch user profile from API
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await api.get('/profile');
      setUserProfile(profile);
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({
        type: "error",
        text: "Failed to load profile information"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setMessage({
        type: "error",
        text: "Username is required"
      });
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address"
      });
      return;
    }

    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put('/profile', formData);
      
      // Update local user data
      const updatedUser = { ...userProfile, ...response.user };
      setUserProfile(updatedUser);
      
      // Update localStorage to maintain session
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUserData = { ...currentUser, ...response.user };
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      }
      
      setMessage({
        type: "success",
        text: "Profile updated successfully!"
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Role display configuration
  const getRoleConfig = (role) => {
    const configs = {
      liturgy: { name: "Liturgy Maker", color: "bg-blue-500", textColor: "text-blue-700" },
      pastor: { name: "Pastor", color: "bg-purple-500", textColor: "text-purple-700" },
      translation: { name: "Translator", color: "bg-green-500", textColor: "text-green-700" },
      beamer: { name: "Beamer Team", color: "bg-orange-500", textColor: "text-orange-700" },
      music: { name: "Musicians", color: "bg-pink-500", textColor: "text-pink-700" },
      treasurer: { name: "Treasurer", color: "bg-emerald-500", textColor: "text-emerald-700" },
      admin: { name: "Administrator", color: "bg-indigo-500", textColor: "text-indigo-700" },
    };
    return configs[role] || { name: role, color: "bg-gray-500", textColor: "text-gray-700" };
  };

  const roleConfig = getRoleConfig(userProfile.role);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-full ${roleConfig.color} flex items-center justify-center`}>
            <Settings className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and email notifications</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your username and email address for notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Display current role */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Current Role
              </label>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${roleConfig.color} flex items-center justify-center`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className={`font-medium ${roleConfig.textColor}`}>
                  {roleConfig.name}
                </span>
              </div>
            </div>

            {/* Username field */}
            <div>
              <label 
                htmlFor="username" 
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Enter your email for notifications"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This email will be used for future notifications and system updates
              </p>
            </div>

            {/* Message display */}
            {message.text && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {/* Save button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">About Notifications</p>
              <p>
                Setting your email address will enable you to receive important notifications about 
                assignments, workflow updates, and system announcements. You can change or remove 
                your email at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}