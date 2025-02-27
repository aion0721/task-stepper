import { useEffect, useState } from "react";
import {
  Button,
  ColorSwatch,
  Fieldset,
  Flex,
  HStack,
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
import { SegmentedControl } from "./ui/segmented-control";
import { JobColor } from "@/types";
import { useConfig } from "@/context/ConfigContext";

interface DialogProps {
  job: Job;
}

const EditDialog = ({ job }: DialogProps) => {
  const { setJobs } = useJobs();
  const [targetJob, setTargetJob] = useState<Job>(job);
  const [open, setOpen] = useState<boolean>(false);
  const { legendColors } = useConfig();

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
      name: "",
    };

    const updatedTasks = [...targetJob.tasks, newTask];
    setTargetJob({ ...targetJob, tasks: updatedTasks });
  };

  const handleTaskUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    task: Task,
    field: "name" | "startDate"
  ) => {
    const updatedValue =
      field === "startDate" ? e.target.value : e.target.value;

    // タスク配列を更新
    const updatedTasks = targetJob.tasks.map((t) =>
      t.id === task.id
        ? {
            ...t,
            [field]:
              field === "startDate"
                ? new Date(updatedValue).toISOString()
                : updatedValue,
            updatedAt: new Date(),
          }
        : t
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
    <DialogRoot
      size="cover"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      scrollBehavior="inside"
    >
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
                    {/* タスク名の入力 */}
                    <Input
                      defaultValue={task.name}
                      key={`name-${index}`}
                      onChange={(e) => handleTaskUpdate(e, task, "name")}
                    ></Input>

                    {/* 開始日の入力 */}
                    <Input
                      type="date"
                      defaultValue={
                        task.startDate
                          ? new Date(task.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      key={`startDate-${index}`}
                      onChange={(e) => handleTaskUpdate(e, task, "startDate")}
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
              <Field label="今のステップ">{targetJob.steps + 1}</Field>

              <Field label="色選択">
                <SegmentedControl
                  value={targetJob.color}
                  onValueChange={(e) =>
                    setTargetJob({ ...targetJob, color: e.value as JobColor })
                  }
                  items={legendColors.map((legendColor) => ({
                    value: legendColor.color.toLowerCase(), // 値を小文字に変換 (必要に応じて)
                    label: (
                      <HStack>
                        <ColorSwatch value={legendColor.color} />
                        {legendColor.mean}
                      </HStack>
                    ),
                  }))}
                />
              </Field>

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
