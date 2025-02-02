import {
  Box,
  Button,
  ColorSwatch,
  DataList,
  HStack,
  Input,
  Presence,
  Spacer,
  Stack,
  Status,
} from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import EditDialog from "../EditDialog";
import { useJobs } from "@/context/JobContext";
import { useAccordion } from "@/context/AccordionContext";
import { JobStatus } from "@/types";
import { Job } from "@/types";
import { BiCaretRightCircle, BiCheckCircle } from "react-icons/bi";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";
import { useFilter } from "@/context/FilterContext";

const TaskStepper = () => {
  const { jobs, setJobs } = useJobs();
  const { accordion, setAccordion } = useAccordion();
  const { setFilterText, filterText, filterStatus, sortOrder } = useFilter();

  const statusColorMap: { [key in JobStatus]?: string } = {
    COMPELETED: "gray",
    IN_PROGRESS: "green",
    PENDING: "orange",
  };

  const handleClose = (jobid: string) => {
    setJobs((prev) =>
      prev.map((job: Job) =>
        job.id === jobid ? { ...job, status: JobStatus.COMPLETED } : job
      )
    );
  };

  const handleReopen = (jobid: string) => {
    setJobs((prev) =>
      prev.map((job: Job) =>
        job.id === jobid ? { ...job, status: JobStatus.IN_PROGRESS } : job
      )
    );
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
                bgColor={
                  job.status === JobStatus.IN_PROGRESS ? "green.100" : "gray"
                }
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
                      {job?.status}
                    </Status.Root>
                    <ColorSwatch value={job.color} />
                    {job.name}
                    <Spacer />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </AccordionItemTrigger>
                </Box>
                <AccordionItemContent>
                  <Box
                    key={job.id}
                    py="10px"
                    paddingX="10px"
                    borderWidth="1px"
                    borderColor="border.disabled"
                    borderRadius=""
                    bg="white"
                  >
                    <HStack>
                      <Box w="20%">
                        <DataList.Root gap="1" size="sm">
                          <DataList.Item>
                            <DataList.ItemLabel>Status</DataList.ItemLabel>
                            <DataList.ItemValue>
                              <Status.Root
                                size="sm"
                                colorPalette={
                                  statusColorMap[job?.status as JobStatus] ||
                                  "red"
                                }
                              >
                                <Status.Indicator />
                                {job?.status}
                              </Status.Root>
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Name</DataList.ItemLabel>
                            <DataList.ItemValue>{job?.name}</DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Date</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {new Date(job.dueDate).toLocaleDateString()}
                            </DataList.ItemValue>
                          </DataList.Item>
                        </DataList.Root>
                      </Box>
                      <TaskSteps job={job} w="80%" />
                      <Stack w="20%">
                        <EditDialog job={job} />
                        {job.status === JobStatus.IN_PROGRESS ? (
                          <Button
                            colorPalette="green"
                            onClick={() => handleClose(job.id)}
                            disabled={job.steps !== job.tasks.length}
                          >
                            Close
                            <BiCheckCircle />
                          </Button>
                        ) : (
                          <Button
                            colorPalette="purple"
                            onClick={() => handleReopen(job.id)}
                            disabled={job.steps !== job.tasks.length}
                          >
                            ReOpen
                            <BiCaretRightCircle />
                          </Button>
                        )}
                      </Stack>
                    </HStack>
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
