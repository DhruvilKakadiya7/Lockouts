import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { getUID } from '../../DataBase/DataBase';

const AbortButton = ({ onOpen, cancelled, onCancelled }) => {
    const [aborting, setAborting] = useState(false);
    const handleAbort = (e) => {
        e.preventDefault();
        setAborting(true);
        onOpen();
    };

    useEffect(() => {
        if (cancelled) {
            setAborting(false);
            onCancelled();
        }
    }, [cancelled]);

    return (
        <Button
            rounded="md"
            colorScheme="red"
            isLoading={aborting}
            loadingText="Aborting"
            onClick={handleAbort}
            width="fit-content"
        >
            Abort Duel
        </Button>
    );
};

const ResignButton = ({ onOpen, cancelled, onCancelled }) => {
    const [resigning, setResigning] = useState(false);
    const handleResign = (e) => {
        e.preventDefault();
        setResigning(true);
        onOpen();
    };

    useEffect(() => {
        if (cancelled) {
            setResigning(false);
            onCancelled();
        }
    }, [cancelled]);

    return (
        <Button
            rounded="md"
            colorScheme="red"
            isLoading={resigning}
            loadingText="Resigning"
            onClick={handleResign}
            width="fit-content"
        >
            Resign
        </Button>
    );
};

export const Display2 = ({ id, statusOfDuel }) => {
    const abortModalContent = {
        title: "Abort?",
        message: "Are you sure you'd like to abort the duel?",
        action: "ABORT",
    };
    const resignModalContent = {
        title: "Resign?",
        message: "Are you sure you'd like to resign the duel?",
        action: "RESIGN",
    };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = useState(abortModalContent);

    const openModal = (type) => {
        if (type === "ABORT") {
            setModalContent(abortModalContent);
        } else {
            setModalContent(resignModalContent);
        }
        onOpen();
    };

    const handleAbortOrResign = (action) => {
        let uid = getUID();
        if (action === "ABORT") {
            socket.emit("abort-duel", { roomId: id, uid: uid });
        } else {
            socket.emit("resign-duel", { roomId: id, uid: uid });
        }
        onClose();
    };

    const [cancelled, setCancelled] = useState(false);

    const handleCancel = () => {
        setCancelled(true);
        onClose();
    };

    return (
        <>
            {
                statusOfDuel === "FINISHED" || statusOfDuel === "RESIGNED" ?
                    <></> :
                    <Flex
                        rounded={'md'}
                        border={'solid 1px'}
                        py={2}
                        borderColor={'grey.100'}
                        height={'fit-content'}
                        width={'100%'}
                        justifyContent={'center'}
                    >
                        {statusOfDuel === "ONGOING" ?
                            <ResignButton
                                onOpen={() => openModal('RESIGN')}
                                cancelled={cancelled}
                                onCancelled={() => { setCancelled(false) }}
                            ></ResignButton>
                            :
                            <AbortButton
                                onOpen={() => openModal('ABORT')}
                                cancelled={cancelled}
                                onCancelled={() => { setCancelled(false) }}
                            ></AbortButton>
                        }
                        <Modal isOpen={isOpen} onClose={handleCancel} size="sm">
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>{modalContent.title}</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <p>{modalContent.message}</p>
                                </ModalBody>
                                <ModalFooter justifyContent="center">
                                    <Button
                                        colorScheme="primary"
                                        mr={3}
                                        onClick={() => handleAbortOrResign(modalContent.action)}
                                    >
                                        I'm sure
                                    </Button>
                                    <Button
                                        colorScheme="primary"
                                        variant="outline"
                                        mr={3}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Flex>
            }
        </>
    )
}
