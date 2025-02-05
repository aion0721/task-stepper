import {
  Box,
  ColorSwatch,
  Input,
  Presence,
  Spacer,
  Status,
} from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import { useJobs } from "@/context/JobContext";
import { useAccordion } from "@/context/AccordionContext";
import { JobStatus } from "@/types";
import { BiNote } from "react-icons/bi";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";
import { useFilter } from "@/context/FilterContext";
import { Tooltip } from "../ui/tooltip";

const TaskStepper = () => {
  const { jobs } = useJobs();
  const { accordion, setAccordion } = useAccordion();
  const { setFilterText, filterText, filterStatus, sortOrder } = useFilter();

  const statusColorMap: { [key in JobStatus]?: string } = {
    COMPELETED: "gray",
    IN_PROGRESS: "green",
    PENDING: "orange",
  };

  // フィルタリングされたジョブリスト
  const filteredJobs = jobs.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA; // ソート処理
  });

  return (
    <Box mt="80px" height="calc(100vh - 80px)" as="main" px="20px">
      <Input
        placeholder="ジョブ名でフィルター"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)} // フィルタ条件を更新
      />
      <AccordionRoot
        multiple
        value={accordion}
        onValueChange={(e) => setAccordion(e.value)}
        variant="enclosed"
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Presence
              key={job.id}
              present={
                job.name.includes(filterText) &&
                (filterStatus === "ALL" || job.status === filterStatus)
              } // 条件に応じてfalseに切り替える
              animationName={{
                _open: "fade-in",
                _closed: "fade-out",
              }}
              animationDuration="moderate"
            >
              <AccordionItem
                key={job.id}
                value={job.id}
                bg={{
                  base:
                    job.status === JobStatus.IN_PROGRESS ? "green.100" : "gray", // ライトモード
                  _dark:
                    job.status === JobStatus.IN_PROGRESS ? "green" : "gray.600", // ダークモード
                }}
                transition="background-color 0.3s ease-in-out" // 背景色のトランジション
              >
                <Box position="relative">
                  <AccordionItemTrigger>
                    <Status.Root
                      colorPalette={
                        statusColorMap[job?.status as JobStatus] || "red"
                      }
                    >
                      <Status.Indicator />
                    </Status.Root>
                    <ColorSwatch value={job.color} />
                    {job.name}
                    <Spacer />
                    {job.tasks &&
                    job.tasks[job.steps] &&
                    job.tasks[job.steps].name
                      ? `Next:${job.tasks[job.steps].name},`
                      : ""}
                    {new Date(job.createdAt).toLocaleDateString()}
                    <Tooltip content={job.memo}>
                      <BiNote />
                    </Tooltip>
                  </AccordionItemTrigger>
                </Box>
                <AccordionItemContent>
                  <Box
                    key={job.id}
                    py="10px"
                    paddingX="10px"
                    borderWidth="1px"
                    borderColor="border.disabled"
                    bg={{
                      base: "white",
                      _dark: "gray",
                    }}
                    borderRadius=""
                  >
                    <TaskSteps job={job} />
                  </Box>
                </AccordionItemContent>
              </AccordionItem>
            </Presence>
          ))
        ) : (
          <Box>No tasks</Box>
        )}
      </AccordionRoot>
    </Box>
  );
};

export default TaskStepper;
