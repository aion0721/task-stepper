import React from "react";
import { Flex, Heading, Icon } from "@chakra-ui/react";
import NewDialog from "../NewDialog";
import { GiStairsGoal } from "react-icons/gi";

const Header: React.FC = () => {
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

      {/* ボタン */}
      <NewDialog />
    </Flex>
  );
};

export default Header;
