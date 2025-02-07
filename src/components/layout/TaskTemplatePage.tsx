import { useTaskTemplates } from "@/context/TaskTemplateContext";
import {
  Box,
  Button,
  Fieldset,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Field } from "../ui/field";
import { Task, TaskTemplate } from "@/types";
import { BiBookAdd, BiMessageAdd, BiSave, BiTrash } from "react-icons/bi";
import { toaster } from "../ui/toaster";
import EditDialog from "@/components/TaskTemplateEditDialog";
import { save } from "@tauri-apps/plugin-dialog";
import { create, BaseDirectory } from "@tauri-apps/plugin-fs";

const TaskTemplatePage = () => {
  const { taskTemplates, setTaskTemplates } = useTaskTemplates();
  const [open, setOpen] = useState<boolean>(false);
  const [targetTaskTemplate, setTargetTaskTemplate] = useState<TaskTemplate>({
    id: crypto.randomUUID(),
    name: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [
      {
        id: crypto.randomUUID(),
        name: "",
      },
    ],
  });

  const handleAddTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      name: "",
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

  // 新しいジョブを作成して状態にセット
  const addTaskTemplate = () => {
    setTaskTemplates((prevTaskTemplate) => [
      ...prevTaskTemplate,
      targetTaskTemplate,
    ]);
    setTargetTaskTemplate({
      id: crypto.randomUUID(),
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    });
    setOpen(false);

    toaster.create({
      title: "ジョブが作成されました！",
      type: "success",
    });
  };

  const handleSaveFile = async (taskTemplate: TaskTemplate) => {
    try {
      const file = await create(`${taskTemplate.name}.json`, {
        baseDir: BaseDirectory.Download,
      });
      await file.write(new TextEncoder().encode(JSON.stringify(taskTemplate)));
      await file.close();
      await toaster.create({
        title: "ダウンロードフォルダに保存されました。",
        type: "success",
      });
    } catch (error) {
      console.error("エラー:", error);
      alert("ファイルの保存中にエラーが発生しました。");
    }
  };

  return (
    <>
      <Box mt="80px" height="calc(100vh - 80px)" as="main" px="20px">
        <Heading>Template</Heading>
        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DialogTrigger asChild>
            <Button colorPalette="teal" variant="surface" w="100%">
              AddTemplate
              <BiBookAdd />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogBody>
              <Fieldset.Root>
                <Stack>
                  <Fieldset.Legend>AddTemplate</Fieldset.Legend>
                  <Fieldset.HelperText>Add Template</Fieldset.HelperText>
                </Stack>
                <Fieldset.Content>
                  <Field label="TemplateName">
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
                    <Button
                      onClick={handleAddTask}
                      w="100%"
                      colorPalette="blue"
                    >
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
                </Fieldset.Content>
              </Fieldset.Root>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button onClick={addTaskTemplate}>Save</Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
        <Box w="100%" p={4}>
          {taskTemplates.length > 0 ? (
            taskTemplates.map((taskTemplate) => (
              <Flex
                key={taskTemplate.id}
                alignItems="center"
                justifyContent="space-between"
                p={2}
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                {/* タイトル */}
                <Text fontWeight="bold" fontSize="md">
                  {taskTemplate.name}
                </Text>

                <Flex gap="2">
                  {/* 編集ボタン */}
                  <EditDialog taskTemplate={taskTemplate} />
                  <Button
                    colorPalette="green"
                    onClick={() => handleSaveFile(taskTemplate)}
                  >
                    Export
                    <BiSave />
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" color="gray.500">
              no templates
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TaskTemplatePage;
