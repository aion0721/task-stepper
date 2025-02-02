import React, { createContext, useContext, useState, ReactNode } from "react";

// Contextの型定義
type AccordionContextType = {
  accordion: string[];
  setAccordion: React.Dispatch<React.SetStateAction<string[]>>;
};

// Contextの作成
const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

// Providerコンポーネント
export const AccordionProvider = ({ children }: { children: ReactNode }) => {
  const [accordion, setAccordion] = useState<string[]>([]);

  return (
    <AccordionContext.Provider value={{ accordion, setAccordion }}>
      {children}
    </AccordionContext.Provider>
  );
};

// カスタムフックでContextを利用
export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an AccordionProvider");
  }
  return context;
};
