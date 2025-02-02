export interface Task {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTask = Partial<Omit<Task, "id" | "createdAt">>;
