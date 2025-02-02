import {
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { Button, Group, StepsChangeDetails } from "@chakra-ui/react";
import { useJobs } from "@/context/JobContext";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import { Job, JobStatus } from "@/types";

interface TaskStepsProps {
  job: Job;
  w: string;
}

const TaskSteps = ({ job, w }: TaskStepsProps) => {
  const { setJobs } = useJobs();

  const handleStepChange = (e: StepsChangeDetails) => {
    const now = new Date();
    setJobs((prev) =>
      prev.map((prevJob) =>
        prevJob.id === job.id
          ? { ...job, updatedAt: now, steps: e.step }
          : prevJob
      )
    );
  };
  return (
    <StepsRoot
      m="10px"
      w={w}
      defaultStep={job.steps}
      count={job.tasks.length}
      step={job.steps}
      colorPalette={job.color}
      onStepChange={(e) => handleStepChange(e)}
    >
      <StepsList>
        {job.tasks.map((task, taskIndex) => (
          <StepsItem key={task.id} index={taskIndex} title={task.name} />
        ))}
      </StepsList>
      {job.status !== JobStatus.COMPLETED ? (
        <Group w="100%">
          <StepsPrevTrigger asChild>
            <Button variant="outline" w="50%">
              <BiCaretLeft />
            </Button>
          </StepsPrevTrigger>
          <StepsNextTrigger asChild>
            <Button variant="outline" w="50%">
              <BiCaretRight />
            </Button>
          </StepsNextTrigger>
        </Group>
      ) : (
        ""
      )}
    </StepsRoot>
  );
};

export default TaskSteps;
