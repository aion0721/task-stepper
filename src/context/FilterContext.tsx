import React, { createContext, useState, useContext } from "react";
import { JobStatus } from "@/types";

type SortOrder = "asc" | "desc" | null;

// Contextの型定義
interface FilterContextType {
  filterText: string;
  setFilterText: (text: string) => void;
  filterStatus: JobStatus | "ALL";
  setFilterStatus: (status: JobStatus | "ALL") => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

// Contextの作成
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Providerコンポーネント
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "ALL">(
    JobStatus.IN_PROGRESS
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  return (
    <FilterContext.Provider
      value={{
        filterText,
        setFilterText,
        filterStatus,
        setFilterStatus,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Contextを利用するためのカスタムフック
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
