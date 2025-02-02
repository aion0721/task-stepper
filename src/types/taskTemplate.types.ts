import { Task, NewTask, UpdateTask } from "./task.types";

export interface TaskTemplate {
  id: string;
  name: string;
  tasks: Task[]; // 複数のTaskを保持
  createdAt: Date;
  updatedAt: Date;
}

export type NewTaskTemplate = Omit<
  TaskTemplate,
  "id" | "createdAt" | "updatedAt" | "tasks"
> & {
  tasks: NewTask[]; // 新規Taskの配列
};

export type UpdateTaskTemplate = Partial<
  Omit<TaskTemplate, "id" | "createdAt" | "tasks">
> & {
  tasks?: UpdateTask[]; // 更新用Taskの配列
};
