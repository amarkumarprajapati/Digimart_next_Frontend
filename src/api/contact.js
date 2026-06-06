// Contact API hooks (TanStack Query)
import { useMutation } from "@tanstack/react-query";
import { contactService } from "./endpoints";

export const useSubmitContactMessage = () =>
  useMutation({ mutationFn: (data) => contactService.submitContactMessage(data) });
