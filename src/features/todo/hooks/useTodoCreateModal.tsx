/**
 * @example
 * <button onClick={openTodoCreateModal}>모달 버튼</button>
 */
import TodoFormModal from '../components/manual/TodoFormModal';

import { useModalStore } from '@/shared/stores/useModalStore';

interface UseTodoCreateModalProps {
  goalId: number;
}
export function useTodoCreateModal({ goalId }: UseTodoCreateModalProps) {
  const { openModal } = useModalStore();

  const openTodoCreateModal = () => {
    openModal(<TodoFormModal mode="create" goalId={goalId} />, undefined, 'bottom');
  };

  return { openTodoCreateModal };
}
