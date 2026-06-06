// Support ticket API hooks (TanStack Query)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "./endpoints";

const unwrap = (res) => res?.data?.data ?? res?.data;

export const supportKeys = {
  all: ["support"],
  tickets: ["support", "tickets"],
  ticket: (id) => ["support", "ticket", id],
};

export const useMyTickets = (options = {}) =>
  useQuery({
    queryKey: supportKeys.tickets,
    queryFn: async () => unwrap(await supportService.getMyTickets()),
    ...options,
  });

export const useTicket = (id, options = {}) =>
  useQuery({
    queryKey: supportKeys.ticket(id),
    queryFn: async () => unwrap(await supportService.getTicketDetails(id)),
    enabled: !!id,
    ...options,
  });

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => supportService.createTicket(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: supportKeys.tickets }),
  });
};

export const useReplyToTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }) => supportService.replyToTicket(id, message),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: supportKeys.ticket(vars.id) }),
  });
};
