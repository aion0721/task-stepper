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

interface TaskStepsProps {
  jobIndex: number; // ジョブのインデックス
  w: string;
}

const TaskSteps = ({ jobIndex, w }: TaskStepsProps) => {
  const { jobs, setJobs } = useJobs();
  const job = jobs[jobIndex];

  const handleStepChange = (e: StepsChangeDetails) => {
    setJobs((prev) =>
      prev.map((job, index) =>
        index === jobIndex ? { ...job, steps: e.step } : job
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
    </StepsRoot>
  );
};

export default TaskSteps;
