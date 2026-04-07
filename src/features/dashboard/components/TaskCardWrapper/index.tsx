import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';

import TaskCard from '@/shared/components/TaskCard';

import { GoalDetailResponse } from '@/shared/lib/api';
import { usePatchTodo, usePatchTodoFavorite } from '@/shared/lib/mutations';
import { todoQueries } from '@/shared/lib/queryKeys';
import { useToastStore } from '@/shared/stores/useToastStore';

export default function TaskCardWrapper({
  item,
  mode,
}: {
  item: GoalDetailResponse['todoList'][number];
  mode: 'todo' | 'done';
}) {
  const { showToast } = useToastStore();

  // 할 일 상세 정보를 가져오기 위한 query 훅
  const { data: todoDetail } = useQuery({
    ...todoQueries.detail(item.id),
    enabled: !!item.id,
  });

  // 할 일 상태 업데이트를 위한 mutation 훅
  const patchTodo = usePatchTodo(item.id);
  const handleCheckboxClick = async () => {
    if (todoDetail?.id === undefined) return;

    try {
      await patchTodo.mutateAsync({
        done: !todoDetail.done,
      });

      showToast(`할 일을${!todoDetail.done ? ' 완료했습니다.' : ' 미완료 처리했습니다.'}`);
    } catch (error) {
      console.error('할 일 상태 업데이트 실패:', error);
    }
  };

  // 할 일 즐겨찾기 토글을 위한 mutation 훅
  const [starred, setStarred] = useState(item?.favorite ?? false);
  const { mutate: patchTodoFavorite } = usePatchTodoFavorite(item?.id);

  const handleStarToggle = () => {
    const nextStarred = !starred;
    setStarred(nextStarred);

    patchTodoFavorite(undefined, {
      onSuccess: () => {
        showToast(`즐겨찾기에 ${nextStarred ? '추가되었습니다.' : '해제되었습니다.'}`);
      },
      onError: (error) => {
        console.error(error);
        setStarred(!nextStarred);
      },
    });
  };

  if (!todoDetail) return null;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <TaskCard
        variant={mode === 'todo' ? 'green' : 'default'}
        todo={todoDetail}
        onCheckboxClick={handleCheckboxClick}
        onStareClick={handleStarToggle}
      />
    </motion.div>
  );
}
