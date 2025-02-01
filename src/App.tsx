import { useState } from "react";
import { NewJob, Job, TaskStatus } from "./types";

function App() {
  const [job, setJob] = useState<Job>();
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
    const newJobData: NewJob = {
      name: "Example Job", // ジョブ名
      dueDate: new Date("2023-12-31"), // 期日
      tasks: [
        { name: "Task 1", status: TaskStatus.NOT_STARTED }, // タスク1
        { name: "Task 2", status: TaskStatus.IN_PROGRESS }, // タスク2
      ],
    };

    const tempJob = createJob(newJobData); // `createJob`で新しいジョブを作成
    setJob(tempJob); // 作成したジョブを状態にセット
  };

  return (
    <main className="container">
      <button onClick={addJob}>addJob</button>
      Hello, tauri!
      {job && (
        <div>
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
      )}
    </main>
  );
}

export default App;
