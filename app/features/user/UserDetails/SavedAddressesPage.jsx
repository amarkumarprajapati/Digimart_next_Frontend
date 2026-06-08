/* eslint-disable */
import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star } from "lucide-react";
import { profileService } from "@/api/endpoints";
import { showToast } from "@/utils/toast";
import ProfileLayout from "./ProfileLayout";

const SavedAddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: "home",
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await profileService.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Mock data for demo
      setAddresses([
        {
          _id: "1",
          type: "home",
          name: "John Doe",
          phone: "+91 9876543210",
          addressLine1: "123 Main Street",
          addressLine2: "Apartment 4B",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          isDefault: true,
        },
        {
          _id: "2",
          type: "work",
          name: "John Doe",
          phone: "+91 9876543210",
          addressLine1: "456 Business Park",
          addressLine2: "Floor 5",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400002",
          isDefault: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await profileService.updateAddress(editingAddress._id, formData);
        showToast.success("Address updated successfully!");
      } else {
        await profileService.addAddress(formData);
        showToast.success("Address added successfully!");
      }
      setShowAddModal(false);
      fetchAddresses();
    } catch (error) {
      showToast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await profileService.deleteAddress(id);
      showToast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (error) {
      showToast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await profileService.setDefaultAddress(id);
      showToast.success("Default address updated!");
      fetchAddresses();
    } catch (error) {
      showToast.error("Failed to update default address");
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "work":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddAddress}
          className="flex items-center gap-2 px-4 py-2 bg-[#088395] hover:bg-[#09637E] text-white rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

        {/* Addresses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No addresses saved</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your delivery addresses for faster checkout</p>
            <button
              onClick={handleAddAddress}
              className="px-6 py-3 bg-[#088395] hover:bg-[#09637E] text-white rounded-lg transition-colors"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 relative ${
                  address.isDefault ? "ring-2 ring-[#088395]" : ""
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#EBF4F6] dark:bg-[#088395]/20 text-[#088395] dark:text-[#7AB2B2] text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Default
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-[#EBF4F6] dark:bg-[#088395]/20 text-[#088395] dark:text-[#7AB2B2]">
                      {getAddressTypeIcon(address.type)}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {address.type}
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="font-semibold text-gray-900 dark:text-white">{address.name}</p>
                    <p>{address.phone}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="flex-1 px-4 py-2 text-sm text-[#088395] hover:bg-[#EBF4F6] dark:hover:bg-[#088395]/10 rounded-lg transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>

                <div className="space-y-4">
                  {/* Address Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Type
                    </label>
                    <div className="flex gap-3">
                      {["home", "work", "other"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, type })}
                          className={`flex-1 px-4 py-2 rounded-lg capitalize font-medium transition-colors ${
                            formData.type === type
                              ? "bg-[#088395] text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Set as Default */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded text-[#088395] focus:ring-[#088395]"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
                      Set as default address
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 px-6 py-3 bg-[#088395] hover:bg-[#09637E] text-white rounded-lg transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default SavedAddressesPage;
