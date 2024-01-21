import React, { useEffect, useState } from 'react'
import { Box, Text, useColorMode } from '@chakra-ui/react';

const HomeMonitor = () => {
    const [loading, setLoading] = useState(false);
    const [doneLoading, setDoneLoading] = useState(false);
    const [writing, setWriting] = useState(false);
    const [doneWriting, setDoneWriting] = useState(false);
    const [code, setCode] = useState(`|`);
    const { colorMode } = useColorMode();
    const script1 = [
        " ======= ========",
        "===      ===  ===",
        "===      =======",
        "===      ===",
        " ======= ===",
    ];
    const [currentLine, setCurrentLine] = useState(script1.length - 1);

    const script2 = [
        "#include <codeforces>\n",
        '#include "lockouts_1v1.h"\n',
        "\n",
        "int main() {\n",
        "  Lockouts::Duel duel = Lockoutes::createDuel(\n",
        '    "Psychotic_D", "Dhruvil", 10, 180, 2400, 3000\n',
        "  );\n",
        "  duel.start();\n",
        "  duel.solveProblems();\n",
        "  duel.haveFun();\n",
        "  return 0;\n",
        "}",
    ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const cursor = "|";

    useEffect(() => {
        if (!doneLoading) {
            const shiftLine = async () => {
                if (!loading) {
                    await sleep(500);
                    setLoading(true);
                    return;
                }
                if (currentLine === -1) {
                    await sleep(500);
                    setDoneLoading(true);
                } else {
                    await sleep(200);
                    setCurrentLine((i) => i - 1);
                }
            };
            shiftLine();
        }
    }, [loading, doneLoading, currentLine]);

    useEffect(() => {
        if (!writing && doneLoading) {
            setWriting(true);
            async function writeText() {
                for (let i = 0; i < script2.length; i++) {
                    for (let j = 0; j < script2[i].length; j++) {
                        if (script2[i][j] === "\n") await sleep(100);
                        if (
                            script2[i][j] === " " &&
                            j < script2[i].length &&
                            script2[i][j + 1] === " "
                        ) {
                            setCode(
                                (code) => code.substring(0, code.length - 1) + "  " + cursor
                            );
                            j++;
                            await sleep(100);
                            continue;
                        }
                        setCode(
                            (code) => {
                                // console.log(code);
                                return code.substring(0, code.length - 1) + script2[i][j] + cursor
                            }
                        );
                        if (script2[i][j] === " ") await sleep(100);
                        else if (script2[i][j] === "\n") await sleep(200);
                        else if (script2[i][j] === ",") await sleep(250);
                        else if (script2[i][j] === "(" || script2[i] === ")")
                            await sleep(180);
                        else if (script2[i][j] === "{" || script2[i] === "}")
                            await sleep(200);
                        else await sleep(50);
                    }
                }
                setDoneWriting(true);
            }
            writeText();
        }
    }, [writing, doneLoading]);

    useEffect(() => {
        async function blinkCursor() {
            while (true) {
                await sleep(500);
                setCode((code) => code.substring(0, code.length - 1));
                await sleep(500);
                setCode((code) => code + cursor);
            }
        }
        if (doneWriting) {
            setDoneWriting(false);
            blinkCursor();
        }
    }, [doneWriting]);

    return (

        <Box className="computer-container"
            boxShadow={
                colorMode === "light"
                    ? "0 70px 44px -44px rgba(0, 0, 0, 0.4)"
                    : "#a8a8ff 0 15px 42px"
            }
            display={'flex'}
        >
            
            <Box className="monitor" display={'flex'}>
                <Box className="monitor-inner" display={'flex'}>
                    <Box className="screen-container" display={'flex'}>
                        <Box className="eyes off">
                            <Box className="left eye" display={'flex'}>
                                <Box className="shine" display={'flex'}></Box>
                            </Box>
                            <Box className="right eye" display={'flex'}>
                                <Box className="shine" display={'flex'}></Box>
                            </Box>
                        </Box>
                        <Box className="screen" display={'flex'}>
                            {doneLoading ?
                                <pre>
                                    <code>
                                        {code}
                                    </code>
                                </pre> :

                                <Box mx="auto" width="fit-content">
                                    {script1.map((line, index) => (
                                        <Text
                                            as="pre"
                                            color={index > currentLine ? "#43ff43" : "#21bc21"}
                                            fontSize={'2em'}
                                            lineHeight={'0.9em'}
                                            key={index}
                                        >
                                            {line}
                                        </Text>

                                    ))}
                                </Box>
                            }
                        </Box>
                    </Box>
                </Box>
                <Box className="monitor-bottom" display={'flex'}>
                    <Box className="power-switch" display={'flex'}>
                        <Box className="button" display={'flex'}></Box>
                    </Box>
                    <Box className="power-led standby" display={'flex'}></Box>
                </Box>
            </Box>
        </Box>

    )
}

export default HomeMonitor;