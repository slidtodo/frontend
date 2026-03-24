import { fetchJSON } from "./utils";

export const fetchGoals = () => fetchJSON('/api/v1/goals');

export const fetchGoal = (goalId: number) => fetchJSON(`/api/v1/goals/${goalId}`);
