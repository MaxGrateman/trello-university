import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBoards, createBoard, updateBoard, deleteBoard } from '../api/mockApi'

function BoardList() {
    const [boards, setBoards] = useState<any[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
  
    useEffect(() => {
        loadBoards();
      }, []);
    
      const loadBoards = async () => {
        const boards = await getBoards();
        setBoards(boards);
      };
    
      const handleCreate = async () => {
        if (!newTitle.trim()) return;
        await createBoard(newTitle);
        setNewTitle('');
        loadBoards();
      };
    
      const startEdit = (id: number, currentName: string) => {
        setEditingId(id);
        setEditTitle(currentName);
      };
    
      const submitEdit = async (id: number) => {
        await updateBoard(id, editTitle);
        setEditingId(null);
        loadBoards();
      };
    
      const handleDelete = async (id: number) => {
        if (confirm('Удалить доску?')) {
          await deleteBoard(id);
          loadBoards();
        }
      };
  
    return (
        <div className="p-6 h-screen dark:bg-gray-800 w-full">
        <h1 className="text-2xl text-white font-bold mb-4">Доски</h1>
  
        <div className="mb-6 border-b border-neutral-100 pb-4">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="py-1.5 px-8 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
                        dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer
                        placeholder:text-gray-600 placeholder:medium placeholder:tracking-wider placeholder:font-medium"
            placeholder="Название доски"
          />
          <button
            onClick={handleCreate}
            className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-violet-500 rounded-lg 
            hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-violet-500 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
          >
            Создать
          </button>
        </div>
  
        <ul className="space-y-4">
          {boards.map(board => (
            <li key={board.id} className="flex justify-between p-4 border border-neutral-100 shadow-sm shadow-neutral-100/50 rounded-md box-border cursor-pointer">
              {editingId === board.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="p-1 bg-transparent text-white border border-neutral-100 shadow-sm shadow-neutral-100/50 rounded-md box-border"
                  />
                  <div className="flex-1"></div>
                  <button
                    onClick={() => submitEdit(board.id)}
                    className="text-white hover:underline mr-2 font-medium"
                  >
                    СОХРАНИТЬ
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-violet-500 hover:underline font-medium"
                  >
                    ОТМЕНА
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/board/${board.id}`}
                    className="text-white hover:underline flex-1 uppercase"
                  >
                    {board.name}
                  </Link>
                  <button
                    onClick={() => startEdit(board.id, board.name)}
                    className="text-white hover:underline mr-2 font-medium"
                  >
                    РЕДАКТИРОВАТЬ
                  </button>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="text-violet-500 hover:underline font-medium"
                  >
                    УДАЛИТЬ
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default BoardList;