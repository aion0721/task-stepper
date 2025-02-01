import { useEffect, useState } from "react";
import { Job } from "./types";
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Store } from "@tauri-apps/plugin-store";
import NewDialog from "@/components/NewDialog";
import EditDialog from "@/components/EditDialog";
import TaskSteps from "./components/TaskSteps";
import { useJobs } from "./context/JobContext";

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
      <Button onClick={() => console.log(jobs)}>show jobs</Button>
      <NewDialog toaster={toaster} />
      {jobs.length > 0 ? (
        jobs.map((job, jobIndex) => (
          <Box
            key={job.id}
            m="20px"
            paddingX="10px"
            borderWidth="1px"
            borderColor="border.disabled"
          >
            <HStack>
              <Box w="200px">
                <Text>Job Name: {job?.name}</Text>
                {job?.dueDate && (
                  <Text>
                    Due Date: {new Date(job.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </Box>
              <TaskSteps jobIndex={jobIndex} />
              <Stack>
                <EditDialog toaster={toaster} jobIndex={jobIndex} />
                <Button
                  colorPalette="red"
                  disabled={job.steps !== job.tasks.length}
                >
                  Close
                </Button>
              </Stack>
            </HStack>
          </Box>
        ))
      ) : (
        <Box>No tasks</Box>
      )}
    </>
  );
}

export default App;
