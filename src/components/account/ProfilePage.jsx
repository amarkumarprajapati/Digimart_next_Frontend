'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera } from "lucide-react";
import { profileService } from "@/services/api/endpoints";
import { showToast } from "@/lib/toast";
import AccountLayout from "./AccountLayout";

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", group: "personal" },
  { name: "email", label: "Email address", type: "email", group: "personal" },
  { name: "phone", label: "Phone number", type: "tel", group: "personal" },
  { name: "address", label: "Address", type: "text", group: "shipping" },
  { name: "city", label: "City", type: "text", group: "shipping" },
  { name: "state", label: "State / Province", type: "text", group: "shipping" },
  { name: "pincode", label: "Postal code", type: "text", group: "shipping" },
  { name: "country", label: "Country", type: "text", group: "shipping" },
];

const ProfilePage = () => {
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
        country: user.country || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(formData);
      if (response.data.success) {
        showToast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => (
    <div key={field.name}>
      <label className="mb-1.5 block text-sm font-medium text-ink">{field.label}</label>
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        disabled={!isEditing}
        className="field h-11 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );

  const actions = !isEditing ? (
    <button onClick={() => setIsEditing(true)} className="btn-outline h-10 px-5 text-sm">
      Edit profile
    </button>
  ) : (
    <>
      <button onClick={handleSave} disabled={loading} className="btn-primary h-10 px-5 text-sm">
        {loading ? "Saving..." : "Save changes"}
      </button>
      <button onClick={() => setIsEditing(false)} className="btn-outline h-10 px-5 text-sm">
        Cancel
      </button>
    </>
  );

  return (
    <AccountLayout
      title="My Profile"
      description="Manage your personal information."
      actions={actions}
    >
      {/* Identity row */}
      <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-2/50 p-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-soft">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-brand">
                {(formData.fullName || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-brand text-white">
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-ink">
            {formData.fullName || "Your profile"}
          </h2>
          <p className="truncate text-sm text-muted">{formData.email}</p>
        </div>
      </div>

      {/* Personal */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink">Personal details</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.filter((f) => f.group === "personal").map(renderField)}
        </div>
      </div>

      {/* Shipping */}
      <div className="mt-8 border-t border-line pt-6">
        <h3 className="text-sm font-semibold text-ink">Shipping information</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.filter((f) => f.group === "shipping").map(renderField)}
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
