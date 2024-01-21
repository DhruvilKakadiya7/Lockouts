import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputRightAddon, Select, Text, useColorModeValue } from '@chakra-ui/react';
import languages, { codes_to_languages, languages_to_codes } from './languages';
import { MdDelete } from "react-icons/md";
import Editor from './Editor';
import { toast } from 'react-hot-toast';
import DataBase, { getUID } from '../../DataBase/DataBase';
import socket from '../../socket';

const CodeSubmitTab = ({
    statusOfDuel,
    editorId,
    duelId,
    isPopup,
    problemsCount,
    problems,
    problemSubmitReceived,
    onProblemSubmitReceived,
    isVisitor,
}) => {
    const borderColor = useColorModeValue(
        "rgb(0, 0, 0, 0.5)",
        "rgb(255, 255, 255, 0.5)"
    );
    const [chosenLanguage, setChosenLanguage] = useState(0);
    const [chosenLanguageError, setChosenLanguageError] = useState(false);
    const [chosenProblem, setChosenProblem] = useState('N/A');
    const [chosenProblemError, setChosenProblemError] = useState(false);
    const [editorFileError, setEditorFileError] = useState(false); // when neither editor nor file are filled
    const [fileUploaded, setFileUploaded] = useState(false);

    const fileName = useRef("");
    const fileContent = useRef("");
    const [submitting, setSubmitting] = useState(false);
    const [lastSubmissionTime, setLastSubmissionTime] = useState();
    const code = useRef();
    const submissionProcess = async (res, uid, duelId, chosenProblem) => {
        try {
            toast.success("Problem Submitted Successfully, now wait for verdict.");
            let dataBaseId = res[1].dataBaseId;
            let verdict = await DataBase.getVerdict(dataBaseId);
            while (!verdict.includes('Accepted')
                && !verdict.includes('Happy New Year')
                && !verdict.includes('Compilation error')
                && !verdict.includes('Wrong answer')
                && !verdict.includes('Time limit')
                && !verdict.includes('Runtime Error')
                && !verdict.includes('Memory limit')
            ) {
                verdict = await DataBase.getVerdict(dataBaseId);
            }
            toast.custom((t) => {
                return (
                    <Box sx={{ backgroundColor: 'gray' }} padding={3}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: verdict.trim()
                            }}
                        >
                        </div>
                    </Box>
                )
            }, {
                duration: 4000,
            });
            socket.emit('submit-success', {
                verdict,
                uid,
                duelId,
                problemId: chosenProblem.charCodeAt(0) - 65,
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    const submitClicked = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (!chosenLanguage) {
            setChosenLanguageError(true);
        }
        if (chosenProblem === 'N/A') {
            setChosenProblemError(true);
        }
        if (!chosenLanguage || chosenProblem === 'N/A') {
            setSubmitting(false);
            toast.error("Submission Error. Invalid Parameters");
            return;
        }
        setChosenProblemError(false);
        if (lastSubmissionTime) {
            let difference = Date.now() - lastSubmissionTime;
            if (difference < 10000) {
                toast.error("Please wait for 10seconds before another submission");
                setSubmitting(false);
                return;
            }
        }
        setLastSubmissionTime(Date.now());
        let uid = getUID();
        console.log(problems[chosenProblem.charCodeAt(0) - 65], chosenProblem.charCodeAt(0) - 65);
        if (fileContent.current) {
            const submission = {
                duelId: duelId,
                problemId: chosenProblem.charCodeAt(0) - 65,
                contestId: problems[chosenProblem.charCodeAt(0) - 65].contestId,
                problemIndex: problems[chosenProblem.charCodeAt(0) - 65].index,
                codeContent: fileContent.current,
                languageCode: chosenLanguage,
                playerUid: uid
            }
            console.log(duelId);
            setSubmitting(true);
            const res = await DataBase.submitProblem(submission);
            handleCode('')
            setSubmitting(false);
            setSubmitting(false);
            if (res[0]) {
                const ret = await submissionProcess(res, uid, duelId, chosenProblem);
                if(!ret) {
                    toast.error("Please try again Later");
                }
            }
            else {
                toast.error("Please try again Later");
            }
        }
        else if (code.current) {
            console.log(code.current);
            const submission = {
                duelId: duelId,
                problemId: chosenProblem.charCodeAt(0) - 65,
                contestId: problems[chosenProblem.charCodeAt(0) - 65].contestId,
                problemIndex: problems[chosenProblem.charCodeAt(0) - 65].index,
                codeContent: code.current,
                languageCode: chosenLanguage,
                playerUid: uid
            }
            setSubmitting(true);
            const res = await DataBase.submitProblem(submission);
            setSubmitting(false);
            if (res[0]) {
                const ret = await submissionProcess(res, uid, duelId, chosenProblem);
                if(!ret) {
                    toast.error("Please try again Later");
                }
            }
            else {
                toast.error("Please try again Later");
            }
        }
        else {
            toast.error("Either Upload a file or write a code in the editor.");
            setSubmitting(false);
        }

    }

    const handleUpload = (e) => {
        setFileUploaded(true);
        setEditorFileError(false);
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            fileContent.current = event.target.result;
        };
        fileReader.readAsText(file);
        fileName.current = file.name;
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setFileUploaded(false);
        fileContent.current = "";
        fileName.current = "";
    };

    const handleCode = (newCode) => {
        code.current = newCode;
        setEditorFileError(false);
        // setJavaCodeError(false);
    };

    return (
        <Box
            width="100%"
            px={4}
            py={5}
            boxShadow={"2xl"}
            rounded="md"
            border={"1px solid"}
            borderColor={borderColor}
        >

            <Text mb={1}>
                Code is <b>not saved</b> upon exiting modal, refreshing page, or switching languages.
            </Text>
            <Flex
                pb={3}
                gap={1}
                justify={'center'}
                align={'flex-end'}
            >
                <FormControl
                    isRequired
                    minHeight={'5.5em'}
                    isInvalid={chosenLanguageError}
                >
                    <FormLabel
                        my={'auto'}
                    >
                        Language:
                    </FormLabel>
                    <Select
                        borderColor="grey.100"
                        w={"12em"}
                        value={chosenLanguage}
                        onChange={(e) => {
                            setChosenLanguage(parseInt(e.target.value));
                            if (parseInt(e.target.value)) setChosenLanguageError(false);
                        }}
                    >
                        <option value={0}></option>

                        {Object.keys(languages_to_codes['CF']).map((languageName) => {
                            // console.log(languageName);
                            return (
                                <option
                                    value={languages_to_codes['CF'][languageName]}
                                >
                                    {languageName}
                                </option>
                            );

                        })}
                    </Select>
                    <FormErrorMessage mt={1}>
                        Pick a language.
                    </FormErrorMessage>
                </FormControl>
                <FormControl
                    isRequired
                    minHeight={'5.5em'}
                    isInvalid={chosenProblemError}
                >
                    <FormLabel
                        my={'auto'}
                    >
                        Problem #:
                    </FormLabel>
                    <Select
                        borderColor={"grey.100"}
                        w={"7em"}
                        value={chosenProblem}
                        onChange={(e) => {
                            setChosenProblem(e.target.value);
                            if (e.target.value !== "N/A") setChosenProblemError(false);
                        }}
                    >
                        <option value={"N/A"}></option>

                        {[...Array(problemsCount).keys()].map((num) => (
                            <option value={String.fromCharCode(65 + num)}>{String.fromCharCode(65 + num)}</option>
                        ))}
                    </Select>
                    <FormErrorMessage mt={1}>
                        Pick a problem.
                    </FormErrorMessage>
                </FormControl>
                <FormControl minHeight={"5.5em"} pt={"1.5rem"} isInvalid={editorFileError}>
                    <InputGroup>
                        <FormLabel
                            as={"label"}
                            width={"12em"}
                            minHeight={"2rem"}
                            m={0}
                            pt={0.5}
                            textAlign={"center"}
                            fontSize={"1.3rem"}
                            border={"1px solid"}
                            borderColor={borderColor}
                            borderLeftRadius={"md"}
                            cursor={"pointer"}
                            htmlFor={`${editorId} file`}
                        >
                            {fileUploaded ? fileName.current : "Upload File"}
                        </FormLabel>

                        <Input
                            id={`${editorId} file`}
                            px={0}
                            opacity="0"
                            width="0.1px"
                            height="0.1px"
                            position="absolute"
                            type="file"
                            onChange={handleUpload}
                        />
                        <InputRightAddon
                            children={
                                <IconButton
                                    icon={<MdDelete />}
                                    borderLeftRadius="none"
                                    variant="outline"
                                    colorScheme="primary"
                                />
                            }
                            onClick={handleDelete}
                            p={0}
                        />
                    </InputGroup>
                </FormControl>
            </Flex>
            <FormControl
                pt={0}
                minHeight={'28.5em'}
                isInvalid={editorFileError}
            >
                <FormLabel
                    my={'auto'}
                >
                    or Enter your submission:
                </FormLabel>
                <Box
                    border={'1px solid'}
                    borderColor={'grey.100'}
                >

                    <Editor
                        key={editorId}
                        languageCode={chosenLanguage}
                        onSetCode={handleCode}
                    />
                </Box>
            </FormControl>
            <Center mt={1}>
                <Button
                    id={editorId}
                    onClick={submitClicked}
                    size={"md"}
                    fontSize={"lg"}
                    variant={"solid"}
                    colorScheme={'primary'}
                    loadingText={"Submitting"}
                    isLoading={submitting}
                    isDisabled={statusOfDuel !== "ONGOING" || isVisitor}
                >
                    Submit
                </Button>
            </Center>
        </Box>
    )
}

export default CodeSubmitTab;