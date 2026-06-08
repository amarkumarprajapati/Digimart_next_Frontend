// Analytics API hooks (TanStack Query)
import { useMutation } from "@tanstack/react-query";
import { analyticsService } from "./endpoints";

export const useTrackEvent = () =>
  useMutation({ mutationFn: (eventData) => analyticsService.trackEvent(eventData) });

export const useTrackPageView = () =>
  useMutation({ mutationFn: (pageData) => analyticsService.trackPageView(pageData) });
