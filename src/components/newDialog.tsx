import { useEffect, useRef, useState } from "react";
import {
  Button,
  ColorSwatch,
  createListCollection,
  Fieldset,
  HStack,
  Input,
  Kbd,
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
import { BiAddToQueue, BiEraser } from "react-icons/bi";
import {
  SelectContent,
  SelectItem,
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
import { SegmentedControl } from "./ui/segmented-control";
import { useConfig } from "@/context/ConfigContext";

const NewDialog = () => {
  const { setJobs } = useJobs();
  const { taskTemplates } = useTaskTemplates();
  const jobNameRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const jobLinksRef = useRef<HTMLInputElement>({
    value: "",
  } as HTMLInputElement);
  const jobDateRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [color, setColor] = useState<JobColor>(JobColor.Orange);
  const contentRef = useRef<HTMLDivElement>(null);
  const [taskTemplateValue, setTaskTemplateValue] = useState<string[]>([]);

  const { legendColors } = useConfig();

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
    const jobDate = jobDateRef.current?.value;
    const newJobData: NewJob = {
      name: jobNameRef.current.value, // ジョブ名
      dueDate: jobDate ? new Date(jobDate) : new Date(), // 期日
      status: JobStatus.IN_PROGRESS,
      color: color,
      memo: memoRef.current?.value || "",
      tasks: targetTaskTemplate,
      steps: 0,
      links: jobLinksRef.current.value,
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
    <DialogRoot
      size="cover"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      scrollBehavior="inside"
    >
      <DialogTrigger asChild>
        <Button colorPalette="teal" variant="surface">
          AddJob
          <BiAddToQueue />
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>
            Add Job <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>C</Kbd>
          </DialogTitle>
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
              <Field label="タスクテンプレート(利用ない場合は「未選択」)">
                <SelectRoot
                  collection={selectTaskTemplate}
                  value={taskTemplateValue}
                  onValueChange={(e) => setTaskTemplateValue(e.value)}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder="未選択" />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef}>
                    {selectTaskTemplate.items.map((taskTemplate) => (
                      <SelectItem item={taskTemplate} key={taskTemplate.value}>
                        {taskTemplate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                <Button
                  w="100%"
                  colorPalette="gray"
                  variant="subtle"
                  onClick={() => setTaskTemplateValue([])}
                >
                  タスクテンプレートをクリア
                  <BiEraser />
                </Button>
              </Field>
              <Field label="色選択">
                <SegmentedControl
                  value={color}
                  onValueChange={(e) => setColor(e.value as JobColor)}
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
                <Textarea ref={memoRef}></Textarea>
              </Field>
              <Field label="リンク">
                <Input type="text" ref={jobLinksRef} />
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
