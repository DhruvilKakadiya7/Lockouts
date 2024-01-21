import { Button, Switch, Center, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import DataBase, { getUID } from '../../DataBase/DataBase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const DuelForm = ({
    duelCount
}) => {
    const [problemCount, setProblemCount] = useState(1);
    const [timeLimit, setTimeLimit] = useState(5);
    const [username, setUsername] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [ratingMin, setRatingMin] = useState(800);
    const [ratingMax, setRatingMax] = useState(1200);

    // Error limits
    const problemCountError = Number.isNaN(problemCount) || problemCount < 1 || problemCount > 10;
    const timeLimitError = Number.isNaN(timeLimit) || timeLimit < 5 || timeLimit > 180;
    const ratingMinimumError = Number.isNaN(ratingMin) || ratingMin < 800 || ratingMin > 3500;
    const ratingMaximumError = Number.isNaN(ratingMax) || ratingMax < 800 || ratingMax > 3500 || ratingMax < ratingMin;
    const usernameLengthError = username?.length > 20;

    // Color schemes
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const sliderThumbColor = useColorModeValue("grey.500", "secondary.900");
    const isMobile = useMediaQuery("(max-width: 540px)");
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (problemCountError || timeLimitError || ratingMinimumError || ratingMaximumError || usernameLengthError) {
            setSubmitting(false);
            return;
        }
        let uid = getUID();
        // console.log("user: ",username.length);
        const duelData = {
            problemCount: problemCount,
            timeLimit: timeLimit,
            ratingMin: ratingMin,
            ratingMax: ratingMax,
            players: [
                {
                    handle: username ? username : "GUEST1",
                    uid: uid,
                },
            ],
            private: isPrivate,
        }
        let duelId;
        try {
            var result = await DataBase.createDuel(duelData);
            // console.log(result[1].url);
            if (!result[0] || result[1].url !== undefined) {
                setSubmitting(false);
                if (result[1].url) {
                    toast.error('Already In a duel');
                }
                else {
                    toast.error("Try again");
                }
            }
            else {
                toast.success("Duel Created Successfully");
                duelId = result[1]._id;
                navigate(`/duel/${duelId}`);
            }
        }catch(e) {

        }
    }
    return (
        <Grid
            rowGap={4}
            columnGap={3}
            width={['100%', '70%']}
            height={'fit-content'}
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'md'}
            boxShadow={'2xl'}
            px={4}
            py={3}
            mt={3}
            mx={["auto", null, null, 0]}
            display={isMobile ? 'flex' : null}
            flexDirection={isMobile ? 'column' : null}
            templateColumns={isMobile ? null : "repeat(2, 1fr)"}
        >
            <GridItem colSpan={2}>
                <FormControl width={'fit-content'}>
                    <Flex>
                        <FormLabel my={'auto'}>Platform :</FormLabel>
                        {'CodeForces'}
                    </Flex>
                </FormControl>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl isRequired isInvalid={problemCountError}>
                        <Flex
                            justify={'space-between'}
                        >
                            <FormLabel my={'auto'} mr={0}>
                                {`Problems`}
                            </FormLabel>

                            <NumberInput
                                value={problemCount}
                                min={1}
                                max={10}
                                ml={0}
                                size="sm"
                                width="fit-content"
                                height="fit-content"
                                borderColor="grey.100"
                                onChange={(value) => setProblemCount(value)}
                            >
                                <NumberInputField width={["8em", "12em"]} pl={2} />
                                <NumberInputStepper borderColor="grey.100">
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <Center>
                            <Slider
                                mt={1}
                                width="90%"
                                focusThumbOnChange={false}
                                value={((problemCount - 1) * 100) / 9}
                                onChange={(val) => {
                                    setProblemCount(Math.floor((val * 9) / 100 + 1));
                                }}
                            >
                                <SliderTrack bg="grey.100">
                                    <SliderFilledTrack bg="primary.500" />
                                </SliderTrack>
                                <SliderThumb boxSize="1em" bg={sliderThumbColor} />
                            </Slider>
                        </Center>
                        {problemCountError ? (
                            <FormErrorMessage mt={0}>Invalid problem count.</FormErrorMessage>
                        ) : (
                            ""
                        )}
                    </FormControl>

                </Center>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl isInvalid={timeLimitError} isRequired>
                        <Flex justify="space-between">
                            <FormLabel my="auto" mr={0}>
                                Time Limit (min)
                            </FormLabel>
                            <NumberInput
                                value={timeLimit}
                                min={1}
                                max={180}
                                step={5}
                                size="sm"
                                borderColor="grey.100"
                                onChange={(val) => {
                                    setTimeLimit(val);
                                }}
                            >
                                <NumberInputField width={["8em", "12em"]} pl={2} />
                                <NumberInputStepper borderColor="grey.100">
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <Center>
                            <Slider
                                mt={1}
                                width="90%"
                                focusThumbOnChange={false}
                                value={((timeLimit - 5) / 5) * (100 / (175 / 5))}
                                onChange={(val) => {
                                    let ok = ((val * 5) / (100 / (175 / 5))) + 5;
                                    setTimeLimit(Math.floor(ok));
                                }}
                            >
                                <SliderTrack bg="grey.100">
                                    <SliderFilledTrack bg="primary.500" />
                                </SliderTrack>
                                <SliderThumb boxSize="1em" bg={sliderThumbColor} />
                            </Slider>
                        </Center>
                        {timeLimitError ? (
                            <FormErrorMessage mt={0}>Invalid time limit.</FormErrorMessage>
                        ) : (
                            ""
                        )}
                    </FormControl>
                </Center>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl isInvalid={ratingMinimumError} isRequired>
                        <Flex justify="space-between">
                            <FormLabel my="auto" mr={0}>
                                Rating Min
                            </FormLabel>
                            <NumberInput
                                value={ratingMin}
                                min={800}
                                max={3500}
                                step={100}
                                size="sm"
                                width="fit-content"
                                height="fit-content"
                                onChange={(value) => setRatingMin(value)}
                                onBlur={(e) =>
                                    setRatingMin(Math.floor(e.target.value / 100) * 100)
                                }
                                borderColor="grey.100"
                            >
                                <NumberInputField width={["8em", "12em"]} pl={2} />
                                <NumberInputStepper borderColor="grey.100">
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <Center>
                            <Slider
                                mt={1}
                                width="90%"
                                focusThumbOnChange={false}
                                value={(ratingMin - 800) / 27}
                                onChange={(value) =>
                                    setRatingMin(
                                        Math.floor(((value / 100) * (3500 - 800)) / 100) * 100 +
                                        800
                                    )
                                }
                            >
                                <SliderTrack bg="grey.100">
                                    <SliderFilledTrack bg="primary.500" />
                                </SliderTrack>
                                <SliderThumb boxSize="1em" bg={sliderThumbColor} />
                            </Slider>
                        </Center>
                        {ratingMinimumError ? (
                            <FormErrorMessage mt={'3px'}>
                                Invalid difficulty minimum.
                            </FormErrorMessage>
                        ) : (
                            ""
                        )}
                    </FormControl>
                </Center>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl isInvalid={ratingMaximumError} isRequired>
                        <Flex justify="space-between">
                            <FormLabel my="auto" mr={0}>
                                Rating Max
                            </FormLabel>
                            <NumberInput
                                value={ratingMax}
                                min={800}
                                max={3500}
                                step={100}
                                size="sm"
                                width="fit-content"
                                height="fit-content"
                                onChange={(value) => setRatingMax(value)}
                                onBlur={(e) =>
                                    setRatingMax(Math.floor(e.target.value / 100) * 100)
                                }
                                borderColor="grey.100"
                            >
                                <NumberInputField width={["8em", "12em"]} pl={2} />
                                <NumberInputStepper borderColor="grey.100">
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <Center>
                            <Slider
                                mt={1}
                                width="90%"
                                focusThumbOnChange={false}
                                value={(ratingMax - 800) / 27}
                                onChange={(value) =>
                                    setRatingMax(
                                        Math.floor(((value / 100) * (3500 - 800)) / 100) * 100 +
                                        800
                                    )
                                }
                            >
                                <SliderTrack bg="grey.100">
                                    <SliderFilledTrack bg="primary.500" />
                                </SliderTrack>
                                <SliderThumb boxSize="1em" bg={sliderThumbColor} />
                            </Slider>
                        </Center>
                        {ratingMaximumError ? (
                            <FormErrorMessage mt={0}>
                                Invalid difficulty maximum.
                            </FormErrorMessage>
                        ) : (
                            ""
                        )}
                    </FormControl>
                </Center>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl isInvalid={usernameLengthError}>
                        <FormLabel my="auto">Username (optional)</FormLabel>
                        <Input
                            mt={1}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit(e);
                            }}
                            borderColor="grey.100"
                            width="12em"
                            pl={2}
                        />
                        {usernameLengthError ? (
                            <FormErrorMessage>Max length: 20 characters</FormErrorMessage>
                        ) : (
                            <FormHelperText mt={1}>What shall we call you?</FormHelperText>
                        )}
                    </FormControl>
                </Center>
            </GridItem>
            <GridItem>
                <Center>
                    <FormControl>
                        <FormLabel my="auto">Private?</FormLabel>
                        <Switch
                            mt={1}
                            size="lg"
                            colorScheme="primary"
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <FormHelperText mt={1}>
                            Private matches don't show up on the table (invite-only).
                        </FormHelperText>
                    </FormControl>
                </Center>
            </GridItem>
            <GridItem colSpan={2}>
                <Center>
                    <Button
                        size="md"
                        fontSize="lg"
                        loadingText="Creating"
                        isLoading={submitting}
                        variant="solid"
                        isDisabled={duelCount?.active === 50}
                        colorScheme="primary"
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>
                </Center>
            </GridItem>
        </Grid>
    )
}
