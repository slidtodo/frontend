/**
 * @example
 * <button onClick={openTodoEditModal}>모달 버튼</button>
 */
import { useModalStore } from '@/shared/stores/useModalStore';
import TodoFormModal from '../components/manual/TodoFormModal';
import { TodoEditForm } from '../components/types/types';

export function useTodoEditModal() {
  const { openModal } = useModalStore();

  const openTodoEditModal = (todo: TodoEditForm) => {
    openModal(<TodoFormModal mode="edit" todo={todo} />, undefined, 'bottom');
  };

  return { openTodoEditModal };
}
