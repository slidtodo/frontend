import { useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGoals } from './api/fetchGoals';
import { PostGoalRequest } from './api/fetchGoals';
import { fetchUsers, PatchCurrentUserRequest, PatchCurrentUserPasswordRequest } from './api/fetchUsers';
import { useToastStore } from '@/shared/stores/useToastStore';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => fetchGoals.postGoal(data),
  });
};

export const usePatchCurrentUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: (data: PatchCurrentUserRequest) => fetchUsers.patchCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: () => {
      showToast('정보 수정에 실패했습니다.', 'fail');
    },
  });
};

export const usePatchCurrentUserPassword = () => {
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: (data: PatchCurrentUserPasswordRequest) => fetchUsers.patchCurrentUserPassword(data),
    onError: () => {
      showToast('비밀번호 변경에 실패했습니다.', 'fail');
    },
  });
};
