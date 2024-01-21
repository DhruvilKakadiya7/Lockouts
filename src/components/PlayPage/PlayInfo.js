import React from "react";
import { Flex, Text, Box, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const details = [
    {
        number: 1,
        title1: `Join or create a duel.`,
        title2: ``,
        details: 'Join a duel by searching for an available row in the table of available duels.Or make your own and wait for someone to join.'
    },
    {
        number: 2,
        title1: `Finalize problem set.`,
        title2: ``,
        details: `When someone joins the duel, a problem set is automatically generated. You can chat with your partner and decide if you'd like to regenerate select problems.`
    },
    {
        number: 3,
        title1: `Start the duel.`,
        title2: `Get Coding.`,
        details: `Once you and your duel partner have settled on a problem set, you can ready-up. The duel will begin and a timer will be set.`
    },
    {
        number: 4,
        title1: `Solve Problems.`,
        title2: ``,
        details: `Possible points for a problem decrease with time - solve them as quickly as you can! But keep in mind that each incorrect submission costs`
    },
    {
        number: 5,
        title1: `Win (or lose).`,
        title2: `But have fun!`,
        details: `When the time is up or when both players have solved every problem, the duel automatically ends. Whoever has more points is declared winner.`
    },
]


const PlayInfo = () => {
    const circleIconBackgroundColor = useColorModeValue("primary.500", "primary.400");
    const circleIconColor = useColorModeValue("offWhite", "grey.900");

    return (
        <Flex
            direction={'column'}
            align={'center'}
            width={'100%'}
            mt={'3em'}
            mb={'3em'}
        >
            <Text
                fontSize={["2.4rem", "3rem", "4rem"]}
                lineHeight={["3.2rem", "4.8rem"]}
                maxWidth={'90vw'}
                mx={'auto'}
                textStyle={'display2'}
            >
                How to Play
            </Text>
            <Flex
                flexWrap={'wrap'}
                justifyContent={'center'}
            >
                {details.map((content, i) => {
                    return (
                        <Box width={{ base: '100%', md: '33%' }} key={i} mt={'2em'} px={8}>
                            <Flex>
                                <Box
                                    backgroundColor={circleIconBackgroundColor}
                                    width={'3.5em'}
                                    height={'3.5em'}
                                    borderRadius={'100%'}
                                    color={circleIconColor}
                                    textAlign={'center'}
                                >
                                    <Text
                                        pt={'0.4em'}
                                        fontSize={'1.5rem'}
                                        fontWeight={800}
                                    >
                                        {content.number}
                                    </Text>
                                </Box>
                                <Text
                                    ml={'0.5em'}
                                    my={'auto'}
                                    fontSize={'1.2rem'}
                                    fontWeight={'600'}
                                >
                                    {content.title1}<br />
                                    {content.title2}
                                </Text>
                            </Flex>
                            <Text mt={'0.5em'} ml={'0.25em'} fontSize={'1.1rem'}>
                                {content.details}
                                {i === 3 ?
                                    <span>
                                        <b> 50</b> points.
                                    </span> :
                                    null
                                }
                            </Text>
                        </Box>
                    );
                })}
            </Flex>
            {/* <Text align={'center'} fontSize={'1.2rem'} mt={'2em'} width={'18em'}>
                <Text as={'span'} fontWeight={'800'}>
                    Please Note
                </Text><br />
                Waiting duels will be auto-aborted after <b>2 minutes</b> if not initialized (someone joining), and initialized duels will also be aborted if not started.
            </Text> */}
        </Flex>
    );
}

export default PlayInfo;