/**
 * @example
 * <button onClick={openTodoCreateModal}>모달 버튼</button>
 */
import TodoFormModal from '../components/manual/TodoFormModal';

import { useModalStore } from '@/shared/stores/useModalStore';

interface UseTodoCreateModalResult {
  goalDetailId?: number;
}
export function useTodoCreateModal() {
  const { openModal } = useModalStore();

  const openTodoCreateModal = ({ goalDetailId }: UseTodoCreateModalResult = {}) => {
    openModal(<TodoFormModal mode="create" goalDetailId={goalDetailId} />, undefined, 'bottom');
  };

  return { openTodoCreateModal };
}
