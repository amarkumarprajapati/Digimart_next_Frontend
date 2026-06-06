// Newsletter API hooks (TanStack Query)
import { useMutation } from "@tanstack/react-query";
import { newsletterService } from "./endpoints";

export const useSubscribeNewsletter = () =>
  useMutation({ mutationFn: (email) => newsletterService.subscribe(email) });

export const useUnsubscribeNewsletter = () =>
  useMutation({
    mutationFn: ({ email, token }) => newsletterService.unsubscribe(email, token),
  });
