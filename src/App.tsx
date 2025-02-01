import { useRef, useState } from "react";
import { NewJob, Job, TaskStatus } from "./types";
import { Button, Input } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Toaster, toaster } from "@/components/ui/toaster";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobNameRef = useRef<HTMLInputElement>(null);
  const jobDateRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const createJob = (newJobData: NewJob): Job => {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      ...newJobData,
      tasks: newJobData.tasks.map((task) => ({
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        status: task.status || TaskStatus.NOT_STARTED,
      })),
      createdAt: now,
      updatedAt: now,
    };
  };

  // 新しいジョブを作成して状態にセット
  const addJob = () => {
    const jobName = jobNameRef.current?.value ?? "";
    const jobDate = jobDateRef.current?.value;
    const newJobData: NewJob = {
      name: jobName, // ジョブ名
      dueDate: jobDate ? new Date(jobDate) : new Date(), // 期日
      tasks: [
        { name: "Task 1", status: TaskStatus.NOT_STARTED }, // タスク1
        { name: "Task 2", status: TaskStatus.IN_PROGRESS }, // タスク2
      ],
    };

    const newJob = createJob(newJobData); // `createJob`で新しいジョブを作成
    setJobs((prevJobs) => [...prevJobs, newJob]);
    setOpen(false);

    toaster.create({
      title: "ジョブが作成されました！",
      type: "success",
    });
  };

  return (
    <>
      <Toaster />
      <Button onClick={addJob}>addJob</Button>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Job</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Input placeholder="Job name" ref={jobNameRef} />
            <Input type="date" ref={jobDateRef} />
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button onClick={addJob}>Save</Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} style={{ marginBottom: "20px" }}>
            <h2>Job ID: {job.id}</h2>
            <p>Job Name: {job.name}</p>
            <p>Due Date: {job.dueDate.toLocaleDateString()}</p>
            <h3>Tasks:</h3>
            <ul>
              {job.tasks.map((task) => (
                <li key={task.id}>
                  {task.name} - Status: {task.status}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </>
  );
}

export default App;
