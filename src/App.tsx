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
import { getMatches } from "@tauri-apps/plugin-cli";

function App() {
  const { jobs, setJobs } = useJobs();
  const { taskTemplates, setTaskTemplates } = useTaskTemplates();
  const { legendColors, setLegendColors, userData, setUserData } = useConfig();
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
        const fetchedMatches = (await (
          await getMatches()
        ).args.source.value) as string | undefined;

        // undefined の場合は空文字列を設定
        const basePath = fetchedMatches ?? ""; // Nullish coalescing operator (??) を使用
        setUserData({ dataBasePath: basePath }); // 状態に保存
      } catch (error) {
        console.error("ストア初期化中にエラーが発生しました:", error);
      }
    };

    initializeStores();
  }, []);

  // basePath が更新されたら処理を実行
  useEffect(() => {
    if (userData.dataBasePath !== undefined) {
      const loadData = async () => {
        try {
          // Data.json
          const storeData = await load(userData.dataBasePath + "data.json");

          // get jobs
          const storeJobs = await storeData.get<Job[]>("jobs");
          if (storeJobs) {
            setJobs(storeJobs);
          }

          // get taskTemplates
          const storeTaskTemplates =
            await storeData.get<TaskTemplate[]>("taskTemplates");
          if (storeTaskTemplates) {
            setTaskTemplates(storeTaskTemplates);
          }

          // Config.json
          const storeConfig = await load(userData.dataBasePath + "config.json");

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
          console.error("データ読み込み中にエラーが発生しました:", error);
        } finally {
          setIsInitialized(true);
        }
      };

      loadData();
    }
  }, [userData]); // basePath が変更されるたびに実行される

  // jobsが変更されたら保存
  useEffect(() => {
    if (isInitialized) {
      const saveData = async () => {
        try {
          const storeData = await load(userData.dataBasePath + "data.json");
          const storeConfig = await load(userData.dataBasePath + "config.json");

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
