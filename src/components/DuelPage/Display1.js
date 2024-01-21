import { Button, ButtonGroup, Center, Flex, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-hot-toast';
import DataBase, { getUID } from '../../DataBase/DataBase';
import socket from '../../socket';
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const WaitBox = ({ id, playerNumber }) => {
    const [username, setUsername] = useState();
    const [joining, setJoining] = useState(false);
    const [joiningGuest, setJoiningGuest] = useState(false);
    const link = `http://localhost:3000/duel/${id}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        toast.success('The link is now in your clipboard.');
    };
    const handleJoin = async (e) => {
        e.preventDefault();
        setJoining(true);
        if (!username) {
            toast.error('Enter Username.');
            setJoining(false);
        }
        else {
            let uid = getUID();
            socket.emit('join-duel', {
                roomId: id,
                username: username,
                guest: false,
                uid: uid,
            });
            // setJoining(false);
        }
    }

    const handleJoinGuest = async (e) => {
        e.preventDefault();
        setJoining(true);

        let uid = getUID();
        socket.emit('join-duel', {
            roomId: id,
            username: 'GUEST2',
            guest: false,
            uid: uid,
        });
    }

    if (playerNumber) {
        return (
            <VStack>
                <Text my={0} height="100%">
                    Wait for someone to join, or invite them
                </Text>
                <InputGroup px={2}>
                    <Input
                        type="text"
                        value={`https://lockouts.netlify.app/duel/${id}`}
                        size="md"
                        textOverflow="ellipsis"
                        readOnly
                        borderColor="grey.100"
                        variant="outline"
                    />
                    <InputRightElement pr={4}>
                        <IconButton
                            variant="outline"
                            borderColor="grey.100"
                            icon={<MdContentCopy />}
                            onClick={copyToClipboard}
                        />
                    </InputRightElement>
                </InputGroup>
            </VStack>
        )
    }
    return (
        <VStack height="100%">
            <FormControl mx="auto" width="fit-content">
                <FormLabel my="auto">Username (optional)</FormLabel>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleJoin(e);
                    }}
                    borderColor="grey.100"
                    width="16em"
                    mt={1}
                />
            </FormControl>
            <ButtonGroup>
                <Button
                    onClick={handleJoin}
                    size="md"
                    loadingText="Joining"
                    isLoading={joining}
                    colorScheme="primary"
                    variant="solid"
                >
                    Join
                </Button>
                <Button
                    onClick={handleJoinGuest}
                    size="md"
                    loadingText="Joining"
                    // isLoading={joiningGuest}
                    colorScheme="primary"
                    variant="outline"
                >
                    Join as Guest
                </Button>
            </ButtonGroup>
        </VStack>
    )
}

const ReadyBox = ({ id, playerNumber }) => {
    const [ready, setReady] = useState(false);
    const [readyCount, setReadyCount] = useState(0);
    const handleReady = (e) => {
        e.preventDefault();
        let uid = getUID();
        socket.emit("player-ready", { roomId: id, uid: uid });
        setReady(true);
    };
    const handleUnready = (e) => {
        e.preventDefault();
        let uid = getUID();
        socket.emit("player-unready", { roomId: id, uid: uid });
        setReady(false);
    };

    useEffect(() => {
        const getReadiness = async () => {
            let duel = await DataBase.getDuelById(id);
            setReady(duel.playerReady[playerNumber - 1]);
            let readyCountFetched = 0;
            if (duel.playerReady[0]) readyCountFetched++;
            if (duel.playerReady[1]) readyCountFetched++;
            // console.log(readyCountFetched);
            setReadyCount(readyCountFetched);
        };
        if (playerNumber) getReadiness(playerNumber - 1);

        socket.on("player-ready-changed", async ({ roomId }) => {
            // console.log("RoomId: ", roomId, id, (roomId===id))
            if (roomId === id) await getReadiness(playerNumber - 1);
        });

        return () => {
            socket.off("player-ready-changed");
        };
    }, [setReadyCount]);

    if (playerNumber) {
        return (
            <Flex
                direction={'column'}
                align={'center'}
                gap={'1em'}
            >
                <Center gap={2}>
                    <IconButton
                        onClick={handleReady}
                        size="md"
                        colorScheme="green"
                        variant="solid"
                        boxSize="3em"
                        isDisabled={ready}
                        icon={<CheckIcon boxSize="2em" />}
                    />
                    <IconButton
                        onClick={handleUnready}
                        size="md"
                        colorScheme="red"
                        boxSize="3em"
                        isDisabled={!ready}
                        icon={<CloseIcon boxSize="1.5em" />}
                    />
                </Center>
                <Text fontSize="1.5rem">{readyCount}/2</Text>
            </Flex>
        )
    }
    return (
        <Center>
            <Text textAlign="center" textStyle="body2Semi">
                Duel is full.
            </Text>
        </Center>
    )
}

const TimeDisplay = ({ id }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        socket.on("time-left", ({ roomId, timeLeft }) => {
            // console.log("time-left", timeLeft);
            if (roomId === id && !Number.isNaN(timeLeft)) {
                setHours(Math.floor(timeLeft / 3600));
                setMinutes(Math.floor(timeLeft / 60) % 60);
                setSeconds(timeLeft % 60);
            }
        });

        return () => {
            socket.off("time-left");
        };
    }, []);

    return (
        <Text textAlign="center" textStyle="display2">
            {`${`${hours}`.padStart(2, "0") +
                ":" +
                `${minutes}`.padStart(2, "0") +
                ":" +
                `${seconds}`.padStart(2, "0")
                }`}
        </Text>
    );
};
const ResultDisplay = ({ id }) => {
    const [result, setResult] = useState();
    const [largeText, setLargeText] = useState(true);

    useEffect(() => {
        const getResult = async () => {
            let duel = await DataBase.getDuelById(id);
            let res = duel.result;
            // console.log(duel);
            if (res) {
                if (res[0] === "TIE") setResult("TIE");
                else if (res[0] === "ABORTED") setResult("ABORTED");
                else if (res[0] === "RESIGNED") {
                    setResult(
                        <>
                            {`${res[1]} WINS BY`}
                            <br />
                            {`RESIGNATION`}
                        </>
                    ); // Player who won, not the one who resigned
                    setLargeText(false);
                } else {
                    setResult(`${res[1]} WINS!`);
                    setLargeText(false);
                }
            }
        };
        getResult();
    }, []);
    return (
        <Center>
            <Text textAlign="center" textStyle={largeText ? "display3" : "body2Semi"}>
                {result}
            </Text>
        </Center>
    )
}
export const Display1 = ({
    id,
    statusOfDuel,
    players,
    playerNumber
}) => {
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const [heading, setHeading] = useState('');
    const [box, setBox] = useState(<>Loading</>);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (statusOfDuel === "FINISHED" || statusOfDuel === "ABORTED" || statusOfDuel === "RESIGNED") {
            setHeading("Result");
            setBox(<ResultDisplay id={id} />)
        }
        else if (statusOfDuel === "INITIALIZED") {
            if (playerNumber !== null) {
                setHeading("Ready to Start.");
            }
            else {
                setHeading("Duel Full");
            }
            setBox(<ReadyBox id={id} playerNumber={playerNumber} />)
        }
        else if (statusOfDuel === "ONGOING" || statusOfDuel === "READY") {
            setHeading("Time Left");
            setBox(<TimeDisplay id={id} />)
        }
        else {
            if (playerNumber !== null) {
                setHeading("Wait");
            }
            else {
                setHeading("Join")
            }
            setBox(<WaitBox id={id} playerNumber={playerNumber} />)
        }
        if (statusOfDuel !== "") {
            setLoading(false);
        }
    }, [statusOfDuel]);
    return (
        <TableContainer
            border="1px solid"
            borderColor={borderColor}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            width="22em"
            boxShadow="xl"
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th
                            textAlign={'center'}
                            fontSize={'1.2rem'}
                            py={2}
                            borderColor={'grey.500'}
                        >
                            {heading}
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {loading ?
                        <Tr>
                            <Skeleton height={'8em'} as={'td'} />
                        </Tr>
                        :
                        <Tr>
                            <Td px={1} py={1} height={'8em'}>
                                {box}
                            </Td>
                        </Tr>
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}
