/**
 * @example
 * <button onClick={openTodoEditModal}>모달 버튼</button>
 */
import { useModalStore } from '@/shared/stores/useModalStore';
import TodoEditModal from '../components/manual/TodoEditModal';
import { TodoEditForm } from '@/shared/types/types';

export function useTodoEditModal() {
  const { openModal } = useModalStore();

  const openTodoEditModal = (todo: TodoEditForm) => {
    openModal(<TodoEditModal todo={todo} />, undefined, 'bottom');
  };

  return { openTodoEditModal };
}
