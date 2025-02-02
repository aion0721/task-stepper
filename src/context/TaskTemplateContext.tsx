import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskTemplate } from "@/types";

type TaskTemplatesContextType = {
  taskTemplates: TaskTemplate[];
  setTaskTemplates: React.Dispatch<React.SetStateAction<TaskTemplate[]>>;
};

// Contextの作成
const TaskTemplatesContext = createContext<
  TaskTemplatesContextType | undefined
>(undefined);

// Providerコンポーネント
export const TaskTemplatesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);

  return (
    <TaskTemplatesContext.Provider value={{ taskTemplates, setTaskTemplates }}>
      {children}
    </TaskTemplatesContext.Provider>
  );
};

// カスタムフック
export const useTaskTemplates = () => {
  const context = useContext(TaskTemplatesContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
