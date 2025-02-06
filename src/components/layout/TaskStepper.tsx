import {
  Box,
  Card,
  ColorSwatch,
  Input,
  Link,
  Presence,
  Spacer,
  Status,
} from "@chakra-ui/react";
import TaskSteps from "../TaskSteps";
import { useJobs } from "@/context/JobContext";
import { useAccordion } from "@/context/AccordionContext";
import { JobStatus } from "@/types";
import { BiLinkExternal, BiNote } from "react-icons/bi";
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
    <Box mt="60px" height="calc(100vh - 80px)" as="main" px="20px">
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
                    job.status === JobStatus.IN_PROGRESS ? "green.100" : "gray", // ライトモード
                  _dark:
                    job.status === JobStatus.IN_PROGRESS ? "green" : "gray.600", // ダークモード
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
                    <ColorSwatch value={job.color} />
                    {job.name}
                    <Spacer />
                    {job.tasks &&
                    job.tasks[job.steps] &&
                    job.tasks[job.steps].name
                      ? `Next:${job.tasks[job.steps].name},`
                      : ""}
                    Date:{new Date(job.dueDate).toLocaleDateString()}
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
    </Box>
  );
};

export default TaskStepper;
