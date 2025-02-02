import { useEffect, useState } from "react";
import { Job, TaskTemplate } from "./types";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "@tauri-apps/plugin-store";
import { useJobs } from "./context/JobContext";
import Header from "./components/layout/Header";
import TaskStepper from "./components/layout/TaskStepper";
import { Global } from "@emotion/react";
import { useTaskTemplates } from "@/context/TaskTemplateContext";

function App() {
  const { jobs, setJobs } = useJobs();
  const { taskTemplates, setTaskTemplates } = useTaskTemplates();
  const [store, setStore] = useState<Store | null>(null);
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
    const initializeStore = async () => {
      try {
        const loadedStore = await Store.load("data.json");
        setStore(loadedStore);

        // ストアからデータを取得
        const storedJobs = await loadedStore.get<Job[]>("jobs");
        if (storedJobs) {
          setJobs(storedJobs);
        }

        // ストアからデータを取得
        const storedTaskTemplates = await loadedStore.get<TaskTemplate[]>(
          "taskTemplates"
        );
        if (storedTaskTemplates) {
          setTaskTemplates(storedTaskTemplates);
        }
      } catch (error) {
        console.error("ストアの初期化中にエラーが発生しました:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, []);

  // jobsが変更されたら保存
  useEffect(() => {
    if (store && isInitialized) {
      const saveJobs = async () => {
        try {
          await store.set("jobs", jobs);
          await store.set("taskTemplates", taskTemplates);
          await store.save();
        } catch (error) {
          console.error("データ保存中にエラーが発生しました:", error);
        }
      };

      saveJobs();
    }
  }, [jobs, taskTemplates, store, isInitialized]);

  return (
    <>
      <GlobalStyles />
      <Toaster />
      <Header />
      <TaskStepper />
    </>
  );
}

export default App;
