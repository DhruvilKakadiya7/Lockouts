import { Box, Center, Flex, Text, useColorMode, useColorModeValue, useEditable } from '@chakra-ui/react'
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import DataBase from '../../DataBase/DataBase';

export const DuelsInfo = ({
    duelCount
}) => {
    // Color schemes
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    console.log(duelCount);
    

    return (
        <Flex
            direction={'column'}
            align={'center'}
            width={'100%'}
            mt={'2.3em'}
            mb={'3em'}
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'md'}
            boxShadow={'2xl'}
        >

            <Text
                fontSize={['2rem', '3rem']}
            >
                Duels Info
            </Text>
            <Box>
                <Text fontSize="1.5rem" fontWeight="bold">{`Active Duels: `}
                    <Text as='span' fontSize="1.4rem" align="center">{duelCount?.active} / 50</Text>
                </Text>
            </Box>
            <Flex
                flexWrap={'wrap'}
                justifyContent={'center'}
                width={'90%'}
            >
                <Text fontSize="1.5rem">{`Duels Waiting: `}
                    <Text as='span' fontSize="1.4rem" align="center">{duelCount?.waiting}</Text>
                </Text>
                <Box flexGrow={1}/>
                <Text fontSize="1.5rem">{`Duels Initialized: `}
                    <Text as='span' fontSize="1.4rem" align="center">{duelCount?.initialized}</Text>
                </Text>
                <Box flexGrow={1}/>
                <Text fontSize="1.5rem">{`Duels Ongoing: `}
                    <Text as='span' fontSize="1.4rem" align="center">{duelCount?.ongoing}</Text>
                </Text>
            </Flex>
        </Flex>
    )
}
