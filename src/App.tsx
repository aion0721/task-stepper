import { useEffect, useState } from "react";
import { Job } from "./types";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "@tauri-apps/plugin-store";
import { useJobs } from "./context/JobContext";
import Header from "./components/layout/Header";
import TaskStepper from "./components/layout/TaskStepper";

function App() {
  const { jobs, setJobs } = useJobs();
  const [store, setStore] = useState<Store | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

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
          await store.save();
        } catch (error) {
          console.error("データ保存中にエラーが発生しました:", error);
        }
      };

      saveJobs();
    }
  }, [jobs, store, isInitialized]);

  return (
    <>
      <Toaster />
      <Header />
      <TaskStepper />
    </>
  );
}

export default App;
