import { useEffect, useState } from "react";
import { Job, TaskTemplate, JobColor, LegendColor } from "./types";
import { Toaster } from "@/components/ui/toaster";
import { load } from "@tauri-apps/plugin-store";
import { useJobs } from "./context/JobContext";
import { Global } from "@emotion/react";
import { useTaskTemplates } from "@/context/TaskTemplateContext";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./components/utils/Routing";
import { useConfig } from "./context/ConfigContext";

function App() {
  const { jobs, setJobs } = useJobs();
  const { taskTemplates, setTaskTemplates } = useTaskTemplates();
  const { legendColors, setLegendColors } = useConfig();
  const [isInitialized, setIsInitialized] = useState(false);

  const GlobalStyles = () => (
    <Global
      styles={`
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow-x: hidden; /* 横スクロール防止 */
      }
    `}
    />
  );

  // ストアの初期化
  useEffect(() => {
    const initializeStores = async () => {
      try {
        // Data.json
        const storeData = await load("data.json");

        // get jobs
        const storeJobs = await storeData.get<Job[]>("jobs");
        if (storeJobs) {
          setJobs(storeJobs);
        }

        // get taskTemplates
        const storeTaskTemplates =
          await storeData.get<TaskTemplate[]>("taskTemplate");
        if (storeTaskTemplates) {
          setTaskTemplates(storeTaskTemplates);
        }

        // Config.json
        const storeConfig = await load("config.json");

        // get legendColor
        const storeLegendColor =
          await storeConfig.get<LegendColor[]>("legendColor");

        if (storeLegendColor) {
          // 全てのJobColorを配列として取得
          const allJobColors = Object.values(JobColor) as string[];

          // storeLegendColorに欠けているJobColorを追加
          const completeLegendColors = (
            storeLegendColor: LegendColor[]
          ): LegendColor[] => {
            // 欠けているJobColorを特定
            const missingColors = allJobColors.filter(
              (color) =>
                !storeLegendColor.some((legend) => legend.color === color)
            );

            // 欠けている色をmean: ''で追加
            const missingLegendColors: LegendColor[] = missingColors.map(
              (color) => ({
                color: color as JobColor, // 型アサーションでJobColorにキャスト
                mean: "",
              })
            );

            // 元の配列と欠けている色を結合して返す
            return [...storeLegendColor, ...missingLegendColors];
          };

          const updatedLegendColors = completeLegendColors(storeLegendColor);
          setLegendColors(updatedLegendColors);
        }
      } catch (error) {
        console.error("ストア初期化中にエラーが発生しました:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeStores();
  }, []);

  // jobsが変更されたら保存
  useEffect(() => {
    if (isInitialized) {
      const saveData = async () => {
        try {
          const storeData = await load("data.json");
          const storeConfig = await load("config.json");

          // Set a value.
          await storeData.set("jobs", jobs);
          await storeData.set("taskTemplates", taskTemplates);
          await storeData.save();

          // config.json に保存
          await storeConfig.set("legendColor", legendColors);
          await storeConfig.save();
        } catch (error) {
          console.error("データ保存中にエラーが発生しました:", error);
        }
      };

      saveData();
    }
  }, [jobs, taskTemplates, legendColors, isInitialized]);

  return (
    <>
      <GlobalStyles />
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
