/**
 * @example
 * <button onClick={openTodoCreateModal}>모달 버튼</button>
 */
import { useModalStore } from '@/shared/stores/useModalStore';
import TodoCreateModal from '@/features/todo/components/manual/TodoCreateModal';

export function useTodoCreateModal() {
  const { openModal } = useModalStore();

  const openTodoCreateModal = () => {
    openModal(<TodoCreateModal />, undefined, 'bottom');
  };

  return { openTodoCreateModal };
}
