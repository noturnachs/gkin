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
  ArrowLeft,
  Calendar,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import api from "../services/api";

export function ProfileSettings() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    role: "",
    id: null,
    created_at: null,
    last_active: null,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <span className="text-lg font-medium text-gray-700">Loading your profile...</span>
                <span className="text-sm text-gray-500 mt-2">Please wait while we fetch your information</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:bg-gray-50 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center flex-1 mx-8">
            <div className="flex items-center justify-center mb-2">
              <div className={`w-16 h-16 rounded-2xl ${roleConfig.color} flex items-center justify-center shadow-lg`}>
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Overview Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-gray-600" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Role Badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className={`w-10 h-10 rounded-xl ${roleConfig.color} flex items-center justify-center shadow-sm`}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className={`font-semibold ${roleConfig.textColor}`}>
                      {roleConfig.name}
                    </p>
                  </div>
                </div>
                
                {/* Member Since */}
                {userProfile.created_at && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Last Active */}
                {userProfile.last_active && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Active</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(userProfile.last_active).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="shadow-lg border-0 bg-blue-50/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-900 mb-2">About Email Notifications</p>
                    <p className="leading-relaxed">
                      Your email address will be used for important notifications about assignments, 
                      workflow updates, and system announcements. All notifications are optional and 
                      can be managed at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-gray-600" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-base">
                  Update your username and email address for notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-8">
                  
                  {/* Username field */}
                  <div>
                    <label 
                      htmlFor="username" 
                      className="text-sm font-semibold text-gray-700 mb-3 block"
                    >
                      Username *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="text-sm font-semibold text-gray-700 mb-3 block"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200"
                        placeholder="Enter your email for notifications"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      This email will be used for future notifications and system updates
                    </p>
                  </div>

                  {/* Message display */}
                  {message.text && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {message.type === 'success' ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                      )}
                      <span className="font-medium">{message.text}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          username: userProfile.username || "",
                          email: userProfile.email || "",
                        });
                        setMessage({ type: "", text: "" });
                      }}
                      className="px-8 h-14 rounded-xl border-gray-300 hover:bg-gray-50 font-medium"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}