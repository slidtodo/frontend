import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGoals } from './api/fetchGoals';
import { PostGoalRequest } from './api/fetchGoals';
import { fetchUsers, PatchCurrentUserRequest, PatchCurrentUserPasswordRequest } from './api/fetchUsers';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => fetchGoals.postGoal(data),
  });
};

export const usePatchCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatchCurrentUserRequest) => fetchUsers.patchCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};

export const usePatchCurrentUserPassword = () => {
  return useMutation({
    mutationFn: (data: PatchCurrentUserPasswordRequest) => fetchUsers.patchCurrentUserPassword(data),
  });
};
