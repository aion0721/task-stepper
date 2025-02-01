import { useEffect, useRef, useState } from "react";
import { NewJob, Job, TaskStatus } from "./types";
import {
  Box,
  Button,
  Fieldset,
  Group,
  HStack,
  Input,
  Stack,
  StepsChangeDetails,
  Text,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Store } from "@tauri-apps/plugin-store";
import { Field } from "./components/ui/field";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobNameRef = useRef<HTMLInputElement>(null);
  const jobDateRef = useRef<HTMLInputElement>(null);
  //const store = new LazyStore("data.json");
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const createJob = (newJobData: NewJob): Job => {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      ...newJobData,
      tasks: newJobData.tasks.map((task) => ({
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        status: task.status || TaskStatus.NOT_STARTED,
      })),
      createdAt: now,
      updatedAt: now,
    };
  };

  // 新しいジョブを作成して状態にセット
  const addJob = () => {
    const jobName = jobNameRef.current?.value ?? "";
    const jobDate = jobDateRef.current?.value;
    const newJobData: NewJob = {
      name: jobName, // ジョブ名
      dueDate: jobDate ? new Date(jobDate) : new Date(), // 期日
      tasks: [
        { name: "Task 1", status: TaskStatus.NOT_STARTED }, // タスク1
        { name: "Task 2", status: TaskStatus.IN_PROGRESS }, // タスク2
      ],
      steps: 0,
    };

    const newJob = createJob(newJobData); // `createJob`で新しいジョブを作成
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setOpen(false);

    toaster.create({
      title: "ジョブが作成されました！",
      type: "success",
    });
  };

  const handleStepChange = (e: StepsChangeDetails, jobIndex: number) => {
    setJobs((prev) =>
      prev.map((job, index) =>
        index === jobIndex ? { ...job, steps: e.step } : job
      )
    );
  };

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

  const hashToRange = (input: string, range: number): number => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0; // 32ビット整数に変換
    }
    return Math.abs(hash) % range;
  };

  const colorPalettes = [
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "cyan",
    "teal",
    "orange",
  ];

  return (
    <>
      <Toaster />
      <Button onClick={addJob}>addJob</Button>
      <Button onClick={() => console.log(jobs)}>show jobs</Button>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Job</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Fieldset.Root>
              <Stack>
                <Fieldset.Legend>ジョブ追加</Fieldset.Legend>
                <Fieldset.HelperText>
                  必要項目を記載してジョブを新規作成します。
                </Fieldset.HelperText>
              </Stack>
              <Fieldset.Content>
                <Field label="name">
                  <Input placeholder="Job name" ref={jobNameRef} />
                </Field>
                <Field label="date">
                  <Input type="date" ref={jobDateRef} />
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button onClick={addJob}>Save</Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      {jobs.length > 0 ? (
        jobs.map((job, jobIndex) => (
          <Box
            key={job.id}
            m="20px"
            p="20px"
            borderWidth="1px"
            borderColor="border.disabled"
          >
            <HStack>
              <Box>
                <Text>Job Name: {job?.name}</Text>
                {job?.dueDate && (
                  <Text>
                    Due Date: {new Date(job.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </Box>
              <StepsRoot
                defaultStep={job.steps}
                count={job.tasks.length}
                step={job.steps}
                colorPalette={
                  colorPalettes[hashToRange(job.id, colorPalettes.length)]
                }
                onStepChange={(e) => handleStepChange(e, jobIndex)}
              >
                <StepsList>
                  {job.tasks.map((task, taskIndex) => (
                    <StepsItem
                      key={task.id}
                      index={taskIndex}
                      title={task.name}
                    />
                  ))}
                </StepsList>
                {job.tasks.map((task, taskIndex) => (
                  <StepsContent key={task.id} index={taskIndex}>
                    {task.name}
                  </StepsContent>
                ))}
                <Group>
                  <StepsPrevTrigger asChild>
                    <Button variant="outline" size="sm">
                      Prev
                    </Button>
                  </StepsPrevTrigger>
                  <StepsNextTrigger asChild>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </StepsNextTrigger>
                </Group>
              </StepsRoot>
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
