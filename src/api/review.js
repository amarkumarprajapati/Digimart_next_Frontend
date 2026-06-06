// Review API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const reviewKeys = {
  all: ["reviews"],
  forProduct: (productId, page = 1, limit = 10) => [
    "reviews",
    "product",
    productId,
    { page, limit },
  ],
};

export const useProductReviews = (productId, page = 1, limit = 10, options = {}) =>
  useQuery({
    queryKey: reviewKeys.forProduct(productId, page, limit),
    queryFn: async () => unwrap(await reviewService.getProductReviews(productId, page, limit)),
    enabled: !!productId,
    ...options,
  });

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }) => reviewService.createReview(productId, data),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["reviews", "product", vars.productId] }),
  });
};

export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }) => reviewService.updateReview(reviewId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  });
};

export const useMarkReviewHelpful = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => reviewService.markReviewHelpful(reviewId),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  });
};
