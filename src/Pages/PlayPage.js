import React, { useEffect, useMemo, useState } from 'react'
import { BaseLayout } from '../components/BaseLayout/BaseLayout'
import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import { DuelForm } from '../components/PlayPage/DuelForm'
import DataBase, { getUID } from '../DataBase/DataBase'
import { useNavigate } from 'react-router-dom'
import PlayInfo from '../components/PlayPage/PlayInfo'
import { DuelsInfo } from '../components/PlayPage/DuelsInfo'
const InADuelAlert = ({ duelLink }) => {
    const navigate = useNavigate();
    const [navigating, setNavigating] = useState(false);
    const backgroundColor = useColorModeValue("#ffa987", "");

    return (

        <Alert
            width={["19em", "25em", "45em", "60em", "72em"]}
            height={[null, null, "3em", "4em"]}
            status="warning"
            variant="left-accent"
            backgroundColor={backgroundColor}
        >
            <AlertIcon />
            <AlertTitle>You are currently in a duel!</AlertTitle>
            <Button
                variant="solid"
                colorScheme="primary"
                isLoading={navigating}
                ml={5}
                transform={[null, "scale(0.9)", null, "none"]}
                onClick={() => {
                    setNavigating(true);
                    window.location.href = duelLink;
                }}
            >
                Return
            </Button>
        </Alert>
    );
};

export const PlayPage = () => {
    const [refresh, setRefresh] = useState(true);
    const [userInDuel, setUserInDuel] = useState(false);
    const [currentDuelLink, setCurrentDuelLink] = useState(null);
    const [duels, setDuels] = useState([]);
    const [duelCount, setDuelCount] = useState({});
    useEffect(() => {
        const checkInDuel = async () => {
            const res = await DataBase.checkInDuel();
            console.log(res);
            if (res.inDuel) {
                setUserInDuel(true);
                setCurrentDuelLink(`duel/${res.url}`);
            }
        }
        const getallDuels = async () => {
            let duels = await DataBase.getAllDuels();
            let duelCounterInfoUpdate = { active: 0, ongoing: 0, waiting: 0, initialized: 0 };
            console.log(duels?.length);
            if (duels?.length) {
                setDuels(duels);
                console.log("duel", duels);
                console.log(duels.filter(duel => duel.status !== "FINISHED" && duel.status !== "ABORTED" && duel.status !== "RESIGNED").length);
                console.log(duels.filter(duel => duel.status === "WAITING"));
                console.log(duels.filter(duel => duel.status === "INITIALIZED"));
                console.log(duels.filter(duel => duel.status === "ONGOING"));
                duelCounterInfoUpdate.active = duels.filter(duel => duel.status !== "FINISHED" && duel.status !== "ABORTED" && duel.status !== "RESIGNED").length;
                duelCounterInfoUpdate.waiting = duels.filter(duel => duel.status === "WAITING").length;
                duelCounterInfoUpdate.initialized = duels.filter(duel => duel.status === "INITIALIZED").length;
                duelCounterInfoUpdate.ongoing = duels.filter(duel => duel.status === "ONGOING").length;
            }
            console.log(duelCounterInfoUpdate);
            setDuelCount(duelCounterInfoUpdate);
        }
        if (refresh) {
            checkInDuel();
            getallDuels();
            setRefresh(false);
        }
    }, [refresh, userInDuel]);
    

    return (
        <BaseLayout
            content={
                <Flex
                    direction={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    {
                        userInDuel ?
                            <InADuelAlert duelLink={currentDuelLink} /> : ""
                    }
                    <Text
                        fontSize={['1.5rem', '3.2rem']}
                        fontWeight={800}
                        textAlign={'center'}
                        mt={1}
                    >
                        {`Create `}
                        <Text as={'span'} color={'blue'}>
                            Duel
                        </Text>
                    </Text>
                    <DuelForm duelCount={duelCount}/>
                    <DuelsInfo duelCount={duelCount} />
                    <PlayInfo />
                </Flex>
            }
        />
    )
}
