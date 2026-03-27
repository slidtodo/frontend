import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postGoal, PostGoalRequest } from './api/fetchGoals';
import {
  patchCurrentUser,
  patchCurrentUserPassword,
  PatchCurrentUserRequest,
  PatchCurrentUserPasswordRequest,
} from './api/fetchUsers';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => postGoal(data),
  });
};

export const usePatchCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatchCurrentUserRequest) => patchCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};

export const usePatchCurrentUserPassword = () => {
  return useMutation({
    mutationFn: (data: PatchCurrentUserPasswordRequest) => patchCurrentUserPassword(data),
  });
};
