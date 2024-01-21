import React, { useState } from 'react'
import { BaseLayout } from '../components/BaseLayout/BaseLayout'
import { Button, Center, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Input, Text, useColorModeValue } from '@chakra-ui/react'
import DataBase from '../DataBase/DataBase';
import toast from 'react-hot-toast';

export const ContactPage = () => {
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const usernameLengthError = username?.length > 20;
    const [messageLengthError, setMessageError] = useState(0);

    const handleSubmit = async () => {
        if (message?.length === 0) {
            setMessageError(message?.length === 0);
        }
        else {
            setSubmitting(true);
            const mailData = {
                name: username,
                message: message,
                email: email
            }
            await DataBase.sendContact(mailData);
            setSubmitting(false);
            toast.success('mail sent');
        }
    }
    return (
        <BaseLayout
            content={
                <Flex
                    direction={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Text
                        fontSize={['1.5rem', '3.2rem']}
                        fontWeight={800}
                        textAlign={'center'}
                        mt={1}
                    >
                        {`Talk to Us`}
                    </Text>
                    <Grid
                        rowGap={4}
                        columnGap={3}
                        width={['50%', '50%']}
                        height={'fit-content'}
                        border={'1px solid'}
                        borderColor={borderColor}
                        rounded={'md'}
                        boxShadow={'2xl'}
                        px={4}
                        py={3}
                        mt={3}
                        templateColumns="repeat(2, 1fr)"
                        mx={["auto", null, null, 0]}
                    >
                        <GridItem>
                            <Center>
                                <FormControl isInvalid={usernameLengthError}>
                                    <FormLabel my="auto">Username (optional)</FormLabel>
                                    <Input
                                        mt={1}
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
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
                                    <FormLabel my="auto">Email (optional)</FormLabel>
                                    <Input
                                        mt={1}
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        borderColor="grey.100"
                                        width="12em"
                                        pl={2}
                                    />
                                    <FormHelperText mt={1}>Enter if you want return mail from us.</FormHelperText>
                                </FormControl>
                            </Center>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FormControl isRequired isInvalid={messageLengthError} width={'fit-content'}>
                                <FormLabel my="auto">Message</FormLabel>
                                <Input
                                    mt={1}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    borderColor="grey.100"
                                    width="200%"
                                    pl={2}
                                />
                                {messageLengthError ? (
                                    <FormErrorMessage>Message can't be empty</FormErrorMessage>
                                ) : (
                                    <FormHelperText mt={1}>Enter if you want return mail from us.</FormHelperText>
                                )}
                            </FormControl>
                        </GridItem>
                        <GridItem colSpan={2}>

                            <Center>
                                <Button
                                    size="md"
                                    fontSize="lg"
                                    loadingText="Creating"
                                    isLoading={submitting}
                                    variant="solid"
                                    colorScheme="primary"
                                    onClick={handleSubmit}
                                >
                                    Send
                                </Button>
                            </Center>
                        </GridItem>
                    </Grid>
                </Flex>
            }
        />
    )
}


