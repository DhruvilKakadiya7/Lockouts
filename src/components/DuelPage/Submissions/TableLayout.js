
import { Box, Button, Center, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
    createColumnHelper,
    Table as ReactTable,
    PaginationState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    OnChangeFn,
    flexRender,
} from '@tanstack/react-table'
import './index.css'
import { useNavigate } from 'react-router-dom'
import Editor from '../Editor'
import { codes_to_languages } from '../languages'

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('when', {
        id: 'when',
        header: () => <span>when</span>,
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('problem', {
        id: 'problem',
        header: () => <span>Problem</span>,
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('verdict', {
        id: 'verdict',
        header: () => <span>Verdict</span>,
        cell: info => info.getValue(),
        footer: info => info.column.id,
    })
]

function Filter({
    column,
    table,
}) {
    // console.log(table.getPreFilteredRowModel());
    const firstValue = table
        .getPreFilteredRowModel()
        .rows[0]?.getValue(column.id)
    // console.log(firstValue);
    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <Flex
            gap={1}
        >
            <Input
                type="number"
                value={columnFilterValue?.[0] ?? ''}
                onChange={e =>
                    column.setFilterValue((old) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                border={'1px solid'}
            />
            <Input
                type="number"
                value={columnFilterValue?.[1] ?? ''}
                onChange={e =>
                    column.setFilterValue((old) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
                border={'1px solid'}
            />
        </Flex>
    ) : (
        <Input
            type="text"
            value={(columnFilterValue ?? '')}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            border={'1px solid'}
        />
    )
}

export const TableLayout = ({
    submissionData,
    problems,
    isVisitor,
    statusOfDuel
}) => {
    const [data, setData] = React.useState(() => [...submissionData])
    // console.log(data);
    const rerender = React.useReducer(() => ({}), {})[1]
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = useState();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    })
    const rowHoverColor = useColorModeValue("secondary.300", "secondary.900");
    const rowTextColor = useColorModeValue("grey.900", "offWhite");

    const handleOpenCode = async (data) => {
        // console.log(data);
        setModalContent(data);
        onOpen();
    }
    const handleCancel = () => {
        onClose();
    };
    useEffect(()=>{
        const tempRun = ()=>{
            // console.log('changed');
        }
        tempRun();
    }, [submissionData])
    const navigate = useNavigate();
    return (
        <div className="p-2">
            <Table
                style={{ borderCollapse: "collapse" }}
                border="solid 1px"
                borderColor="grey.500"
            >
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Th
                                    key={header.id}
                                    borderBottom="solid 1px"
                                    borderColor="grey.500"
                                    style={{
                                        fontSize: '1rem'
                                    }}
                                >
                                    <Center>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                    </Center>
                                    <Center mt={2}>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} table={table} />
                                            </div>
                                        ) : null}
                                    </Center>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map((row, idx) => {
                        // console.log(table.getRowModel().rows.length);
                        if (row.original.when === "xxx") {
                            return (
                                <Tr
                                    key={idx}
                                    style={{ cursor: "pointer", height: '3.5em' }}
                                    borderBottom={'1px solid black'}
                                >
                                    <td
                                        colSpan={4}
                                        borderBottom={'1px solid'}
                                        borderColor={'grey.500'}
                                    >
                                        <Text fontSize={'1rem'} fontWeight={700} textAlign={'center'} height={'1em'}>
                                            {`-`}
                                        </Text>
                                    </td>
                                </Tr>
                            );
                        }
                        return (
                            <Tr
                                key={row.original._id}
                                onClick={() => handleOpenCode(row.original)}
                                style={{ cursor: "pointer", height: '3.5em' }}
                                _hover={{ bg: rowHoverColor }}
                                borderBottom="solid 1px"
                                borderColor={`${idx == table.getRowModel().rows.length - 1 ? 'lightgray' : 'grey.500'}`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        <Center>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Center>
                                    </td>
                                ))}
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                mt={3}
            >
                <Button
                    onClick={() => table.setPageIndex(0)}
                    isDisabled={!table.getCanPreviousPage()}
                    marginRight={1}
                    variant="solid"
                    colorScheme="primary"
                >
                    {`<<`}
                </Button>
                <Button
                    onClick={() => table.previousPage()}
                    isDisabled={!table.getCanPreviousPage()}
                    marginRight={1}
                    variant="solid"
                    colorScheme="primary"
                >
                    {`<`}
                </Button>

                {/* <Box flexGrow={1} /> */}
                <Center>
                    <div>{`Page `}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {`${table.getPageCount()} `}
                        </strong>
                    </div>
                </Center>
                <Center className="flex items-center gap-1">
                    {` | Go to page: `}
                    <Input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        border={'1px solid'}
                        width={'6rem'}
                        maxWidth={'6rem'}
                        marginLeft={'4px'}
                    />
                </Center>
                <Button
                    onClick={() => table.nextPage()}
                    isDisabled={!table.getCanNextPage()}
                    marginRight={1}
                    variant="solid"
                    colorScheme="primary"
                >
                    {`>`}
                </Button>
                <Button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    isDisabled={!table.getCanNextPage()}
                    marginRight={1}
                    variant="solid"
                    colorScheme="primary"
                >
                    {`>>`}
                </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={handleCancel} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{problems[modalContent?.problemNumber]?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box fontWeight={700} mb={2}>
                            Language: {`${codes_to_languages['CF'][modalContent?.languageCode]}`}
                            <br />
                            Verdict: {<span
                                dangerouslySetInnerHTML={{
                                    __html: modalContent?.status.trim()
                                }}
                            >
                            </span>}
                        </Box>

                        <Editor
                            languageCode={modalContent?.languageCode}
                            providedValue={modalContent?.code}
                            readOnly={true}
                        />
                    </ModalBody>
                    <ModalFooter justifyContent="center">
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
        </div>
    )
}
