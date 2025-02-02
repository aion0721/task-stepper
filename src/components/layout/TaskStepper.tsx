import { Box, Button, DataList, HStack, Stack, Text } from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import EditDialog from "../EditDialog";
import { useJobs } from "@/context/JobContext";

const TaskStepper = () => {
  const { jobs } = useJobs();

  return (
    <Box mt="80px">
      {jobs.length > 0 ? (
        jobs.map((job, jobIndex) => (
          <Box
            key={job.id}
            m="20px"
            paddingX="10px"
            borderWidth="1px"
            borderColor="border.disabled"
          >
            <HStack>
              <Box w="20%">
                <DataList.Root gap="1">
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
                <EditDialog jobIndex={jobIndex} />
                <Button
                  colorPalette="red"
                  disabled={job.steps !== job.tasks.length}
                >
                  Close
                </Button>
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
