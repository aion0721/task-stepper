export interface Task {
  id: string;
  name: string;
  startDate?: Date;
}

export type NewTask = Omit<Task, "id">;
export type UpdateTask = Partial<Omit<Task, "id">>;
