import { Task, NewTask, UpdateTask } from "./task.types";

export enum JobStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPELETED",
  PENDING = "PENDING",
}

export enum JobColor {
  Orange = "orange",
  Blue = "blue",
  Green = "green",
  Yello = "yellow",
  Red = "red",
}

export interface Job {
  id: string;
  name: string;
  dueDate: Date;
  tasks: Task[]; // 複数のTaskを保持
  steps: number;
  status: JobStatus;
  color: JobColor;
  memo: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewJob = Omit<Job, "id" | "createdAt" | "updatedAt" | "tasks"> & {
  tasks: NewTask[]; // 新規Taskの配列
};

export type UpdateJob = Partial<Omit<Job, "id" | "createdAt" | "tasks">> & {
  tasks?: UpdateTask[]; // 更新用Taskの配列
};
