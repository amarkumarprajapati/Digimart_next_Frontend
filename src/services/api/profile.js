// Profile & Address API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const profileKeys = {
  detail: ["profile"],
  addresses: ["profile", "addresses"],
};

export const useProfile = (options = {}) =>
  useQuery({
    queryKey: profileKeys.detail,
    queryFn: async () => unwrap(await profileService.getProfile()),
    ...options,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.detail }),
  });
};

export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => profileService.uploadAvatar(formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.detail }),
  });
};

export const useAddresses = (options = {}) =>
  useQuery({
    queryKey: profileKeys.addresses,
    queryFn: async () => unwrap(await profileService.getAddresses()),
    ...options,
  });

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => profileService.addAddress(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.addresses }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => profileService.updateAddress(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.addresses }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => profileService.deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.addresses }),
  });
};

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => profileService.setDefaultAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.addresses }),
  });
};
