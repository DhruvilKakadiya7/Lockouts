import { Box, Flex, Grid, GridItem, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import DataBase, { getUID } from '../../DataBase/DataBase';
import socket from '../../socket';

const Display3 = ({
    id,
    statusOfDuel,
    players,
    playerNumber,
    refresh,
    onRefresh
}) => {
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const [playerScores, setPlayerScores] = useState([]);
    const [problemScores, setProblemScores] = useState([]);
    const problemScoreColor = useColorModeValue("primary.500", "primary.200");
    const [loading, setLoading] = useState(true);
    const [refresh2, setRefresh2] = useState(true);
    useEffect(() => {
        const updateScore = async () => {
            let duel = await DataBase.getDuelById(id);
            if (duel.players?.length === 2) {
                setPlayerScores([duel.playerOneScore, duel.playerTwoScore]);
            } else if (duel.players?.length === 1) {
                setPlayerScores([duel.playerOneScore, 0]);
            } else {
                setPlayerScores([0, 0]);
            }
            setProblemScores(
                duel.problems.map((problem) => [
                    problem.playerOneScore,
                    problem.playerTwoScore,
                ])
            );
        }
        if (refresh || refresh2) {
            updateScore();
            onRefresh();
            setRefresh2(false);
        }
    }, [refresh2])

    useEffect(() => {
        if (statusOfDuel !== "") setLoading(false);
    }, [statusOfDuel]);

    useEffect(()=>{
        socket.on('problem-accepted-2', async ({duelId, uid})=>{
            if(id == duelId) {
                setRefresh2(true);
            }
        })
    },[]);

    return (
        <TableContainer
            width={'22em'}
            height={'fit-content'}
            boxShadow={'2xl'}
            border={'1px solid'}
            borderColor={borderColor}
            borderTopRightRadius={'md'}
            borderTopLeftRadius={'md'}
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th
                            textAlign={'center'}
                            fontSize={'1.2rem'}
                            py={2}
                        >
                            Scores
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {loading ? <Tr>
                        <Skeleton height="30em">
                            <Td px={1} py={1} height="30em"></Td>
                        </Skeleton>
                    </Tr> :
                        <>
                            <Tr>
                                <Td
                                    height={'15em'}
                                    borderColor={'grey.100'}
                                >
                                    <Grid
                                        rowGap={1}
                                        columnGap={0}
                                        templateColumns={'repeat(2,1fr)'}
                                    >
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                Player 1
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                Score
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textAlign="center"
                                                fontWeight="bold"
                                                fontStyle={players[0].guest ? "italic" : ""}
                                            >
                                                {players[0].handle}
                                            </Text>
                                            {playerNumber === 1 ? (
                                                <Text textAlign="center" fontWeight="bold">
                                                    {" "}
                                                    (YOU)
                                                </Text>
                                            ) : (
                                                ""
                                            )}
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                {playerScores[0]}
                                            </Text>
                                        </GridItem>
                                        <GridItem
                                            colSpan={2}
                                        >
                                            <Flex
                                                columnGap={2}
                                                rowGap={0}
                                                justify={'center'}
                                                width={'100%'}
                                                direction={'row'}
                                                alignItems={'center'}
                                                mt={2}
                                            >
                                                {problemScores?.map((prob, idx) => {
                                                    if (idx >= 5) {
                                                        return (
                                                            ""
                                                        )
                                                    }
                                                    return (
                                                        <VStack
                                                            rowGap={0}
                                                            key={idx}
                                                        >
                                                            <Flex
                                                                border={'1px solid'}
                                                                borderColor={borderColor}
                                                                height={'3rem'}
                                                                width={'3rem'}
                                                                textAlign={'center'}
                                                                alignItems={'center'}
                                                                justify={'center'}
                                                                borderRadius={'md'}
                                                                color={'primary.500'}
                                                                fontSize={'1.1rem'}
                                                            >
                                                                {prob[0]}
                                                            </Flex>
                                                            <Flex>
                                                                {String.fromCharCode(65 + idx)}
                                                            </Flex>
                                                        </VStack>
                                                    );
                                                })}
                                            </Flex>
                                        </GridItem>
                                        <GridItem
                                            colSpan={2}
                                        >
                                            <Flex
                                                columnGap={2}
                                                rowGap={0}
                                                justify={'center'}
                                                width={'100%'}
                                                direction={'row'}
                                                alignItems={'center'}
                                            >
                                                {problemScores?.map((prob, idx) => {
                                                    if (idx < 5) {
                                                        return (
                                                            ""
                                                        )
                                                    }
                                                    return (
                                                        <VStack
                                                            rowGap={0}
                                                            key={idx}
                                                        >
                                                            <Flex
                                                                border={'1px solid'}
                                                                borderColor={borderColor}
                                                                height={'3rem'}
                                                                width={'3rem'}
                                                                textAlign={'center'}
                                                                alignItems={'center'}
                                                                justify={'center'}
                                                                borderRadius={'md'}
                                                                color={'primary.500'}
                                                                fontSize={'1.1rem'}
                                                            >
                                                                {prob[0]}
                                                            </Flex>
                                                            <Flex>
                                                                {String.fromCharCode(65 + idx)}
                                                            </Flex>
                                                        </VStack>
                                                    );
                                                })}
                                            </Flex>
                                        </GridItem>
                                    </Grid>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td
                                    height={'15em'}
                                    borderColor={'grey.100'}
                                >
                                    <Grid
                                        rowGap={1}
                                        columnGap={0}
                                        templateColumns={'repeat(2,1fr)'}
                                    >
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                Player 2
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                Score
                                            </Text>
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textAlign="center"
                                                fontWeight="bold"
                                                // fontStyle={players[1].guest ? "italic" : ""}
                                            >
                                                {players[1]? players[1].handle : "N/A"}
                                            </Text>
                                            {playerNumber === 2 ? (
                                                <Text textAlign="center" fontWeight="bold">
                                                    {" "}
                                                    (YOU)
                                                </Text>
                                            ) : (
                                                ""
                                            )}
                                        </GridItem>
                                        <GridItem>
                                            <Text
                                                textStyle={'body3'}
                                                textAlign={'center'}
                                            >
                                                {playerScores[1]}
                                            </Text>
                                        </GridItem>
                                        <GridItem
                                            colSpan={2}
                                        >
                                            <Flex
                                                columnGap={2}
                                                rowGap={0}
                                                justify={'center'}
                                                width={'100%'}
                                                direction={'row'}
                                                alignItems={'center'}
                                                mt={2}
                                            >
                                                {problemScores?.map((prob, idx) => {
                                                    if (idx >= 5) {
                                                        return (
                                                            ""
                                                        )
                                                    }
                                                    return (
                                                        <VStack
                                                            rowGap={0}
                                                            key={idx}
                                                        >
                                                            <Flex
                                                                border={'1px solid'}
                                                                borderColor={borderColor}
                                                                height={'3rem'}
                                                                width={'3rem'}
                                                                textAlign={'center'}
                                                                alignItems={'center'}
                                                                justify={'center'}
                                                                borderRadius={'md'}
                                                                color={'primary.500'}
                                                                fontSize={'1.1rem'}
                                                            >
                                                                {prob[1]}
                                                            </Flex>
                                                            <Flex>
                                                                {String.fromCharCode(65 + idx)}
                                                            </Flex>
                                                        </VStack>
                                                    );
                                                })}
                                            </Flex>
                                        </GridItem>
                                        <GridItem
                                            colSpan={2}
                                        >
                                            <Flex
                                                columnGap={2}
                                                rowGap={0}
                                                justify={'center'}
                                                width={'100%'}
                                                direction={'row'}
                                                alignItems={'center'}
                                            >
                                                {problemScores?.map((prob, idx) => {
                                                    if (idx < 5) {
                                                        return (
                                                            ""
                                                        )
                                                    }
                                                    return (
                                                        <VStack
                                                            rowGap={0}
                                                            key={idx}
                                                        >
                                                            <Flex
                                                                border={'1px solid'}
                                                                borderColor={borderColor}
                                                                height={'3rem'}
                                                                width={'3rem'}
                                                                textAlign={'center'}
                                                                alignItems={'center'}
                                                                justify={'center'}
                                                                borderRadius={'md'}
                                                                color={'primary.500'}
                                                                fontSize={'1.1rem'}
                                                            >
                                                                {prob[1]}
                                                            </Flex>
                                                            <Flex>
                                                                {String.fromCharCode(65 + idx)}
                                                            </Flex>
                                                        </VStack>
                                                    );
                                                })}
                                            </Flex>
                                        </GridItem>
                                    </Grid>
                                </Td>
                            </Tr>
                        </>
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default Display3;
