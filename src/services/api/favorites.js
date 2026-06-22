import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const favoritesKeys = {
  list: ["favorites"],
};

export const extractFavoriteItems = (data) => {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

export const useFavorites = (options = {}) =>
  useQuery({
    queryKey: favoritesKeys.list,
    queryFn: async () =>
      extractFavoriteItems(unwrap(await favoritesService.getFavorites())),
    ...options,
  });

export const useAddToFavorites = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => favoritesService.addToFavorites(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: favoritesKeys.list }),
  });
};

export const useDeleteFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => favoritesService.deleteFavorite(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: favoritesKeys.list }),
  });
};

/** @deprecated Use useDeleteFavorite */
export const useRemoveFromFavorites = useDeleteFavorite;
