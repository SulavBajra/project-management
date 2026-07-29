import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import type { ApprovalHistoryData } from "@/types/Approval/ApprovalHistory";
import { DataTable, SortableHeader } from "@/types/Expenses/data-table";
import type { Meta } from "@/types/Meta";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ApprovalHistory()
{
  const { user } = useAuth()
  const userId = user?.id
  const [currentPage, setCurrentPage] = useState(1)

  const { data: historiesData, isPending, error } = useQuery({
    queryKey: ["history", userId, currentPage],
    queryFn: async () => {
      const response = await api.get(`/api/approvals/history/?page=${currentPage}`,{params: {user_id: userId}})
      return {
        histories: response.data.data as ApprovalHistoryData[],
        meta: response.data.meta as Meta,
      }
    },
    enabled: !!userId
  })

  const histories = historiesData?.histories ?? []
  const meta = historiesData?.meta

  const columns: ColumnDef<ApprovalHistoryData>[] = useMemo(() => [
    {header: "S.N", cell: ({row}) => row.index + 1},
    {
      accessorKey: "approval_type",
      header: ({ column }) => <SortableHeader column={column} title="Approval" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.approval_type}</span>
      ),
    },
    {
      accessorKey: "from_state",
      header: ({column}) => <SortableHeader column={column} title="Previous State" />,
      cell: ({ row }) => {
        const state = row.original.from_state
        return (
          <span>{state !== null ? state : "Pending"}</span>
        )
      }
    },
    {
      accessorKey: "to_state",
      header: ({column}) => <SortableHeader column={column} title="Current State" />,
      cell: ({ row }) => (
        <span>{row.original.to_state}</span>
      )
    },
    {
      accessorKey: "acted_by",
      header: ({ column }) => <SortableHeader column={column} title="Acted By" />,
      cell: ({ row }) => (<span>{ row.original.acted_by}</span>)
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <SortableHeader column={column} title="Date" />,
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
  ],[])

  useEffect(() => {
      if(error) toast.error(error.message)
    },[error])

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-15" />
      </div>
    )
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={histories}
        searchPlaceholder="Search by approval name"
        pageCount={meta?.last_page ?? 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )

}
