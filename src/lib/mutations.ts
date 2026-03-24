import { useMutation } from '@tanstack/react-query';

import { postGoal } from './api/fetchGoals';
import { PostGoalRequest } from './api/fetchGoals';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => postGoal(data),
  });
};
