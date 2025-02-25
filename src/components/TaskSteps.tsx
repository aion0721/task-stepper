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
import { toaster } from "./ui/toaster";

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

  const getRandomPraise = (messages: string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };
  // ステップ更新時
  const handleStepChange = (e: StepsChangeDetails) => {
    const now = new Date();
    setJobs((prev) =>
      prev.map((prevJob) =>
        prevJob.id === job.id
          ? { ...job, updatedAt: now, steps: e.step }
          : prevJob
      )
    );

    if (job.steps < e.step) {
      toaster.create({
        title: "[タスク更新]" + getRandomPraise(praiseMessagesForStep),
        duration: 6000,
        type: "success",
      });
    }
  };

  // ジョブ完了時
  const handleClose = (jobid: string) => {
    setJobs((prev) =>
      prev.map((job: Job) =>
        job.id === jobid ? { ...job, status: JobStatus.COMPLETED } : job
      )
    );

    toaster.create({
      title: "[ジョブ完了]" + getRandomPraise(praiseMessagesForJob),
      duration: 6000,
      type: "success",
    });
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
          <StepsItem
            key={task.id}
            index={taskIndex}
            title={task.name}
            description={
              task.startDate
                ? new Date(task.startDate).toLocaleDateString() // Dateオブジェクトに変換してからフォーマット
                : "" // startDateが未定義の場合は空文字
            }
          />
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

const praiseMessagesForStep = [
  "素晴らしい進捗だね！",
  "さすが！次のステップも楽しみ！",
  "一歩ずつ確実に進んでいるね！",
  "その調子！本当に頼りになる！",
  "更新ありがとう！最高だね！",
  "着実に進めていてすごい！",
  "努力が形になっているね！",
  "いいペースだね、感心するよ！",
  "見事なステップアップだね！",
  "細かいところまで気を配ってくれてありがとう！",
  "その集中力、尊敬するよ！",
  "次の目標もきっと達成できるよ！",
  "さすがの仕事ぶりだね！",
  "進捗が早くて驚きだよ！",
  "あなたの頑張りが伝わってくるよ！",
];

const praiseMessagesForJob = [
  "ジョブ完了おめでとう！本当にすごいね！",
  "お疲れ様でした！完璧な仕上がりだね！",
  "やり遂げたね、素晴らしい成果だよ！",
  "この結果、本当に感動したよ！",
  "最後までやり切る姿勢、尊敬するよ！",
  "最高の仕事だったね、お疲れ様！",
  "あなたのおかげで大成功だよ、ありがとう！",
  "完了おめでとうございます、見事でした！",
  "努力が報われた瞬間だね、素晴らしい！",
  "この結果はあなたの頑張りそのものだね！",
  "素晴らしい仕事ぶりだったよ、お疲れ様！",
  "期待以上の成果、本当にありがとう！",
  "最後まで諦めない姿勢がすごいね！",
  "一緒に働けて本当に良かったと思うよ、お疲れ様でした。",
  "完璧な仕上げ、本当にありがとう！",
];

export default TaskSteps;
