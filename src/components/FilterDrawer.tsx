import { Heading, Button, Center, Stack, Input } from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useAccordion } from "@/context/AccordionContext";
import { useJobs } from "@/context/JobContext";
import { BiFilter } from "react-icons/bi";
import { useFilter } from "@/context/FilterContext";
import { JobStatus } from "@/types";

const FilterDrawer = () => {
  const { jobs } = useJobs();
  const { setAccordion } = useAccordion();
  const jobAllIds = jobs.map((job) => job.id);
  const inProgressJobIds = jobs
    .filter((job) => job.status === "IN_PROGRESS") // IN_PROGRESSのジョブをフィルタリング
    .map((job) => job.id); // IDのみ抽出

  const { filterText, setFilterText, setFilterStatus, setSortOrder } =
    useFilter();

  return (
    <DrawerRoot>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button colorPalette="green" variant="surface">
          Filter
          <BiFilter />
        </Button>
      </DrawerTrigger>
      <DrawerContent offset="4" rounded="sm">
        <DrawerHeader>
          <DrawerTitle>FilterMenu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Stack>
            <Center>
              <Heading>Filter</Heading>
            </Center>
            <Input
              type="text"
              placeholder="ジョブ名でフィルター"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Button onClick={() => setFilterStatus(JobStatus.COMPLETED)}>
              完了に絞る
            </Button>
            <Button onClick={() => setFilterStatus(JobStatus.IN_PROGRESS)}>
              仕掛中に絞る
            </Button>
            <Button onClick={() => setFilterStatus("ALL")}>全量表示</Button>
            <Button
              onClick={() => {
                setFilterText("");
                setFilterStatus("ALL");
              }}
            >
              フィルタクリア
            </Button>
          </Stack>
          <Stack>
            <Center>
              <Heading>Sort</Heading>
            </Center>
            <Button onClick={() => setSortOrder("asc")}>古いもの順</Button>
            <Button onClick={() => setSortOrder("desc")}>新しいもの順</Button>
          </Stack>
          <Stack>
            <Center>
              <Heading>表示切り替え</Heading>
            </Center>
            <Button
              colorPalette="green"
              onClick={() => setAccordion(inProgressJobIds)}
            >
              仕掛中のものを開く
            </Button>
            <Button onClick={() => setAccordion([])}>全て閉じる</Button>
            <Button colorPalette="blue" onClick={() => setAccordion(jobAllIds)}>
              全て開く
            </Button>
          </Stack>
          <DrawerCloseTrigger />
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default FilterDrawer;
