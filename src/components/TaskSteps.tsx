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
  BiCaretDownCircle,
  BiCaretLeft,
  BiCaretRight,
  BiCaretRightCircle,
  BiCaretUpCircle,
  BiCheckCircle,
  BiStopCircle,
} from "react-icons/bi";
import { Job, JobStatus } from "@/types";
import EditDialog from "./EditDialog";

interface TaskStepsProps {
  job: Job;
}

const TaskSteps = ({ job }: TaskStepsProps) => {
  const { setJobs } = useJobs();

  // ジョブIDを使って処理を実行
  const handleMoveUp = () => {
    setJobs((prevJobs) => {
      const jobIndex = prevJobs.findIndex((j) => j.id === job.id); // IDで検索
      if (jobIndex > 0) {
        // 順番を入れ替える
        const updatedJobs = [...prevJobs];
        const [movedJob] = updatedJobs.splice(jobIndex, 1);
        updatedJobs.splice(jobIndex - 1, 0, movedJob);
        return updatedJobs;
      }
      return prevJobs; // 入れ替えが不要な場合はそのまま返す
    });
  };
  // ジョブを下に移動
  const handleMoveDown = () => {
    setJobs((prevJobs) => {
      const jobIndex = prevJobs.findIndex((j) => j.id === job.id); // IDで検索
      if (jobIndex < prevJobs.length - 1) {
        // 順番を入れ替える
        const updatedJobs = [...prevJobs];
        const [movedJob] = updatedJobs.splice(jobIndex, 1);
        updatedJobs.splice(jobIndex + 1, 0, movedJob);
        return updatedJobs;
      }
      return prevJobs; // 入れ替えが不要な場合はそのまま返す
    });
  };

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

  const handlePending = (jobid: string) => {
    setJobs((prev) =>
      prev.map((job: Job) =>
        job.id === jobid ? { ...job, status: JobStatus.PENDING } : job
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
          job.steps === job.tasks.length ? (
            <Button
              colorPalette="green"
              onClick={() => handleClose(job.id)}
              flex="1"
            >
              Close
              <BiCheckCircle />
            </Button>
          ) : (
            <Button
              colorPalette="yellow"
              onClick={() => handlePending(job.id)}
              flex="1"
            >
              Pending
              <BiStopCircle />
            </Button>
          )
        ) : (
          <Button
            colorPalette="purple"
            onClick={() => handleReopen(job.id)}
            flex="1"
          >
            ReOpen
            <BiCaretRightCircle />
          </Button>
        )}
        <Button onClick={handleMoveUp}>
          <BiCaretUpCircle />
        </Button>
        <Button onClick={handleMoveDown}>
          <BiCaretDownCircle />
        </Button>
      </HStack>
    </StepsRoot>
  );
};

export default TaskSteps;
