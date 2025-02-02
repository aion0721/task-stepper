// src/context/AppContextProvider.tsx
import { ReactNode } from "react";
import { JobsProvider } from "./JobContext";
import { AccordionProvider } from "./AccordionContext";

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  return (
    <JobsProvider>
      <AccordionProvider>{children}</AccordionProvider>
    </JobsProvider>
  );
};
