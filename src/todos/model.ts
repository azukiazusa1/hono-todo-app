export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface CreateTodo {
  title: string;
}

export interface UpdateTodo {
  title?: string;
  completed?: boolean;
}

export const PREFIX = "v1:todo:";

export const getTodos = async (KV: KVNamespace): Promise<Todo[]> => {
  const list = await KV.list({ prefix: PREFIX });
  const todos: Todo[] = [];

  for (const key of list.keys) {
    const value = await KV.get<Todo>(key.name, "json");
    if (value) {
      todos.push(value);
    }
  }

  return todos;
};

export const getTodo = (KV: KVNamespace, id: string): Promise<Todo | null> => {
  return KV.get<Todo>(`${PREFIX}${id}`, "json");
};

export const createTodo = async (
  KV: KVNamespace,
  param: CreateTodo
): Promise<Todo> => {
  const id = crypto.randomUUID();
  const newTodo: Todo = {
    id,
    title: param.title,
    completed: false,
  };
  await KV.put(`${PREFIX}${id}`, JSON.stringify(newTodo));

  return newTodo;
};

export const updateTodo = async (
  KV: KVNamespace,
  id: string,
  param: UpdateTodo
): Promise<void> => {
  const todo = await getTodo(KV, id);
  if (!todo) {
    return;
  }

  const updateTodo = {
    ...todo,
    ...param,
  };

  await KV.put(`${PREFIX}${id}`, JSON.stringify(updateTodo));
};

export const deleteTodo = (KV: KVNamespace, id: string) => {
  return KV.delete(`${PREFIX}${id}`);
};
