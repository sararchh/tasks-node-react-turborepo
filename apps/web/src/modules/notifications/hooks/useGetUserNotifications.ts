import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsService } from "../services/get-user-notifications";
import type { GetUserNotificationsServiceRequest } from "../services/get-user-notifications";

export function useGetUserNotifications(userId: string) {
  const hasToken = !!localStorage.getItem('accessToken');
  
  return useQuery({
    queryKey: ["userNotifications", userId],
    queryFn: () => getUserNotificationsService.execute({ userId }),
    enabled: !!userId && hasToken, // Só executa se há userId e token
    refetchOnWindowFocus: true,
  });
}
