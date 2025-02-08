import React, { createContext, useContext, useState, ReactNode } from "react";
import { LegendColor } from "@/types";

type ConfigContextType = {
  legendColors: LegendColor[];
  setLegendColors: React.Dispatch<React.SetStateAction<LegendColor[]>>;
};

// Contextの作成
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Providerコンポーネント
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [legendColors, setLegendColors] = useState<LegendColor[]>([]);

  return (
    <ConfigContext.Provider value={{ legendColors, setLegendColors }}>
      {children}
    </ConfigContext.Provider>
  );
};

// カスタムフック
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useConfig must be used within a ConfigProvider" // エラーメッセージを修正
    );
  }
  return context;
};
