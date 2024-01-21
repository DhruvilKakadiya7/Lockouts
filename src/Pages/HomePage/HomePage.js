import React, { useEffect, useState } from 'react'
import { BaseLayout } from '../../components/BaseLayout/BaseLayout'
import { Button, ButtonGroup, Center, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import HomeMonitor from '../../components/Home/HomeMonitor'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


export const HomePage = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  useEffect(()=>{
    const activateLRU = async ()=>{
      try {
        await axios.get('http://localhost:5000/duels/activeLRU');
      }catch (e){
        console.log(e);
      }
    }
    if(refresh) {
      activateLRU();
      setRefresh(false);
    }
  },[refresh]);
  return (
    <BaseLayout
      content={
        <Flex direction={'column'}>
          <SimpleGrid
            column={1}
            mx={'auto'}
            spacing={['2', '5']}
          >
            <Center
              transform={[
                null,
                "scale(1.1)",
                "scale(1.2)",
                "scale(1.3)",
                "scale(1.5)",
              ]}
              height={'fit-content'}
              my={[2, 9, 10, 12, 14]}
            >
              <HomeMonitor />
            </Center>
            <Stack
              width={['19em', '30em', '35em']}
              spacing={2}
              mb={'2em'}
              ml={[1, 4, 6]}
            >
              <Text
                mb={0}
                fontWeight={800}
                fontSize={['2.5rem', '3rem', '4rem']}
                lineHeight={['3.6rem', '4.8rem',]}
              >
                A better way to practice coding
              </Text>
              <Text
                mt={0}
                fontSize={["1.1rem", "1.6rem"]}
                lineHeight={["1.6rem", "2.4rem"]}
              >
                Sharpen your programming skills by playing one-on-one live
                duels, with problems drawn from Leetcode, Codeforces, and more.
              </Text>
              <Text
                mb={0}
                fontWeight={200}
                fontSize={['1.2rem', '1.3rem', '2rem']}
                lineHeight={['3.6rem', '4.8rem',]}
                textAlign={'center'}
              >
                What are you waiting for?
              </Text>
              <ButtonGroup pt={1}>
                <Button
                  fontSize={'lg'}
                  width={['80%', '95%']}
                  height={['3.5em', '3.2em', '3em']}
                  variant={'solid'}
                  colorScheme='primary'
                  boxShadow={'0 6px 17px rgb(79 114 205 / 40%)'}
                  _hover={{ filter: "opacity(0.85)", transform: "scale(1.03)" }}
                  transition="filter 0.2s ease, transform 0.2 ease"
                  fontWeight={'800'}
                  onClick={() => navigate('/play')}
                >
                  Play for Free
                </Button>
              </ButtonGroup>
            </Stack>
          </SimpleGrid>
        </Flex>
      }
    />
  )
}
