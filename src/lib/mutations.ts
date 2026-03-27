import { useMutation } from '@tanstack/react-query';

import { fetchGoals } from './api/fetchGoals';
import { PostGoalRequest } from './api/fetchGoals';

export const usePostGoal = () => {
  return useMutation({
    mutationFn: (data: PostGoalRequest) => fetchGoals.postGoal(data),
  });
};
