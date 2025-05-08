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
    <div className="p-6 h-screen dark:bg-gray-800 w-full flex flex-row gap-4">
      <div className="flex flex-col w-[10%]">
        <h2 className="text-2xl font-semibold mb-4 text-white">{board.name}</h2>
        <div className="flex flex-col justify-items-start h-[90%] border-r border-neutral-100/50 pr-4 box-content">
            <div className="relative z-0 w-full mb-5 group">
              <input 
                  value={newColTitle}
                  onChange={e => setNewColTitle(e.target.value)} 
                  className={`block py-2.5 px-0 w-full text-sm text-gray-800 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer`} 
                  placeholder=" " 
                  autoComplete="off"
              />
              <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Новая колонка</label>
            </div>
            <button
              onClick={handleAddColumn}
              className="text-white bg-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
              Добавить колонку
            </button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto flex-row">
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
                className="text-white hover:text-white/50"
              >
                Сохранить
              </button>
              <button
                onClick={() => setEditingCol(null)}
                className="text-violet-500 hover:text-violet-400 font-medium"
              >
                Отмена
              </button>
            </>
          ) : (
            <div className="">
              <h3 className="font-bold text-white uppercase">{col.title}</h3>
              <div className="flex gap-1 text-sm">
                <button
                  onClick={() => {
                    setEditingCol(col.id);
                    setEditTitle(col.title);
                  }}
                  className="text-white hover:text-white/50"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteColumn(col.id)}
                  className="text-violet-500 hover:text-violet-400 font-medium"
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
        
          <div className="relative z-0 w-full mt-2 group">
              <input 
                  value={newTask[col.id] || ''}
                  onChange={e =>
                    setNewTask({ ...newTask, [col.id]: e.target.value })
                  } 
                  className={`block py-2.5 px-0 w-full text-sm text-gray-800 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer`} 
                  placeholder=" " 
                  autoComplete="off"
              />
              <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-violet-600 peer-focus:dark:text-violet-500A peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Новая задача</label>
            </div>
            <button
              onClick={() => {
                if (!newTask[col.id]) return;
                addTask(numericId, col.id, {
                  title: newTask[col.id],
                }).then(() => loadBoard());
                setNewTask({ ...newTask, [col.id]: '' });
              }}
              className="text-white bg-violet-500 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full mt-3 px-2 py-2 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
            >
              Добавить
            </button>
          
        </Column>
        ))}
      </div>
    </div>
  );
  }
  
  export default BoardPage;