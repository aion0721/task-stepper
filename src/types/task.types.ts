export interface Task {
  id: string;
  name: string;
}

export type NewTask = Omit<Task, "id">;
export type UpdateTask = Partial<Omit<Task, "id">>;
