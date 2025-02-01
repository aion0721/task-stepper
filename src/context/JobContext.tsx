import React, { createContext, useContext, useState, ReactNode } from "react";
import { Job } from "@/types";

type JobsContextType = {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
};

// Contextの作成
const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Providerコンポーネント
export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

// カスタムフック
export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
