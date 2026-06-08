// Recommendation API hooks (TanStack Query)
import { useQuery } from "@tanstack/react-query";
import { recommendationService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const recommendationKeys = {
  list: ["recommendations"],
};

export const useRecommendations = (options = {}) =>
  useQuery({
    queryKey: recommendationKeys.list,
    queryFn: async () => unwrap(await recommendationService.getRecommendations()),
    ...options,
  });
