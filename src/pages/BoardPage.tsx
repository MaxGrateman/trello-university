import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getBoardById,
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  updateTask,
  deleteTask,
  moveTask,
  addTask,
} from '../api/mockApi';
import Column from "../components/Column";
import TaskCard from "../components/TaskCard";

function BoardPage() {
    const { boardId } = useParams();
    const numericId = Number(boardId);
    const [board, setBoard] = useState<any>(null);
    const [newColTitle, setNewColTitle] = useState('');
    const [editingCol, setEditingCol] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [newTask, setNewTask] = useState<{ [key: number]: string }>({});

    useEffect(() => {
      loadBoard();
    }, [boardId]);
  
    const loadBoard = async () => {
      const b = await getBoardById(numericId);
      setBoard(b);
    };
  
    const handleAddColumn = async () => {
      if (!newColTitle.trim()) return;
      await addColumn(numericId, newColTitle);
      setNewColTitle('');
      loadBoard();
    };
  
    const handleEditColumn = async (colId: number) => {
      await updateColumn(numericId, colId, editTitle);
      setEditingCol(null);
      loadBoard();
    };
  
    const handleDeleteColumn = async (colId: number) => {
      if (confirm('Удалить колонку и все задачи?')) {
        await deleteColumn(numericId, colId);
        loadBoard();
      }
    };
  
    const moveColumn = (fromIdx: number, toIdx: number) => {
      if (!board) return;
      const reordered = [...board.columns];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);
      reorderColumns(numericId, reordered);
      setBoard({ ...board, columns: reordered });
    };
  
    if (!board) return <div className="p-6">Загрузка...</div>;
  
    return (
      <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{board.name}</h2>

      <div className="flex gap-4 overflow-x-auto">
        {board.columns.map((col: any, index: number) => (
          <Column
          key={col.id}
          column={col}
          index={index}
          moveColumn={moveColumn}
        >
          {editingCol === col.id ? (
            <>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="border p-1 w-full"
              />
              <button
                onClick={() => handleEditColumn(col.id)}
                className="text-green-600 hover:underline"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditingCol(null)}
                className="text-gray-600 hover:underline"
              >
                Отмена
              </button>
            </>
          ) : (
            <div className="flex justify-between items-center flex-col">
              <h3 className="font-bold">{col.title}</h3>
              <div className="flex gap-1 text-sm">
                <button
                  onClick={() => {
                    setEditingCol(col.id);
                    setEditTitle(col.title);
                  }}
                  className="text-yellow-600"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteColumn(col.id)}
                  className="text-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          )}
        
          {col.tasks.map((task: any) => (
            <TaskCard
              key={task.id}
              task={task}
              boardId={numericId}
              columnId={col.id}
              onEdit={(taskId: number, title: string, desc: string) =>
                updateTask(numericId, col.id, taskId, {
                  title,
                  description: desc,
                }).then(loadBoard)
              }
              onDelete={(taskId: number) =>
                deleteTask(numericId, col.id, taskId).then(loadBoard)
              }
              onToggleDone={(taskId: number, done: boolean) =>
                updateTask(numericId, col.id, taskId, { done }).then(loadBoard)
              }
              onDropTask={(task: any, fromColId: number, toColId: number) =>
                moveTask(numericId, fromColId, toColId, task).then(loadBoard)
              }
            />
          ))}
        
          <input
            value={newTask[col.id] || ''}
            onChange={e =>
              setNewTask({ ...newTask, [col.id]: e.target.value })
            }
            placeholder="Новая задача"
            className="border p-1 w-full mt-2 text-sm"
          />
          <button
            onClick={() => {
              if (!newTask[col.id]) return;
              addTask(numericId, col.id, {
                title: newTask[col.id],
              }).then(() => loadBoard());
              setNewTask({ ...newTask, [col.id]: '' });
            }}
            className="bg-green-500 text-white w-full mt-1 py-1 rounded text-sm"
          >
            Добавить
          </button>
        </Column>
        ))}

        <div className="min-w-[250px]">
          <input
            value={newColTitle}
            onChange={e => setNewColTitle(e.target.value)}
            placeholder="Новая колонка"
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleAddColumn}
            className="bg-blue-500 text-white w-full py-2 rounded"
          >
            Добавить колонку
          </button>
        </div>
      </div>
    </div>
    );
  }
  
  export default BoardPage;