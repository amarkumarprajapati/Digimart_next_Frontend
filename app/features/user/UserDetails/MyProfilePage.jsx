/* eslint-disable */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X, User } from "lucide-react";
import { profileService } from "@/api/endpoints";
import { showToast } from "@/utils/toast";
import ProfileLayout from "./ProfileLayout";

const MyProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        country: user.country || "India",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(formData);
      if (response.data.success) {
        showToast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Profile Identity Header - Ultra Compact */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-[#088395] to-cyan-600 rounded-2xl overflow-hidden relative shadow-lg">
             {/* Decorative Background Pattern */}
             <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
             </div>

             <div className="absolute top-3 right-5 text-white/20">
                <Save className="w-10 h-10 rotate-12" />
             </div>
          </div>

          <div className="px-5 -mt-12 flex flex-col md:flex-row items-end gap-4 relative z-10 pb-2">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl border-[4px] border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 shadow-premium overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/30">
                    <span className="text-3xl font-black text-[#088395]">
                      {formData.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-[#088395] hover:bg-[#066a78] text-white p-2 rounded-xl shadow-xl transition-all hover:scale-110 border-2 border-white dark:border-gray-900">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                {formData.fullName || "User Profile"}
              </h2>
              <p className="text-gray-400 font-black text-[8px] uppercase tracking-[0.2em] mt-0.5 flex items-center justify-center md:justify-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#088395]" />
                Premium Member Since 2026
              </p>
            </div>

            <div className="mb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#088395] hover:bg-[#066a78] text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2.5">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all hover:bg-red-50 hover:text-red-500 flex items-center gap-2"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information Grid - Ultra Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-3">
          <div className="space-y-6">
             <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#088395] border-b border-teal-100 dark:border-teal-900/30 pb-1.5">
                Personal Details
             </h4>
             
             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#088395] transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#088395] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#088395] transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#088395] border-b border-teal-100 dark:border-teal-900/30 pb-1.5">
                Shipping Information
             </h4>

             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Complete Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-5 w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#088395] transition-colors" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">State / Province</label>
                   <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-[#088395] focus:border-transparent disabled:opacity-50"
                    />
                </div>
             </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default MyProfilePage;
