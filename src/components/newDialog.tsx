import { useEffect, useRef, useState } from "react";
import {
  Button,
  createListCollection,
  Fieldset,
  HStack,
  Input,
  Stack,
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
import { NewJob, Job, JobStatus, JobColor, Task } from "@/types";
import { useJobs } from "@/context/JobContext";
import { toaster } from "@/components/ui/toaster";
import { BiAddToQueue } from "react-icons/bi";
import { Radio, RadioGroup } from "./ui/radio";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select";
import { useTaskTemplates } from "@/context/TaskTemplateContext";
import {
  isRegistered,
  register,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";

const NewDialog = () => {
  const { setJobs } = useJobs();
  const { taskTemplates } = useTaskTemplates();
  const jobNameRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const jobDateRef = useRef<HTMLInputElement>(null);
  const firstTaskRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState<JobColor>(JobColor.Orange);
  const contentRef = useRef<HTMLDivElement>(null);
  const [taskTemplateValue, setTaskTemplateValue] = useState<string[]>([]);

  const jobColors = Object.values(JobColor);

  const createJob = (newJobData: NewJob): Job => {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      ...newJobData,
      tasks: newJobData.tasks.map((task) => ({
        ...task,
        id: crypto.randomUUID(),
      })),
      createdAt: now,
      updatedAt: now,
    };
  };

  // 新しいジョブを作成して状態にセット
  const addJob = () => {
    const targetTaskTemplate: Task[] =
      taskTemplates.find((template) => template.id === taskTemplateValue[0])
        ?.tasks || [];
    console.log(targetTaskTemplate);
    const jobDate = jobDateRef.current?.value;
    const newJobData: NewJob = {
      name: jobNameRef.current.value, // ジョブ名
      dueDate: jobDate ? new Date(jobDate) : new Date(), // 期日
      status: JobStatus.IN_PROGRESS,
      color: color,
      memo: memoRef.current?.value || "",
      tasks: targetTaskTemplate,
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

  const selectTaskTemplate = createListCollection({
    items: taskTemplates.map((template) => ({
      label: template.name,
      value: template.id,
    })),
  });
  async function setupShortcut(shortcut: string, handler: () => void) {
    try {
      const alreadyRegistered = await isRegistered(shortcut);
      if (alreadyRegistered) {
        console.warn(
          `Shortcut "${shortcut}" is already registered. Unregistering it first.`
        );
        await unregister(shortcut); // 必要に応じて既存のショートカットを解除
      }
      await register(shortcut, handler);
      console.log(`Shortcut "${shortcut}" registered successfully.`);
    } catch (error) {
      console.error(`Failed to register shortcut "${shortcut}":`, error);
    }
  }

  useEffect(() => {
    // 非同期処理を行うために内部で関数を定義
    const initializeShortcut = async () => {
      await setupShortcut("Ctrl+Shift+C", async () => {
        setOpen(true); // 状態を更新
        await getCurrentWindow().setFocus();
      });
    };

    initializeShortcut();

    // クリーンアップ処理（ショートカット解除）
    return () => {
      unregister("Ctrl+Shift+C").catch((error) =>
        console.error("Failed to unregister shortcut:", error)
      );
    };
  }, [setOpen]); // Reactルールに従い依存配列にsetOpenを追加

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="teal" variant="surface">
          AddJob
          <BiAddToQueue />
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
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
              <Field label="TaskTemplate">
                <Button onClick={() => console.log(taskTemplateValue)}>
                  aaa
                </Button>
                <SelectRoot
                  collection={selectTaskTemplate}
                  value={taskTemplateValue}
                  onValueChange={(e) => setTaskTemplateValue(e.value)}
                >
                  <SelectLabel>Select framework</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef}>
                    {selectTaskTemplate.items.map((taskTemplate) => (
                      <SelectItem item={taskTemplate} key={taskTemplate.value}>
                        {taskTemplate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>
              <Field label="最初のタスク">
                <Input placeholder="見積書を作る" ref={firstTaskRef} />
              </Field>
              <Field label="色選択">
                <RadioGroup
                  value={color}
                  onValueChange={(e) => setColor(e.value as JobColor)}
                >
                  <HStack>
                    {jobColors.map((jobColor) => (
                      <Radio
                        key={jobColor}
                        value={jobColor}
                        colorPalette={jobColor}
                      >
                        {jobColor}
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </Field>
              <Field label="メモ">
                <Textarea ref={memoRef}></Textarea>
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
