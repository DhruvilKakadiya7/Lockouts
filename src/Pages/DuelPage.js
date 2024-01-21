import React, { useEffect, useState } from 'react'
import { BaseLayout } from '../components/BaseLayout/BaseLayout'
import { useNavigate, useParams } from 'react-router-dom'
import DataBase, { getUID } from '../DataBase/DataBase';
import { Box, Flex, Grid, GridItem, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Display1 } from '../components/DuelPage/Display1';
import socket from '../socket';
import { toast } from 'react-hot-toast';
import { Display2 } from '../components/DuelPage/Display2';
import Display3 from '../components/DuelPage/Display3';
import { ProblemTab } from '../components/DuelPage/ProblemTab';
import CodeSubmitTab from '../components/DuelPage/CodeSubmitTab';
import { SubmissionsTab } from '../components/DuelPage/Submissions/SubmissionsTab';
const AllTabs = [
  {
    title: "Duel Info",
  },
  {
    title: "Problems",
  },
  {
    title: "Submit",
  },
  {
    title: "Submissions",
  }
];

const duelInfoTab = [
  {
    title: "Platform:",
    key: 'platform'
  },
  {
    title: "Time Limit:",
    key: 'timeLimit'
  },
  {
    title: "Difficulty:",
    key: 'difficulty'
  },
  {
    title: "Private:",
    key: 'isPrivate'
  },
  {
    title: "Status:",
    key: 'status'
  },
  {
    title: "Problem Count:",
    key: 'problemCount'
  },
]
const TabsLayout = ({
  id,
  statusOfDuel,
  problemDatas,
  playerNumber,
  mathJaxRendered,
  onMathJaxRendered,
  isVisitor,
  subRefresh,
  onSubRefresh
}) => {
  const borderColor = useColorModeValue(
    "rgb(0, 0, 0, 0.5)",
    "rgb(255, 255, 255, 0.5)"
  );
  const [index, setIndex] = useState(0);
  const [problemsCount, setProblemsCount] = useState(0);
  const [duelInfo, setDuelInfo] = useState(null);

  useEffect(() => {
    const getDuelInfo = async () => {
      let duel = await DataBase.getDuelById(id);
      setProblemsCount(duel.problemCount);
      setDuelInfo({
        platform: "CodeForces",
        players: duel.players,
        status: duel.status,
        timeLimit: `${duel.timeLimit} min`,
        ratingMin: duel.ratingMin,
        ratingMax: duel.ratingMax,
        private: duel.private,
        isPrivate: `${duel.private ? "Yes" : "No"}`,
        status: duel.status,
        problemCount: duel.problemCount,
        difficulty: `${duel.ratingMin}-${duel.ratingMax}`
      });
    }
    getDuelInfo();
    if (statusOfDuel === "ONGOING" || statusOfDuel === "INITIALIZED") {
      setIndex(1);
    }
  }, []);
  return (
    <Tabs
      variant={'line'}
      borderColor={borderColor}
      width={'47em'}
      colorScheme='primary'
      index={index}
      onChange={(index) => setIndex(index)}
    >
      <TabList>
        <Flex width={'100%'}>
          {AllTabs.map((obj, idx) => {
            return (
              <Tab
                flex={1}
                borderColor={borderColor}
                fontSize={'1.2rem'}
                key={idx}
              >
                {obj.title}
              </Tab>
            );

          })}
        </Flex>
      </TabList>
      <TabPanels
        border={'none'}
        width={'100%'}
      >
        <TabPanel>
          <Grid
            width={'100%'}
            height={'fit-content'}
            py={0}
            fontSize={'1.2rem'}
            templateColumns={'repeat(4, 1fr)'}
            rowGap={2}
          >
            {duelInfoTab.map((obj, idx) => {
              return (
                <>
                  <GridItem
                    flex={1}
                    borderColor={borderColor}
                    fontSize={'1.2rem'}
                    key={idx}
                    fontWeight={800}
                  >
                    {obj.title}
                  </GridItem>
                  <GridItem>
                    {duelInfo ? duelInfo[obj.key] : `N/A`}
                  </GridItem>
                </>

              );

            })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <ProblemTab
            id={id}
            statusOfDuel={statusOfDuel}
            problems={problemDatas}
            playerNumber={playerNumber}
            mathJaxRendered={mathJaxRendered}
            onMathJaxRendered={onMathJaxRendered}
          />
        </TabPanel>
        <TabPanel>
          <CodeSubmitTab
            key="stuck-editor"
            editorId="stuck-editor"
            statusOfDuel={statusOfDuel}
            duelId={id}
            problemsCount={problemDatas.length}
            problems={problemDatas}
            isVisitor={isVisitor}
          />
        </TabPanel>
        <TabPanel>
          <SubmissionsTab
            key={'submission-tab'}
            statusOfDuel={statusOfDuel}
            duelId={id}
            isVisitor={isVisitor}
            problems={problemDatas}
            refresh={subRefresh}
            onRefresh={onSubRefresh}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export const DuelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  const [statusOfDuel, setStatusOfDuel] = useState('');
  const [players, setPlayers] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [isvisitor, setVisitor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mathJaxRendered, setMathJaxRendered] = useState(false);
  const [subRefresh, setSubRefresh] = useState(false);
  const [scoresRefresh, setScoresRefresh] = useState(true);
  const [fetchProblems, setFetchProblems] = useState(true);
  const [problemDatas, setProblemDatas] = useState([]);
  useEffect(() => {
    const getDuelInfo = async () => {
      const duel = await DataBase.getDuelById(id);
      const uid = getUID();
      console.log("DUEL Page: ", duel);
      if (!duel) {
        navigate('/play');
      }
      if (statusOfDuel !== duel.status) {
        setStatusOfDuel(duel.status);
      }
      setPlayers(duel.players);
      let tempNumber;
      if (duel.players[0].uid === uid) {
        tempNumber = 1;
        setVisitor(false);
      }
      else if (duel.players[1] && duel.players[1].uid === uid) {
        tempNumber = 2;
        setVisitor(false);
      }
      else {
        setVisitor(true);
      }
      setPlayerNumber(tempNumber);
      if (fetchProblems) {
        let temp = [];
        for (let i = 0; i < duel.problems.length; i++) {
          const problem = await DataBase.findProblem(duel.problems[i].Id);
          temp.push(problem);
        }
        console.log(temp);
        setProblemDatas(temp);
        setFetchProblems(false);
        setSubRefresh(true);
      }
      setLoading(false);
    }
    if (refresh) {
      getDuelInfo();
      setRefresh(false);
    }

    socket.on('connect', async () => {
      socket.emit('join', { roomId: id });
    });

    socket.on("error-message", (message) => {
      toast.error(message);
      navigate('/play');
    });

    socket.on("status-change", ({ roomId, newStatus }) => {
      if (roomId === id) {
        setLoading(true);
        setMathJaxRendered(false);
        getDuelInfo();

        if (newStatus === "READY") {
          socket.emit('start-duel', { roomId });
        }
        if (newStatus === "ONGOING") {
          setFetchProblems(true);
          setRefresh(true);
        }
        if (newStatus === "FINISHED") {
          setRefresh(true);
        }
      }
    });

    socket.on('problem-accepted', ({ duelId, uid }) => {
      console.log("sock: ", duelId);
      if (duelId === id) {
        setSubRefresh(true);
      }
    });

    socket.on('problem-not-accepted', ({ duelId, uid }) => {
      if (duelId === id) {
        setSubRefresh(true);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("error-message");
      socket.off("status-change");
      socket.off('problem-accepted');
      socket.off('problem-not-accepted');
    };
  }, [id, isvisitor, setLoading, fetchProblems, subRefresh]) 

  return (
    <BaseLayout content={
      <Box>
        {loading ?
          <Flex
            position={'absolute'}
            top={0}
            left={0}
            justify={'center'}
            width={'100%'}
            height={'100%'}
            textAlign={'center'}
            zIndex={10}
            background="rgb(0, 0, 0, 0.6)"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              mt="50vh"
              emptyColor="grey.300"
              color="#43ff43"
              size="xl"
            />
          </Flex>
          : ""
        }
        <Flex
          justify={'space-between'}
          align={'flex-start'}
          transform={[null, null, 'scale(0.85)', 'none']}
          ml={[null, null, "-8.5em", "-3.5em", 0]}
          mt={[null, null, "-8.25em", "-3.25em", 0]}
          gap={[null, null, 2, null, null]}
        >
          <TabsLayout
            id={id}
            statusOfDuel={statusOfDuel}
            problemDatas={problemDatas}
            playerNumber={playerNumber}
            mathJaxRendered={mathJaxRendered}
            onMathJaxRendered={() => setMathJaxRendered(true)}
            isVisitor={isvisitor}
            subRefresh={subRefresh}
            onSubRefresh={() => setSubRefresh(false)}
          />
          <VStack>
            <Display1
              id={id}
              statusOfDuel={statusOfDuel}
              players={players}
              loading={loading}
              playerNumber={playerNumber}
            />
            {
              playerNumber &&
                statusOfDuel !== "FINISHED" &&
                statusOfDuel !== "ABORTED" ? (
                <Display2
                  id={id}
                  statusOfDuel={statusOfDuel}
                  players={players}
                  loading={loading}
                  playerNumber={playerNumber}
                />
              ) : (
                ""
              )
            }
            <Display3
              id={id}
              statusOfDuel={statusOfDuel}
              players={players}
              playerNumber={playerNumber}
              refresh={scoresRefresh}
              onRefresh={() => setScoresRefresh(false)}
            />
          </VStack>
        </Flex>
      </Box >
    } />

  )
}
