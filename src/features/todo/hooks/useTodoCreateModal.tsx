/**
 * @example
 * <button onClick={openTodoCreateModal}>모달 버튼</button>
 */
import { useModalStore } from '@/shared/stores/useModalStore';
import TodoFormModal from '../components/manual/TodoFormModal';

export function useTodoCreateModal() {
  const { openModal } = useModalStore();

  const openTodoCreateModal = () => {
    openModal(<TodoFormModal mode="create"/>, undefined, 'bottom');
  };

  return { openTodoCreateModal };
}
