import {
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { Button, Group, StepsChangeDetails } from "@chakra-ui/react";
import { Job } from "@/types";

interface TaskStepsProps {
  job: Job; // types.tsで定義されているJob型
  handleStepChange: (e: StepsChangeDetails, jobIndex: number) => void; // ステップ変更時のコールバック関数
  jobIndex: number; // ジョブのインデックス
}

const TaskSteps = ({ job, handleStepChange, jobIndex }: TaskStepsProps) => {
  const hashToRange = (input: string, range: number): number => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0; // 32ビット整数に変換
    }
    return Math.abs(hash) % range;
  };

  const colorPalettes = [
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "cyan",
    "teal",
    "orange",
  ];
  return (
    <StepsRoot
      defaultStep={job.steps}
      count={job.tasks.length}
      step={job.steps}
      colorPalette={colorPalettes[hashToRange(job.id, colorPalettes.length)]}
      onStepChange={(e) => handleStepChange(e, jobIndex)}
    >
      <StepsList>
        {job.tasks.map((task, taskIndex) => (
          <StepsItem key={task.id} index={taskIndex} title={task.name} />
        ))}
      </StepsList>
      <Group w="100%">
        <StepsPrevTrigger asChild>
          <Button variant="outline" w="50%">
            Prev
          </Button>
        </StepsPrevTrigger>
        <StepsNextTrigger asChild>
          <Button variant="outline" w="50%">
            Next
          </Button>
        </StepsNextTrigger>
      </Group>
    </StepsRoot>
  );
};

export default TaskSteps;
