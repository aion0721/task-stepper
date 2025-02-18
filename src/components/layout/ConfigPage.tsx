import {
  Box,
  ColorSwatch,
  Editable,
  Heading,
  IconButton,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { useConfig } from "@/context/ConfigContext";
import { appConfigDir } from "@tauri-apps/api/path";
import { useEffect, useState } from "react";

const ConfigPage = () => {
  const { legendColors, setLegendColors, userData } = useConfig();
  const [appDataPath, setAppDataPath] = useState<string>("");
  useEffect(() => {
    const fetchAppConfigDir = async () => {
      const appConfigDirPath = await appConfigDir();
      setAppDataPath(appConfigDirPath);
    };

    fetchAppConfigDir();
  }, []);
  return (
    <>
      <Heading>Config</Heading>
      <Box m="10px">
        <AccordionRoot collapsible defaultValue={["color"]}>
          <AccordionItem key="config" value="color">
            <AccordionItemTrigger>Color</AccordionItemTrigger>
            <AccordionItemContent>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Color</Table.ColumnHeader>
                    <Table.ColumnHeader>ColorName</Table.ColumnHeader>
                    <Table.ColumnHeader>Mean</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {legendColors.map((legendColor, index) => {
                    // legendColors から legendColor に一致するものを検索
                    return (
                      <Table.Row key={index}>
                        <Table.Cell w="20%">
                          <ColorSwatch value={legendColor.color} />
                        </Table.Cell>
                        <Table.Cell w="20%">{legendColor.color}</Table.Cell>
                        <Table.Cell w="60%">
                          <Editable.Root
                            value={legendColor.mean}
                            onValueChange={(newValue) => {
                              setLegendColors((prev) =>
                                prev.map(
                                  (p) =>
                                    p.color === legendColor.color
                                      ? { ...p, mean: newValue.value } // 新しい値で更新
                                      : p // 他の要素はそのまま
                                )
                              );
                            }}
                          >
                            <Editable.Preview />
                            <Editable.Input />
                            <Editable.Control>
                              <Editable.EditTrigger asChild>
                                <IconButton variant="ghost" size="xs">
                                  <LuPencilLine />
                                </IconButton>
                              </Editable.EditTrigger>
                              <Editable.CancelTrigger asChild>
                                <IconButton variant="outline" size="xs">
                                  <LuX />
                                </IconButton>
                              </Editable.CancelTrigger>
                              <Editable.SubmitTrigger asChild>
                                <IconButton variant="outline" size="xs">
                                  <LuCheck />
                                </IconButton>
                              </Editable.SubmitTrigger>
                            </Editable.Control>
                          </Editable.Root>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </AccordionItemContent>
          </AccordionItem>
          <AccordionItem key="config" value="UserData">
            <AccordionItemTrigger>UserData</AccordionItemTrigger>
            <AccordionItemContent>
              <Text>
                SavePath:
                {userData.dataBasePath || appDataPath}
              </Text>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Box>
    </>
  );
};

export default ConfigPage;
