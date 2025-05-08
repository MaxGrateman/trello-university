import { useDrag, useDrop } from 'react-dnd';
import { useRef, useState } from 'react';

const ItemType = 'TASK';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleDone,
  onDropTask,
  columnId,
  boardId,
}: any) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task, columnId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: any) => {
      if (item.columnId !== columnId) {
        onDropTask(item.task, item.columnId, columnId);
      }
    },
  });

  drag(drop(ref));

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || '');

  return (
    <div
      ref={ref}
      className={`border p-2 rounded bg-gray-50 space-y-1 bg-transparent ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      {editing ? (
        <>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className=" text-white uppercase"
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className=" text-white uppercase"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onEdit(task.id, title, desc);
                setEditing(false);
              }}
              className="text-white hover:underline mr-2 font-medium"
            >
              Сохранить
            </button>
            <button onClick={() => setEditing(false)} className="text-white hover:underline mr-2 font-medium">
              Отмена
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h4
              className={`font-semibold text-white uppercase ${
                task.done ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </h4>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggleDone(task.id, !task.done)}
            />
          </div>
          {task.description && (
            <p className="text-white uppercase">{task.description}</p>
          )}
          <div className="text-sm flex gap-2">
            <button onClick={() => setEditing(true)} className="text-white hover:underline mr-2 font-medium">
              Редактировать
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-white hover:underline mr-2 font-medium"
            >
              Удалить
            </button>
          </div>
        </>
      )}
    </div>
  );
}
