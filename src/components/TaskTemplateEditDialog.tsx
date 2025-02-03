import { useEffect, useState } from "react";
import { Button, Fieldset, Flex, Input, Stack, Text } from "@chakra-ui/react";
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
import { Task, TaskTemplate } from "@/types";
import { toaster } from "@/components/ui/toaster";
import { BiEdit, BiMessageAdd, BiSolidTrash, BiTrash } from "react-icons/bi";
import { useTaskTemplates } from "@/context/TaskTemplateContext";

interface DialogProps {
  taskTemplate: TaskTemplate;
}

const EditDialog = ({ taskTemplate }: DialogProps) => {
  const { setTaskTemplates } = useTaskTemplates();
  const [targetTaskTemplate, setTargetTaskTemplate] =
    useState<TaskTemplate>(taskTemplate);
  const [open, setOpen] = useState<boolean>(false);

  // 新しいジョブを作成して状態にセット
  const updateTaskTemplate = () => {
    const newTargetTaskTemplate = {
      ...targetTaskTemplate,
      updatedAt: new Date(),
    };

    setTaskTemplates((prevTaskTemplate) =>
      prevTaskTemplate.map((taskTemplate) =>
        taskTemplate.id === targetTaskTemplate.id
          ? { ...taskTemplate, ...newTargetTaskTemplate }
          : taskTemplate
      )
    );
    setOpen(false);

    toaster.create({
      title: "タスクテンプレートが修正されました。",
      type: "success",
    });
  };

  const handleAddTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      name: "New Task",
    };

    const updatedTasks = [...targetTaskTemplate.tasks, newTask];
    setTargetTaskTemplate({ ...targetTaskTemplate, tasks: updatedTasks });
  };

  const handleTaskUpdate = (
    e: React.ChangeEvent<HTMLInputElement>,
    task: Task
  ) => {
    const updatedName = e.target.value;
    // タスク配列を更新
    const updatedTasks = targetTaskTemplate.tasks.map((t) =>
      t.id === task.id ? { ...t, name: updatedName, updatedAt: new Date() } : t
    );

    // targetJobの状態を更新
    setTargetTaskTemplate({ ...targetTaskTemplate, tasks: updatedTasks });
  };

  const handleTaskDelete = (targetTask: Task) => {
    // タスク配列を更新
    const updatedTasks = targetTaskTemplate.tasks.filter(
      (task) => task.id !== targetTask.id
    );

    // targetJobの状態を更新
    setTargetTaskTemplate({ ...targetTaskTemplate, tasks: updatedTasks });
  };

  const handleJobDelete = () => {
    setTaskTemplates((prev: TaskTemplate[]) =>
      prev.filter((taskTemplate) => taskTemplate.id !== targetTaskTemplate.id)
    );
  };

  useEffect(() => {
    setTargetTaskTemplate(taskTemplate);
  }, [taskTemplate]);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="cyan">
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
                  value={targetTaskTemplate.name}
                  onChange={(e) =>
                    setTargetTaskTemplate({
                      ...targetTaskTemplate,
                      name: e.target.value,
                    })
                  }
                  placeholder="新規契約"
                />
              </Field>
              <Field label="タスク">
                <Button onClick={handleAddTask} w="100%" colorPalette="blue">
                  AddTask
                  <BiMessageAdd />
                </Button>
                {targetTaskTemplate.tasks.map((task, index) => (
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
              <Field label="作成日">
                <Text>
                  {new Date(targetTaskTemplate.createdAt).toISOString()}
                </Text>
              </Field>
              <Field label="更新日">
                <Text>
                  {new Date(targetTaskTemplate.updatedAt).toISOString()}
                </Text>
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
            <Button
              variant="outline"
              onClick={() => setTargetTaskTemplate(taskTemplate)}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button onClick={updateTaskTemplate}>Update</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditDialog;
