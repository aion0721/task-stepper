import { Box, Button, DataList, HStack, Stack, Status } from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import EditDialog from "../EditDialog";
import { useJobs } from "@/context/JobContext";
import { JobStatus } from "@/types";
import { Job } from "@/types";
import { BiCaretRightCircle, BiCheckCircle } from "react-icons/bi";

const TaskStepper = () => {
  const { jobs, setJobs } = useJobs();

  const statusColorMap: { [key in JobStatus]?: string } = {
    COMPELETED: "gray",
    IN_PROGRESS: "green",
    PENDING: "orange",
  };

  const handleClose = (jobIndex: number) => {
    setJobs((prev) =>
      prev.map((job: Job, index) =>
        index === jobIndex ? { ...job, status: JobStatus.COMPLETED } : job
      )
    );
  };

  const handleReopen = (jobIndex: number) => {
    setJobs((prev) =>
      prev.map((job: Job, index) =>
        index === jobIndex ? { ...job, status: JobStatus.IN_PROGRESS } : job
      )
    );
  };

  return (
    <Box mt="80px">
      {jobs.length > 0 ? (
        jobs.map((job, jobIndex) => (
          <Box
            key={job.id}
            m="20px"
            py="10px"
            paddingX="10px"
            borderWidth="1px"
            borderColor="border.disabled"
            bgColor={job.status === JobStatus.COMPLETED ? "gray" : ""}
            transition="background-color 0.3s ease-in-out" // 背景色のトランジション
            borderRadius=""
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
                          statusColorMap[job?.status as JobStatus] || "red"
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
              <TaskSteps jobIndex={jobIndex} w="80%" />
              <Stack w="20%">
                <EditDialog job={jobs[jobIndex]} />
                {job.status === JobStatus.IN_PROGRESS ? (
                  <Button
                    colorPalette="green"
                    onClick={() => handleClose(jobIndex)}
                    disabled={job.steps !== job.tasks.length}
                  >
                    Close
                    <BiCheckCircle />
                  </Button>
                ) : (
                  <Button
                    colorPalette="purple"
                    onClick={() => handleReopen(jobIndex)}
                    disabled={job.steps !== job.tasks.length}
                  >
                    ReOpen
                    <BiCaretRightCircle />
                  </Button>
                )}
              </Stack>
            </HStack>
          </Box>
        ))
      ) : (
        <Box>No tasks</Box>
      )}
    </Box>
  );
};

export default TaskStepper;
