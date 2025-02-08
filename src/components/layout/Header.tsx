import React, { useState } from "react";
import { Box, ColorSwatch, Flex, Heading, HStack } from "@chakra-ui/react";
import NewDialog from "../NewDialog";
import { GiStairsGoal } from "react-icons/gi";
import FilterDrawer from "../FilterDrawer";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { ColorModeButton } from "../ui/color-mode";
import { BiBook, BiCog, BiHome } from "react-icons/bi";
import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
} from "../ui/action-bar";
import { Checkbox } from "../ui/checkbox";
import { useConfig } from "@/context/ConfigContext";

const Header: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { legendColors } = useConfig();

  return (
    <Flex
      as="header"
      bg="teal.500"
      color="white"
      align="center"
      justify="space-between"
      padding={{ base: 4, md: 6 }}
      position="fixed" // 上に固定
      top={0} // 上端に配置
      left={0} // 左端に配置
      width="100%" // 横幅を全体に広げる
      zIndex={10} // 他の要素より前面に表示
      height="60px"
    >
      {/* ロゴ部分 */}
      <Flex align="center" gap={2}>
        <GiStairsGoal size="40px" />
        <Heading as="h1" size="lg">
          TaskStepper
        </Heading>
      </Flex>
      <Flex gap="4">
        <ChakraLink asChild>
          <RouterLink to="/">
            Home
            <BiHome />
          </RouterLink>
        </ChakraLink>
        <ChakraLink asChild>
          <RouterLink to="/template">
            Template
            <BiBook />
          </RouterLink>
        </ChakraLink>
        <ChakraLink asChild>
          <RouterLink to="/config">
            Config
            <BiCog />
          </RouterLink>
        </ChakraLink>
      </Flex>
      <HStack>
        <Checkbox
          checked={checked}
          onCheckedChange={(e) => setChecked(!!e.checked)}
        >
          色凡例
        </Checkbox>
        <ActionBarRoot
          open={checked}
          onOpenChange={(e) => setChecked(e.open)}
          closeOnInteractOutside={false}
        >
          <ActionBarContent key="action">
            <ActionBarCloseTrigger />
            {legendColors.map((legendColor) => (
              <Box key={legendColor.color}>
                <ColorSwatch
                  value={legendColor.color}
                  key={legendColor.color}
                />
                {legendColor.mean}
              </Box>
            ))}
          </ActionBarContent>
        </ActionBarRoot>
        {/* ボタン */}
        <NewDialog />
        <FilterDrawer />
        <ColorModeButton />
      </HStack>
    </Flex>
  );
};

export default Header;
