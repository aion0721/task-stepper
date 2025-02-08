// src/context/AppContextProvider.tsx
import { ReactNode } from "react";
import { JobsProvider } from "./JobContext";
import { AccordionProvider } from "./AccordionContext";
import { FilterProvider } from "./FilterContext";
import { TaskTemplatesProvider } from "./TaskTemplateContext";
import { ConfigProvider } from "./ConfigContext";

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  return (
    <JobsProvider>
      <ConfigProvider>
        <TaskTemplatesProvider>
          <FilterProvider>
            <AccordionProvider>{children}</AccordionProvider>
          </FilterProvider>
        </TaskTemplatesProvider>
      </ConfigProvider>
    </JobsProvider>
  );
};
