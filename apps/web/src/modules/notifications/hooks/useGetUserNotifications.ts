import { useQuery } from "@tanstack/react-query";
import { getUserNotificationsService } from "../services/get-user-notifications";
import type { GetUserNotificationsServiceRequest } from "../services/get-user-notifications";

export function useGetUserNotifications(userId: string) {
  return useQuery({
    queryKey: ["userNotifications", userId],
    queryFn: () => getUserNotificationsService.execute({ userId }),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
}
