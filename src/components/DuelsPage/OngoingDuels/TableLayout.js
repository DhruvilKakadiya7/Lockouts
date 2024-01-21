
import { Box, Button, Center, Flex, Input, Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
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

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('usernames', {
        id: 'usernames',
        header: () => <span>Usernames</span>,
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('timeleft', {
        id: 'timeleft',
        header: () => <span>TimeLeft</span>,
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
]

function Filter({
    column,
    table,
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .rows[0]?.getValue(column.id)
    console.log(firstValue);
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
    ongoingDuels
}) => {
    console.log(ongoingDuels);
    const [data, setData] = React.useState(() => [...ongoingDuels])
    const rerender = React.useReducer(() => ({}), {})[1]

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
                        console.log(table.getRowModel().rows.length);
                        if (row.original.usernames === "52f03a32-b6e2-4514-bd66-a057b4e513c8") {
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
                                onClick={()=> navigate(`/duel/${row.original._id}`)}
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
        </div>
    )
}
