import { Heading, Button, Center, Stack, Text } from "@chakra-ui/react";
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
import Header from "./layout/Header";
import { BiFilter } from "react-icons/bi";
const FilterDrawer = () => {
  const { jobs } = useJobs();
  const { setAccordion } = useAccordion();
  const jobAllIds = jobs.map((job) => job.id);
  const inProgressJobIds = jobs
    .filter((job) => job.status === "IN_PROGRESS") // IN_PROGRESSのジョブをフィルタリング
    .map((job) => job.id); // IDのみ抽出

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
