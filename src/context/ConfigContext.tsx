import React, { createContext, useContext, useState, ReactNode } from "react";
import { LegendColor, UserData } from "@/types";

type ConfigContextType = {
  legendColors: LegendColor[];
  setLegendColors: React.Dispatch<React.SetStateAction<LegendColor[]>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

// Contextの作成
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Providerコンポーネント
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [legendColors, setLegendColors] = useState<LegendColor[]>([]);
  const [userData, setUserData] = useState<UserData>({
    dataBasePath: undefined,
  });

  return (
    <ConfigContext.Provider
      value={{ legendColors, setLegendColors, userData, setUserData }}
    >
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
