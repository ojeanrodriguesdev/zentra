'use client';

import { useTaskComments } from '@/lib/hooks';
import { MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';

export default function TaskCommentCount({ taskId }) {
  const { count } = useTaskComments(taskId);

  if (count === 0) return null;

  return (
    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
      <MessageCircle size={14} />
      <span className="text-xs">{count}</span>
    </div>
  );
}

TaskCommentCount.propTypes = {
  taskId: PropTypes.string.isRequired
};
