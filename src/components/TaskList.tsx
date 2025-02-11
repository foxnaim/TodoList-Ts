import React from 'react';

type Task = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
};

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  filter: 'all' | 'completed' | 'pending';
  sortBy: 'priority' | 'deadline';
  onDeleteTask: (id: number) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, filter, sortBy, onDeleteTask }) => {
  const today = new Date();

  // Фильтрация
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Сортировка
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder: Record<'low' | 'medium' | 'high', number> = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <ul>
      {sortedTasks.map((task) => {
        const isOverdue = new Date(task.deadline) < today && !task.completed;

        return (
          <li key={task.id} style={{ color: isOverdue ? 'red' : 'black' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Дедлайн: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Приоритет: {task.priority}</p>
            <p>Статус: {task.completed ? '✅ Выполнено' : '⏳ В процессе'}</p>
            {isOverdue && <p style={{ color: 'red' }}>Просрочено!</p>}
            <div className="gap-4">
              <button onClick={() => onToggleComplete(task.id)}>
                {task.completed ? '❌ Отменить' : '✅ Завершить'}
              </button>
              <br />
              <button onClick={() => onDeleteTask(task.id)} style={{ color: 'red' }}>
                ❌ Удалить
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TaskList;
