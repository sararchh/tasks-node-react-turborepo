import { useQuery } from '@tanstack/react-query';
import { getUsersService } from '../services/get-users';

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersService.execute(),
  });
}
