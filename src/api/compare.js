// Compare API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { compareService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const compareKeys = {
  list: ["compare"],
};

export const useCompareList = (options = {}) =>
  useQuery({
    queryKey: compareKeys.list,
    queryFn: async () => unwrap(await compareService.getCompareList()),
    ...options,
  });

export const useAddToCompare = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => compareService.addToCompare(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: compareKeys.list }),
  });
};

export const useRemoveFromCompare = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId) => compareService.removeFromCompare(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: compareKeys.list }),
  });
};
