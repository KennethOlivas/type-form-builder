"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash, Eye } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteSubmission } from "@/actions"

interface ResponsesTableProps {
    submissions: any[]
    questions: any[]
    refreshData: () => void
}

export function ResponsesTable({ submissions, questions, refreshData }: ResponsesTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const [selectedSubmission, setSelectedSubmission] = React.useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
    const [deleteId, setDeleteId] = React.useState<string | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

    // Define columns dynamically
    const columns: ColumnDef<any>[] = React.useMemo(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                accessorKey: "submittedAt",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Submission Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => <div>{format(new Date(row.getValue("submittedAt")), "PPpp")}</div>,
            },
        ]

        const questionColumns: ColumnDef<any>[] = questions.map((q) => ({
            accessorKey: `answers.${q.id}`, // Access nested answers
            id: q.id,
            header: q.label,
            cell: ({ row }) => {
                const answer = (row.original.answers as any)[q.id]
                if (Array.isArray(answer)) return answer.join(", ")
                return answer
            },
        }))

        const actionColumn: ColumnDef<any> = {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const submission = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                                setSelectedSubmission(submission)
                                setIsDetailsOpen(true)
                            }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                    setDeleteId(submission.id)
                                    setIsDeleteOpen(true)
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        }

        return [...baseColumns, ...questionColumns, actionColumn]
    }, [questions])

    const table = useReactTable({
        data: submissions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId)
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search responses..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === "submittedAt" ? "Date" : questions.find(q => q.id === column.id)?.label || column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="w-[400px] sm:w-[600px] flex flex-col h-full">
                    <SheetHeader className="border-b pb-4">
                        <SheetTitle className="flex items-center justify-between">
                            <span>Response Details</span>
                            <div className="flex items-center gap-2 mr-6">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const currentIndex = submissions.findIndex(s => s.id === selectedSubmission?.id)
                                        if (currentIndex > 0) {
                                            setSelectedSubmission(submissions[currentIndex - 1])
                                        }
                                    }}
                                    disabled={!selectedSubmission || submissions.findIndex(s => s.id === selectedSubmission.id) === 0}
                                >
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const currentIndex = submissions.findIndex(s => s.id === selectedSubmission?.id)
                                        if (currentIndex < submissions.length - 1) {
                                            setSelectedSubmission(submissions[currentIndex + 1])
                                        }
                                    }}
                                    disabled={!selectedSubmission || submissions.findIndex(s => s.id === selectedSubmission.id) === submissions.length - 1}
                                >
                                    <ChevronDown className="h-4 w-4 -rotate-90" />
                                </Button>
                            </div>
                        </SheetTitle>
                        <SheetDescription>
                            Submitted on {selectedSubmission && format(new Date(selectedSubmission.submittedAt), "PPpp")}
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="flex-1 -mx-6 px-6">
                        <div className="space-y-6 py-6">
                            {selectedSubmission && questions.map((q, index) => (
                                <div key={q.id} className="bg-muted/30 p-4 rounded-lg border space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                            {index + 1}
                                        </span>
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-medium leading-none">{q.label}</h4>
                                            <p className="text-xs text-muted-foreground">{q.type}</p>
                                        </div>
                                    </div>
                                    <div className="pl-9">
                                        <p className="text-sm font-medium">
                                            {Array.isArray(selectedSubmission.answers[q.id])
                                                ? selectedSubmission.answers[q.id].join(", ")
                                                : selectedSubmission.answers[q.id] || <span className="text-muted-foreground italic">No answer</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {selectedSubmission && (
                                <div className="border-t pt-6 mt-6 space-y-4">
                                    <h4 className="font-semibold">Metadata</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block">ID</span>
                                            <span className="font-mono text-xs">{selectedSubmission.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Device</span>
                                            <span className="capitalize">{selectedSubmission.device || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="border-t pt-4 mt-auto">
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                                setDeleteId(selectedSubmission.id)
                                setIsDeleteOpen(true)
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Response
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (deleteId) {
                                    try {
                                        await deleteSubmission(deleteId)
                                        refreshData()
                                        setIsDetailsOpen(false)
                                        setSelectedSubmission(null)
                                    } catch (e) {
                                        console.error(e)
                                    }
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
