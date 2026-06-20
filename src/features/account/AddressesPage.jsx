'use client';

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star, X } from "lucide-react";
import { profileService } from "@/services/api/endpoints";
import { showToast } from "@/lib/toast";
import AccountLayout from "./AccountLayout";

const EMPTY_FORM = {
  type: "home",
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const MOCK = [
  {
    _id: "1",
    type: "home",
    name: "John Doe",
    phone: "+1 234 567 890",
    addressLine1: "123 Main Street",
    addressLine2: "Apartment 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    isDefault: true,
  },
  {
    _id: "2",
    type: "work",
    name: "John Doe",
    phone: "+1 234 567 890",
    addressLine1: "500 Tech Park",
    addressLine2: "Floor 5",
    city: "San Francisco",
    state: "CA",
    pincode: "94107",
    isDefault: false,
  },
];

const typeIcon = (type) =>
  type === "home" ? Home : type === "work" ? Briefcase : MapPin;

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await profileService.getAddresses();
      if (response.data.success) setAddresses(response.data.data || []);
    } catch {
      setAddresses(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (address) => {
    setEditing(address);
    setFormData(address);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await profileService.updateAddress(editing._id, formData);
        showToast.success("Address updated");
      } else {
        await profileService.addAddress(formData);
        showToast.success("Address added");
      }
      setShowModal(false);
      fetchAddresses();
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await profileService.deleteAddress(id);
      showToast.success("Address deleted");
      fetchAddresses();
    } catch {
      showToast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await profileService.setDefaultAddress(id);
      showToast.success("Default address updated");
      fetchAddresses();
    } catch {
      showToast.error("Failed to update default");
    }
  };

  const setField = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const actions = (
    <button onClick={openAdd} className="btn-primary h-10 px-4 text-sm">
      <Plus className="h-4 w-4" />
      Add address
    </button>
  );

  return (
    <AccountLayout
      title="Addresses"
      description="Manage your delivery addresses."
      actions={actions}
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl border border-line bg-surface-2" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
            <MapPin className="h-6 w-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-ink">No addresses saved</h3>
          <p className="mt-1 text-sm text-muted">Add an address for faster checkout.</p>
          <button onClick={openAdd} className="btn-primary mt-6 h-10 px-5 text-sm">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {addresses.map((address) => {
            const Icon = typeIcon(address.type);
            return (
              <div
                key={address._id}
                className={`rounded-xl border p-5 ${address.isDefault ? "border-brand ring-1 ring-brand" : "border-line"}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold capitalize text-ink">
                      {address.type}
                    </span>
                  </div>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
                      <Star className="h-3 w-3 fill-current" />
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-sm text-muted">
                  <p className="font-medium text-ink">{address.name}</p>
                  <p>{address.phone}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-sm font-medium text-brand hover:text-brand-hover"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(address)}
                    className="ml-auto rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-premium">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">
                {editing ? "Edit address" : "Add new address"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-surface-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                {["home", "work", "other"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormData((p) => ({ ...p, type: t }))}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                      formData.type === t
                        ? "bg-brand text-white"
                        : "border border-line text-body hover:bg-surface-2"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Full name" value={formData.name} onChange={setField("name")} className="field h-11 px-4 text-sm" />
                <input placeholder="Phone number" value={formData.phone} onChange={setField("phone")} className="field h-11 px-4 text-sm" />
              </div>
              <input placeholder="Address line 1" value={formData.addressLine1} onChange={setField("addressLine1")} className="field h-11 px-4 text-sm" />
              <input placeholder="Address line 2 (optional)" value={formData.addressLine2} onChange={setField("addressLine2")} className="field h-11 px-4 text-sm" />
              <div className="grid grid-cols-3 gap-4">
                <input placeholder="City" value={formData.city} onChange={setField("city")} className="field h-11 px-4 text-sm" />
                <input placeholder="State" value={formData.state} onChange={setField("state")} className="field h-11 px-4 text-sm" />
                <input placeholder="Postal code" value={formData.pincode} onChange={setField("pincode")} className="field h-11 px-4 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-body">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData((p) => ({ ...p, isDefault: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="btn-primary h-11 flex-1 text-sm">
                Save address
              </button>
              <button onClick={() => setShowModal(false)} className="btn-outline h-11 px-5 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AddressesPage;
