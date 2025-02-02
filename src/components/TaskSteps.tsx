import {
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { Button, HStack, StepsChangeDetails } from "@chakra-ui/react";
import { useJobs } from "@/context/JobContext";
import {
  BiCaretLeft,
  BiCaretRight,
  BiCaretRightCircle,
  BiCheckCircle,
} from "react-icons/bi";
import { Job, JobStatus } from "@/types";
import EditDialog from "./EditDialog";

interface TaskStepsProps {
  job: Job;
}

const TaskSteps = ({ job }: TaskStepsProps) => {
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
  return (
    <StepsRoot
      defaultStep={job.steps}
      count={job.tasks.length}
      step={job.steps}
      colorPalette={job.color}
      onStepChange={(e) => handleStepChange(e)}
    >
      <StepsList onClick={() => console.log("aa")}>
        {job.tasks.map((task, taskIndex) => (
          <StepsItem key={task.id} index={taskIndex} title={task.name} />
        ))}
      </StepsList>
      <HStack>
        <EditDialog job={job}></EditDialog>
        {job.status !== JobStatus.COMPLETED ? (
          <>
            <StepsPrevTrigger asChild>
              <Button variant="outline" flex="1">
                <BiCaretLeft />
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" flex="1">
                <BiCaretRight />
              </Button>
            </StepsNextTrigger>
          </>
        ) : (
          ""
        )}
        {job.status === JobStatus.IN_PROGRESS ? (
          <Button
            colorPalette="green"
            onClick={() => handleClose(job.id)}
            disabled={job.steps !== job.tasks.length}
            flex="1"
          >
            Close
            <BiCheckCircle />
          </Button>
        ) : (
          <Button
            colorPalette="purple"
            onClick={() => handleReopen(job.id)}
            disabled={job.steps !== job.tasks.length}
            flex="1"
          >
            ReOpen
            <BiCaretRightCircle />
          </Button>
        )}
      </HStack>
    </StepsRoot>
  );
};

export default TaskSteps;
