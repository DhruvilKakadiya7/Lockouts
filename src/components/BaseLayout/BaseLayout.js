import { useTheme } from '@emotion/react'
import React from 'react'
import {

    useMediaQuery,
    createTheme,
    ThemeProvider,
    ImageList,
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import { Flex, Link, Box, HStack, IconButton, Image, Text, useColorMode, Center, Drawer, DrawerContent, DrawerBody, Switch, ListItem, DrawerOverlay, DrawerHeader, List, useDisclosure } from '@chakra-ui/react'
import LightLogo from "../../media/logo.svg";
import DarkLogo from "../../media/logo2.svg";
import { WiDaySunny } from "react-icons/wi";
import { IoMoon, IoClose } from "react-icons/io5";
import { HiMenuAlt4 } from "react-icons/hi";
const BaseNavBar = () => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

    return (
        <Box
            display={'flex'}
            width={'100%'}
            mt={'1'}
            justifyContent={'space-between'}
            alignItems={'center'}
            px={2}
            pt={2}
            height={'4.5em'}
        >
            <Image
                aria-label="CPDuels logo"
                src={colorMode === "light" ? LightLogo : DarkLogo}
                w="10em"
                h="auto"
                cursor="pointer"
            />
            <HStack
                fontSize="1.5rem"
                fontWeight="800"
                spacing="1.5em"
                width="fit-content"
            >
                <Link
                    sx={{
                        textDecoration: "none",
                    }}
                    color={colorMode === "light" ? '#nnn' : '#fff'}
                    href="/play"
                >
                    Play
                </Link>
                <Link
                    sx={{
                        textDecoration: "none",
                    }}
                    color={colorMode === "light" ? '#nnn' : '#fff'}
                    href="/duels"
                >
                    Duels
                </Link>
                <Link
                    sx={{
                        textDecoration: "none",
                    }}
                    color={colorMode === "light" ? '#nnn' : '#fff'}
                    href="/contact"
                >
                    Contact Us
                </Link>
            </HStack>
        </Box>
    )
}
const HamburgerMenu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
      <>
        <IconButton
          variant="unstyled"
          icon={<HiMenuAlt4 size={45} />}
          onClick={onOpen}
        />
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Flex justify="space-between">
                <Text textAlign="center" textStyle="body1Semi">
                  Menu
                </Text>
                <IconButton
                  my="auto"
                  variant="unstyled"
                  icon={<IoClose size={36} />}
                  onClick={onClose}
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              <List
                fontSize="1.4rem"
                listStylePos="inside"
                pl={0}
                pb={2}
                spacing={2}
                borderBottom="1px solid"
                borderColor="gray"
              >
                <ListItem mx={0}>
                  <Link  _hover={{ textDecoration: "none" }} to="/">
                    Home
                  </Link>
                </ListItem>
                <ListItem mx={0}>
                  <Link
                    
                    sx={{ textDecoration: "none" }}
                    href="/play"
                  >
                    Play
                  </Link>
                </ListItem>
                <ListItem mx={0}>
                  <Link
                    
                    sx={{ textDecoration: "none" }}
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </ListItem>
              </List>
              {/* <Box mt={3}>
                <Text fontSize="1.4rem" as="span" mr={3}>
                  {colorMode[0].toUpperCase() + colorMode.substring(1)} Mode
                </Text>
                <Switch
                  size="lg"
                  colorScheme="primary"
                  defaultChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                />
              </Box> */}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  };
const MobileBaseNavbar = () => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const navigateHome = () => navigate("/");
  
    return (
      <Flex justify="space-between" align="center" mt={1} mx={0}>
        <Image
          aria-label="CPDuels logo"
          src={colorMode === "light" ? LightLogo : DarkLogo}
          w="10em"
          h="auto"
          mt={1}
          cursor="pointer"
          onClick={navigateHome}
        />
        <HamburgerMenu />
      </Flex>
    );
  };
const BaseContainer = ({ content }) => {
    return <Box mt={2}>{content}</Box>;
};

const BaseFooter = () => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    return (
        <Flex width="100%" justify="center" pt={5} pb={1}>
            <Text fontSize={["sm", "md"]} mb={4} align="center" mx="auto">
                Developed by{" "}
                <Link
                    as="a"
                    fontWeight="bold"
                    color={colorMode === "light" ? "primary.500" : "primary.300"}
                    cursor="pointer"
                    href="https://github.com/DhruvilKakadiya7"
                >
                    Dhruvil Kakadiya
                </Link>
            </Text>
        </Flex>
    );
};
const ToggleColorMode = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box
            position="fixed"
            bottom={["1", "2", "3", "4", "5"]}
            right={["1", "2", "3", "4", "5"]}
            zIndex={1000}
        >

            <IconButton
                variant="outline"
                colorScheme={colorMode === "dark" ? "orange" : "white"}
                boxSize={["3rem", "4rem"]}
                size={["3rem", "4rem"]}
                icon={
                    colorMode === "dark" ? (
                        <WiDaySunny size={50} />
                    ) : (
                        <IoMoon size={50} style={{ transform: "rotate(270deg)" }} />
                    )
                }
                onClick={toggleColorMode}
                isRound
            />
        </Box>
    );
};
export const BaseLayout = ({ content }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width: 540px)");
    // console.log("isMobile:", isMobile);

    return (
        <Center>
            <Box
                width={['312px', '472px', '760px', '984px', '1150px']}
                m={0}
                p={0}
                // border="1px solid black"
            >
                {/* <BaseNavBar /> */}
                {isMobile ? <MobileBaseNavbar /> : <BaseNavBar />}
                <BaseContainer content={content}/>
                <BaseFooter />
                {/* {isMobile ? "" : <ToggleColorMode/>} */}
            </Box>
        </Center>
    )
}
