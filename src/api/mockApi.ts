const STORAGE_KEY = 'trello_data';

type Board = {
  id: number;
  name: string;
  columns: any[];
};

export const getBoards = async (): Promise<Board[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  return data.boards;
};

export const createBoard = async (name: string): Promise<Board> => {
  const newBoard: Board = {
    id: Date.now(),
    name,
    columns: [],
  };
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  data.boards.push(newBoard);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return newBoard;
};

export const updateBoard = async (id: number, newName: string) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === id);
  if (board) {
    board.name = newName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const deleteBoard = async (id: number) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  data.boards = data.boards.filter((b: any) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};


// API для колоннок
export const getBoardById = async (id: number) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  return data.boards.find((b: any) => b.id === id);
};

export const addColumn = async (boardId: number, title: string) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  if (board) {
    board.columns.push({ id: Date.now(), title, tasks: [] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const updateColumn = async (
  boardId: number,
  columnId: number,
  newTitle: string
) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  const column = board?.columns.find((c: any) => c.id === columnId);
  if (column) {
    column.title = newTitle;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const deleteColumn = async (boardId: number, columnId: number) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  if (board) {
    board.columns = board.columns.filter((c: any) => c.id !== columnId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const reorderColumns = async (boardId: number, newOrder: any[]) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  if (board) {
    board.columns = newOrder;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

// API для тасков

export const addTask = async (boardId: number, columnId: number, task: any) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  const column = board?.columns.find((c: any) => c.id === columnId);
  if (column) {
    if (!Array.isArray(column.tasks)) column.tasks = [];
    column.tasks.push({ ...task, id: Date.now(), done: false });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  if (!Array.isArray(column.tasks)) column.tasks = [];
};

export const updateTask = async (
  boardId: number,
  columnId: number,
  taskId: number,
  updates: Partial<any>
) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  const column = board?.columns.find((c: any) => c.id === columnId);
  const task = column?.tasks.find((t: any) => t.id === taskId);
  if (task) {
    Object.assign(task, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const deleteTask = async (
  boardId: number,
  columnId: number,
  taskId: number
) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data = raw ? JSON.parse(raw) : { boards: [] };
  const board = data.boards.find((b: any) => b.id === boardId);
  const column = board?.columns.find((c: any) => c.id === columnId);
  if (column) {
    column.tasks = column.tasks.filter((t: any) => t.id !== taskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const moveTask = async (
  boardId: number,
  fromColId: number,
  toColId: number,
  task: any
) => {
  await deleteTask(boardId, fromColId, task.id);
  await addTask(boardId, toColId, task);
};
