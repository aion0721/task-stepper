import React from "react";
import { Box } from "@chakra-ui/react";
import { useJobs } from "@/context/JobContext";
import { JobStatus } from "@/types";
import {
  BiAward,
  BiCabinet,
  BiHappy,
  BiHappyAlt,
  BiHappyBeaming,
  BiHappyHeartEyes,
  BiMedal,
  BiMeh,
  BiSad,
  BiSmile,
} from "react-icons/bi";

const Footer: React.FC = () => {
  const { jobs } = useJobs();

  // JSTの日付範囲を取得するユーティリティ関数
  const getDateRange = (): { startDate: Date; endDate: Date } => {
    const now = new Date();

    const todayStartJST = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayEndJST = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    return {
      startDate: new Date(todayStartJST.getTime()),
      endDate: new Date(todayEndJST.getTime()),
    };
  };

  // 日付範囲を取得
  const { startDate, endDate } = getDateRange();

  // フィルタリング用の共通関数
  const filterJobsByDate = (
    job: (typeof jobs)[number],
    status?: JobStatus
  ): boolean => {
    const updatedAtDate = new Date(job.updatedAt);
    const isWithinDateRange =
      updatedAtDate >= startDate && updatedAtDate < endDate;

    if (status) {
      return job.status === status && isWithinDateRange;
    }
    return isWithinDateRange;
  };

  // 今日更新されたジョブの件数
  const todayUpdated = jobs.filter((job) => filterJobsByDate(job)).length;

  // 今日COMPLETEDになったジョブの件数
  const todayCompleted = jobs.filter((job) =>
    filterJobsByDate(job, JobStatus.COMPLETED)
  ).length;

  // IN_PROGRESSのジョブと今日COMPLETEDになったジョブの積集合（今日やるべきだった数）
  const todayTotal = jobs.filter((job) => {
    if (job.status === JobStatus.IN_PROGRESS) return true;
    return filterJobsByDate(job, JobStatus.COMPLETED);
  }).length;

  const getUpdatedIcon = (
    todayUpdated: number,
    todayTotal: number
  ): JSX.Element => {
    if (todayTotal === 0) {
      return <BiMeh />; // 総数が0の場合はデフォルトアイコン
    }

    const percentage = (todayUpdated / todayTotal) * 100;

    if (percentage <= 10) return <BiSad />;
    if (percentage <= 25) return <BiMeh />;
    if (percentage <= 40) return <BiSmile />;
    if (percentage <= 55) return <BiHappy />;
    if (percentage <= 70) return <BiHappyAlt />;
    if (percentage <= 85) return <BiHappyBeaming />;

    return <BiHappyHeartEyes />; // 割合が85%以上の場合
  };

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      width="100%"
      bg="teal.500"
      textAlign="center"
      py="10px"
      height="40px" // 明示的な高さ指定
      display="flex" // Flexboxを有効化
      justifyContent="center" // 水平方向の中央揃え
      alignItems="center" // 垂直方向の中央揃え
    >
      [Today Result] Total
      <BiCabinet />
      {todayTotal} | Updated
      {getUpdatedIcon(todayUpdated, todayTotal)}
      {todayUpdated} | Completed
      <BiMedal />
      {todayCompleted}
      {Array.from({ length: todayCompleted }, (_, index) => (
        <BiAward key={index} />
      ))}
    </Box>
  );
};

export default Footer;
