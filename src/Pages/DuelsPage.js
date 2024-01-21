import React, { useEffect, useMemo, useState } from 'react'
import { BaseLayout } from '../components/BaseLayout/BaseLayout'
import { Flex, Tab, Tabs, TabList, TabPanel, TabPanels, VStack, Box, Button, Center } from '@chakra-ui/react'
import DataBase from '../DataBase/DataBase';
import { AvailableDuels } from '../components/DuelsPage/AvailableDuels/AvailableDuels';
import { OngoingDuels } from '../components/DuelsPage/OngoingDuels/OngoingDuels';
import { PastDuels } from '../components/DuelsPage/PastDuels/PastDuels';

export const DuelsPage = () => {
    const [availableDuels, setAvailableDuels] = useState([]);
    const [ongoingDuels, setOngoingDuelss] = useState([]);
    const [pastDuels, setPastDuels] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
            const duels = await DataBase.getAllDuels();
            if (duels?.length) {
                let avail = duels.filter(duel => duel.status === "WAITING" && duel.private === false);
                let active = duels.filter(duel => (duel.status === "INITIALIZED" || duel.status === "ONGOING") && duel.private === false);
                let past = duels.filter(duel => (duel.status === "FINISHED" || duel.status === "RESIGNED") && duel.private === false);
                for (let i = 0; i < avail.length; i++) {
                    avail[i]['handle'] = avail[i].players[0].handle;
                    avail[i]['difficulty'] = `${avail[i].ratingMin}-${avail[i].ratingMax}`;
                    avail[i]['problems'] = avail[i].problemCount
                    avail[i]['timelimit'] = avail[i].timeLimit;
                }
                avail.reverse();
                console.log(avail, avail.length);
                while(avail.length < 10) {
                    const dummy = {
                        handle: '0ecae3d1-6cda-483f-a3d8-c57b32b4eab1',
                        difficulty: 'dummy',
                        problems: '1',
                        timeLimit: '1'
                    }
                    avail.push(dummy);
                }
                console.log(avail);
                for (let i = 0; i < active.length; i++) {
                    active[i]['usernames'] = `${active[i].players[0].handle} v ${active[i].players[1].handle}`;
                    let currTime = new Date();
                    active[i]['timeleft'] = `${active[i].timeLimit - Math.floor((currTime - active[i].startTime) / (1000 * 60))} min`;
                }
                active.reverse();
                // 52f03a32-b6e2-4514-bd66-a057b4e513c8
                while(active.length < 10) {
                    const dummy = {
                        usernames: '52f03a32-b6e2-4514-bd66-a057b4e513c8',
                        timeleft: '1 min',
                    }
                    active.push(dummy);
                }
                console.log(active);
                for (let i = 0; i < past.length; i++) {
                    past[i]['usernames'] = `${past[i].players[0].handle} v ${past[i].players[1].handle}`;
                    let currTime = new Date();
                    past[i]['winner'] = `TIE`;
                    if (past[i].result[0] != 'TIE') {
                        past[i]['winner'] = past[i].result[1];
                    }
                }
                past.reverse();
                console.log(past);
                // 9d7909ec-4843-488e-a726-a9146fc9e462
                while(past.length < 10) {
                    const dummy = {
                        usernames: '9d7909ec-4843-488e-a726-a9146fc9e462',
                        winner: 'xxx',
                    }
                    past.push(dummy);
                }
                setAvailableDuels(avail);
                setOngoingDuelss(active);
                setPastDuels(past);
            }
            setLoading(false);
        }
        if (refresh) {
            getData();
            setRefresh(false);
        }
    }, [refresh]);

    const handleRefresh = (e)=>{
        e.preventDefault();
        setLoading(true)
        setRefresh(true);
    }
    return (
        <BaseLayout content={
            <Box width={'100%'}>
                <Center>
                    <Button
                        onClick={handleRefresh}
                        isLoading = {loading}
                        variant="solid"
                        colorScheme="primary"
                    >
                        {`↻`}
                    </Button>
                </Center>
                <Tabs
                    isFitted
                    variant='enclosed'
                    borderColor={'blue'}
                    mt={3}
                >
                    <TabList mb='1em'>
                        <Tab fontWeight={800}>Available Duels</Tab>
                        <Tab fontWeight={800}>Ongoing Duels</Tab>
                        <Tab fontWeight={800}>Past Duels</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <AvailableDuels availableDuels={availableDuels} loading={loading} />
                        </TabPanel>
                        <TabPanel>
                            <OngoingDuels ongoingDuels={ongoingDuels} loading={loading} />
                        </TabPanel>
                        <TabPanel>
                            <PastDuels pastDuels={pastDuels} loading={loading} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        } />

    )
}
