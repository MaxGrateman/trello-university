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
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Доски</h1>
  
        <div className="mb-6">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="border p-2 mr-2"
            placeholder="Название доски"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Создать
          </button>
        </div>
  
        <ul className="space-y-4">
          {boards.map(board => (
            <li key={board.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm cursor-pointer">
              {editingId === board.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="border p-1"
                  />
                  <button
                    onClick={() => submitEdit(board.id)}
                    className="text-green-600 hover:underline"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:underline"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/board/${board.id}`}
                    className="text-blue-600 hover:underline flex-1"
                  >
                    {board.name}
                  </Link>
                  <button
                    onClick={() => startEdit(board.id, board.name)}
                    className="text-yellow-600 hover:underline mr-2"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="text-red-600 hover:underline"
                  >
                    Удалить
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