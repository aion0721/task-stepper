import { useEffect, useState } from "react";
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
import { Job, Task, TaskStatus } from "@/types";
import { useJobs } from "@/context/JobContext";

interface DialogProps {
  toaster: CreateToasterReturn;
  jobIndex: number;
}

const NewDialog = ({ toaster, jobIndex }: DialogProps) => {
  const { jobs, setJobs } = useJobs();
  const [targetJob, setTargetJob] = useState<Job>(jobs[jobIndex]);
  const [open, setOpen] = useState<boolean>(false);

  // 新しいジョブを作成して状態にセット
  const updateJob = () => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === targetJob.id ? { ...job, ...targetJob } : job
      )
    );
    setOpen(false);

    toaster.create({
      title: "ジョブが修正されました。",
      type: "success",
    });
    console.log(targetJob);
  };

  const handleAddTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      name: "New Task",
      status: TaskStatus.NOT_STARTED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTasks = [...targetJob.tasks, newTask];
    setTargetJob({ ...targetJob, tasks: updatedTasks });
  };

  const handleTaskUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    task: Task
  ) => {
    const updatedName = e.target.value;
    // タスク配列を更新
    const updatedTasks = targetJob.tasks.map((t) =>
      t.id === task.id ? { ...t, name: updatedName, updatedAt: new Date() } : t
    );

    // targetJobの状態を更新
    setTargetJob({ ...targetJob, tasks: updatedTasks });
  };

  // jobs[jobIndex]が変化したらtargetJobを更新
  useEffect(() => {
    setTargetJob(jobs[jobIndex]);
  }, [jobs, jobIndex]);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="teal">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Fieldset.Root>
            <Stack>
              <Fieldset.Legend>ジョブの修正</Fieldset.Legend>
              <Fieldset.HelperText>
                必要項目を入力し、ジョブを修正します。
              </Fieldset.HelperText>
            </Stack>
            <Fieldset.Content>
              <Field label="ジョブ名">
                <Input
                  value={targetJob.name}
                  onChange={(e) =>
                    setTargetJob({ ...targetJob, name: e.target.value })
                  }
                  placeholder="新規契約"
                />
              </Field>
              <Field label="対応期日">
                <Input
                  value={
                    new Date(targetJob.dueDate).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setTargetJob({
                      ...targetJob,
                      dueDate: new Date(e.target.value),
                    })
                  }
                  type="date"
                />
              </Field>
              <Field label="タスク">
                <Button onClick={handleAddTask}>AddTask</Button>
                {targetJob.tasks.map((task, index) => (
                  <Input
                    defaultValue={task.name}
                    key={index}
                    onChange={(e) => handleTaskUpdate(e, task)}
                  ></Input>
                ))}
              </Field>
              <Field label="step">{targetJob.steps}</Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={updateJob}>Update</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default NewDialog;
