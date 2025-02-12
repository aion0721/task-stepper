import {
  Box,
  Card,
  ColorSwatch,
  Flex,
  Heading,
  Input,
  Link,
  Presence,
  Spacer,
  Status,
  Text,
} from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import { useJobs } from "@/context/JobContext";
import { useAccordion } from "@/context/AccordionContext";
import { JobStatus } from "@/types";
import {
  BiLinkExternal,
  BiMessageRoundedCheck,
  BiMessageRoundedDots,
  BiMessageRoundedError,
  BiNote,
} from "react-icons/bi";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";
import { useFilter } from "@/context/FilterContext";
import { Tooltip } from "../ui/tooltip";
import { useMemo } from "react";

const TaskStepper = () => {
  const { jobs } = useJobs();
  const { accordion, setAccordion } = useAccordion();
  const { setFilterText, filterText, filterStatus, sortOrder } = useFilter();

  const statusColorMap: { [key in JobStatus]?: string } = {
    COMPELETED: "gray",
    IN_PROGRESS: "green",
    PENDING: "orange",
  };

  // フィルタリングされたジョブリスト
  const filteredJobs = useMemo(() => {
    if (sortOrder === null) {
      // sortOrderがnullの場合はソートせずそのまま返す
      return jobs;
    }

    // sortOrderが"asc"または"desc"の場合にソート
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [jobs, sortOrder]);

  return (
    <>
      <Heading>Home</Heading>
      <Input
        my="10px"
        placeholder="ジョブ名でフィルター"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)} // フィルタ条件を更新
      />
      <AccordionRoot
        multiple
        value={accordion}
        onValueChange={(e) => setAccordion(e.value)}
        variant="enclosed"
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Presence
              key={job.id}
              present={
                job.name.includes(filterText) &&
                (filterStatus === "ALL" || job.status === filterStatus)
              } // 条件に応じてfalseに切り替える
              animationName={{
                _open: "fade-in",
                _closed: "fade-out",
              }}
              animationDuration="moderate"
            >
              <AccordionItem
                key={job.id}
                value={job.id}
                bg={{
                  base:
                    job.status === JobStatus.IN_PROGRESS
                      ? "green.100" // IN_PROGRESS の場合
                      : job.status === JobStatus.COMPLETED
                        ? "gray.100" // COMPLETE の場合
                        : "yellow.100", // PENDING の場合
                  _dark:
                    job.status === JobStatus.IN_PROGRESS
                      ? "green.500" // IN_PROGRESS の場合 (ダークモード)
                      : job.status === JobStatus.COMPLETED
                        ? "gray.700" // COMPLETE の場合 (ダークモード)
                        : "yellow.500", // PENDING の場合 (ダークモード)
                }}
                transition="background-color 0.3s ease-in-out" // 背景色のトランジション
              >
                <Box position="relative">
                  <AccordionItemTrigger>
                    <Status.Root
                      colorPalette={
                        statusColorMap[job?.status as JobStatus] || "red"
                      }
                    >
                      <Status.Indicator />
                    </Status.Root>
                    <Flex alignItems="center" gap={2}>
                      <ColorSwatch value={job.color} />
                      {job.status === JobStatus.IN_PROGRESS ? (
                        <BiMessageRoundedDots />
                      ) : job.status === JobStatus.COMPLETED ? (
                        <BiMessageRoundedCheck />
                      ) : (
                        <BiMessageRoundedError />
                      )}
                      <Text fontSize="sm">{job.name}</Text>
                    </Flex>
                    <Spacer />
                    <Text fontSize="sm">
                      {job.tasks &&
                      job.tasks[job.steps] &&
                      job.tasks[job.steps].name
                        ? `Next:${job.tasks[job.steps].name},`
                        : ""}
                      Date:{new Date(job.dueDate).toLocaleDateString()}
                    </Text>
                    <Tooltip content={job.memo}>
                      <BiNote />
                    </Tooltip>
                  </AccordionItemTrigger>
                </Box>
                <AccordionItemContent>
                  <Box
                    key={job.id}
                    py="10px"
                    paddingX="10px"
                    borderWidth="1px"
                    borderColor="border.disabled"
                    bg={{
                      base: "white",
                      _dark: "gray",
                    }}
                    borderRadius=""
                  >
                    <TaskSteps job={job} />
                    {job.memo && job.memo.length > 0 && (
                      <Card.Root m="10px">
                        <Card.Body
                          style={{ whiteSpace: "pre-wrap", lineHeight: "1.0" }}
                        >
                          {job.memo}
                        </Card.Body>
                      </Card.Root>
                    )}
                    {job.links && job.links.length > 0 && (
                      <Card.Root m="10px">
                        <Card.Body
                          style={{ whiteSpace: "pre-wrap", lineHeight: "1.0" }}
                        >
                          <Link href={job.links} target="_blank">
                            {job.links}
                            <BiLinkExternal />
                          </Link>
                        </Card.Body>
                      </Card.Root>
                    )}
                  </Box>
                </AccordionItemContent>
              </AccordionItem>
            </Presence>
          ))
        ) : (
          <Box>No tasks</Box>
        )}
      </AccordionRoot>
    </>
  );
};

export default TaskStepper;
