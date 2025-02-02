import {
  Box,
  Button,
  CreateToasterReturn,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import EditDialog from "../EditDialog";
import { useJobs } from "@/context/JobContext";

interface TaskStepperProps {
  toaster: CreateToasterReturn;
}

const TaskStepper = ({ toaster }: TaskStepperProps) => {
  const { jobs } = useJobs();

  return (
    <Box mt="40px">
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
              <Box w="200px">
                <Text>Job Name: {job?.name}</Text>
                {job?.dueDate && (
                  <Text>
                    Due Date: {new Date(job.dueDate).toLocaleDateString()}
                  </Text>
                )}
              </Box>
              <TaskSteps jobIndex={jobIndex} />
              <Stack>
                <EditDialog toaster={toaster} jobIndex={jobIndex} />
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
