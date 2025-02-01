import { Task, NewTask, UpdateTask } from "./task.types";

export interface Job {
  id: string;
  name: string;
  dueDate: Date;
  tasks: Task[]; // 複数のTaskを保持
  steps: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewJob = Omit<Job, "id" | "createdAt" | "updatedAt" | "tasks"> & {
  tasks: NewTask[]; // 新規Taskの配列
};

export type UpdateJob = Partial<Omit<Job, "id" | "createdAt" | "tasks">> & {
  tasks?: UpdateTask[]; // 更新用Taskの配列
};
