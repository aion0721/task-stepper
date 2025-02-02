// src/context/AppContextProvider.tsx
import { ReactNode } from "react";
import { JobsProvider } from "./JobContext";
import { AccordionProvider } from "./AccordionContext";
import { FilterProvider } from "./FilterContext";

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  return (
    <JobsProvider>
      <FilterProvider>
        <AccordionProvider>{children}</AccordionProvider>
      </FilterProvider>
    </JobsProvider>
  );
};
