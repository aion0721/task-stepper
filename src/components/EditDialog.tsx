import { useEffect, useState } from "react";
import {
  Button,
  Fieldset,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
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
import { Job, Task } from "@/types";
import { useJobs } from "@/context/JobContext";
import { toaster } from "@/components/ui/toaster";
import { BiEdit, BiMessageAdd, BiSolidTrash, BiTrash } from "react-icons/bi";

interface DialogProps {
  job: Job;
}

const EditDialog = ({ job }: DialogProps) => {
  const { setJobs } = useJobs();
  const [targetJob, setTargetJob] = useState<Job>(job);
  const [open, setOpen] = useState<boolean>(false);

  // 新しいジョブを作成して状態にセット
  const updateJob = () => {
    const newTargetJob = { ...targetJob, updatedAt: new Date() };

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === targetJob.id ? { ...job, ...newTargetJob } : job
      )
    );
    setOpen(false);

    toaster.create({
      title: "ジョブが修正されました。",
      type: "success",
    });
  };

  const handleAddTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      name: "New Task",
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

  const handleTaskDelete = (targetTask: Task) => {
    // タスク配列を更新
    const updatedTasks = targetJob.tasks.filter(
      (task) => task.id !== targetTask.id
    );

    // targetJobの状態を更新
    setTargetJob({ ...targetJob, tasks: updatedTasks });
  };

  const handleJobDelete = () => {
    setJobs((prev: Job[]) => prev.filter((job) => job.id !== targetJob.id));
  };

  useEffect(() => {
    setTargetJob(job);
  }, [job]);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="cyan" flex="1">
          Edit
          <BiEdit />
        </Button>
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
                <Button onClick={handleAddTask} w="100%" colorPalette="blue">
                  AddTask
                  <BiMessageAdd />
                </Button>
                {targetJob.tasks.map((task, index) => (
                  <Flex key={task.id} w="100%" gap="4">
                    <Input
                      defaultValue={task.name}
                      key={index}
                      onChange={(e) => handleTaskUpdate(e, task)}
                    ></Input>
                    <Button
                      onClick={() => handleTaskDelete(task)}
                      colorPalette="red"
                    >
                      <BiTrash />
                    </Button>
                  </Flex>
                ))}
              </Field>
              <Field label="step">{targetJob.steps}</Field>
              <Field label="メモ">
                <Textarea
                  value={targetJob.memo}
                  onChange={(e) =>
                    setTargetJob({ ...targetJob, memo: e.target.value })
                  }
                ></Textarea>
              </Field>
              <Field label="リンク">
                <Input
                  value={targetJob.links}
                  onChange={(e) =>
                    setTargetJob({ ...targetJob, links: e.target.value })
                  }
                />
              </Field>
              <Field label="作成日">
                <Text>{new Date(targetJob.createdAt).toISOString()}</Text>
              </Field>
              <Field label="更新日">
                <Text>{new Date(targetJob.updatedAt).toISOString()}</Text>
              </Field>
            </Fieldset.Content>
            <Fieldset.Content>
              <Button colorPalette="red" onClick={handleJobDelete}>
                Delete <BiSolidTrash />
              </Button>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => setTargetJob(job)}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button onClick={updateJob}>Update</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditDialog;
