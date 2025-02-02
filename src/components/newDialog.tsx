import { useRef, useState } from "react";
import {
  Button,
  CreateToasterReturn,
  Fieldset,
  Input,
  Stack,
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
} from "./ui/dialog";
import { Field } from "./ui/field";
import { NewJob, Job, TaskStatus } from "@/types";
import { useJobs } from "@/context/JobContext";
import { toaster } from "@/components/ui/toaster";

const NewDialog = () => {
  const { setJobs } = useJobs();
  const jobNameRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const jobDateRef = useRef<HTMLInputElement>(null);
  const firstTaskRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const [open, setOpen] = useState<boolean>(false);

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
    const jobDate = jobDateRef.current?.value;
    const newJobData: NewJob = {
      name: jobNameRef.current.value, // ジョブ名
      dueDate: jobDate ? new Date(jobDate) : new Date(), // 期日
      tasks: [
        { name: firstTaskRef.current.value, status: TaskStatus.NOT_STARTED }, // タスク1
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

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          新規ジョブを作成
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
              <Field label="ジョブ名">
                <Input placeholder="新規契約" ref={jobNameRef} />
              </Field>
              <Field label="対応期日">
                <Input type="date" ref={jobDateRef} />
              </Field>
              <Field label="最初のタスク">
                <Input placeholder="見積書を作る" ref={firstTaskRef} />
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
  );
};

export default NewDialog;
