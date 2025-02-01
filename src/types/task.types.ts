export enum TaskStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTask = Partial<Omit<Task, "id" | "createdAt">>;
