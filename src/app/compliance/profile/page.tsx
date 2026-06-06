"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Bell,
  Monitor,
  Save,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Smartphone,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/compliance-officer/DashboardLayout";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mock user data
  const [profileData, setProfileData] = useState({
    firstName: "Jane",
    lastName: "Mensah",
    email: "jane.mensah@namibrapay.com",
    phone: "+233244123456",
    role: "Compliance Officer",
    department: "Compliance & Risk",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    applicationUpdates: true,
    caseAssignments: true,
    reportReady: true,
    systemMaintenance: false,
  });

  const [activeSessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Accra, Ghana",
      ipAddress: "192.168.1.45",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Accra, Ghana",
      ipAddress: "192.168.1.78",
      lastActive: "2 hours ago",
      current: false,
    },
  ]);

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    showSuccess("Profile updated successfully");
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsSaving(false);
    showSuccess("Password changed successfully");
  };

  // Handle MFA toggle
  const handleMFAToggle = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMfaEnabled(!mfaEnabled);
    setIsSaving(false);
    showSuccess(mfaEnabled ? "MFA disabled" : "MFA enabled successfully");
  };

  // Handle notification save
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    showSuccess("Notification preferences saved");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "sessions", label: "Active Sessions", icon: Monitor },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{successMessage}</span>
              <button onClick={() => setShowSuccessToast(false)} className="ml-2 hover:bg-green-700 rounded p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-navy">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your profile, security and preferences</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-brand-teal text-brand-teal font-medium"
                      : "border-transparent text-gray-600 hover:text-brand-navy"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-[0_30px_70px_-50px_rgba(15,23,42,0.45)] border border-gray-200/70 p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input type="text" value={profileData.role} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input type="text" value={profileData.department} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-sm font-medium text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Change Password */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button onClick={handleChangePassword} disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword} className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-sm text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Changing...</> : <><Key className="w-4 h-4" />Change Password</>}
                  </button>
                </div>
              </div>

              {/* MFA Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400 mb-4">Multi-Factor Authentication</h3>
                <div className="flex items-start justify-between max-w-2xl">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-brand-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Authenticator App</p>
                      <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                      <p className="text-xs text-gray-500 mt-2">Status: <span className={mfaEnabled ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{mfaEnabled ? "Enabled" : "Disabled"}</span></p>
                    </div>
                  </div>
                  <button onClick={handleMFAToggle} disabled={isSaving} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${mfaEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-brand-teal text-white hover:bg-brand-teal/90"}`}>
                    {mfaEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</p>
                      <p className="text-sm text-gray-500">Receive notifications for this event</p>
                    </div>
                    <button onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })} className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-brand-teal" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? "translate-x-6" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={handleSaveNotifications} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-sm text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Preferences</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Active Sessions</h3>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Monitor className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{session.device}</p>
                          {session.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{session.location}</p>
                        <p className="text-xs text-gray-500 mt-1">IP: {session.ipAddress} • Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">Sign Out</button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
