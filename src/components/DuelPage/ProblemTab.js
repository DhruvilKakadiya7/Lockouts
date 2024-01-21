import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Problem from './Problem';

export const ProblemTab = ({
    id,
    statusOfDuel,
    playerNumber,
    problems,
    problemVerdicts,
    mathJaxRendered,
    onMathJaxRendered,
    replacing,
    problemSubmitReceived,
    onProblemSubmitReceived,
}) => {
    // console.log("PROBLEMS", problems);
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const [index, setIndex] = useState(0);
    
    // console.log("map", problems);
    if(statusOfDuel === "WAITING" || statusOfDuel === "INITIALIZED"){
        return(
            <Box>
                Waiting
            </Box>
        )
    }
    return (
        <Tabs
            variant={'soft-rounded'}
            borderColor={borderColor}
            width={'47em'}
            colorScheme='primary'
            index={index}
            onChange={(index) => setIndex(index)}
        >
            <TabList>
                <Flex width={'100%'}>
                    {problems?.map((obj, idx) => {
                        return (
                            <Tab
                                flex={1}
                                borderColor={borderColor}
                                fontSize={'1.2rem'}
                                key={idx}
                                // backgroundColor={'#d4edc9'} // Accepted
                                // backgroundColor={'#facaca'} // Attempted but not Accepted
                            >
                                {String.fromCharCode(65 + idx)}
                            </Tab>
                        );

                    })}
                </Flex>
            </TabList>
            <TabPanels
                border={'none'}
                width={'100%'}
            >
                {problems?.map((obj, idx) => {
                    console.log(obj);
                    return (
                        <TabPanel
                            key={idx}
                            
                            width={'100%'}
                            mx={'auto'}
                        >
                            <Problem 
                                problem={obj} 
                                idx={idx}
                                mathJaxRendered={mathJaxRendered}
                                onMathJaxRendered={onMathJaxRendered}
                            />
                        </TabPanel>
                    )
                })}
            </TabPanels>
        </Tabs>
    )
}
