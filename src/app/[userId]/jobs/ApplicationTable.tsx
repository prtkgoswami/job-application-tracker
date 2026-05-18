import { Job, JobStatus } from "@/types/job";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";

const STATUS_COLOR_MAP: Record<JobStatus, string> = {
  wishlist:
    "bg-fuchsia-500/10 hover:bg-fuchsia-500/0 text-fuchsia-300 border-fuchsia-400",
  applied: "bg-blue-500/10 hover:bg-blue-500/0 text-blue-300 border-blue-400",
  interviewing:
    "bg-amber-500/10 hover:bg-amber-500/0 text-amber-300 border-amber-400",
  rejected: "bg-red-500/10 hover:bg-red-500/0 text-red-300 border-red-400",
  offered: "bg-green-500/10 hover:bg-green-500/0 text-green-300 border-green-400",
  cancelled: "bg-gray-500/10 hover:bg-gray-500/0 text-gray-300 border-gray-400",
} as const;

interface ApplicationTableProps {
  userId: string;
  searchQuery: string;
  showAllJobs: boolean;
  archivedApplicationIDs: Set<string>;
  jobs: Job[];
  isLoading: boolean;
  error?: Error;
  onStatusClick: (id: string) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  userId,
  searchQuery,
  showAllJobs,
  archivedApplicationIDs,
  jobs,
  isLoading,
  error,
  onStatusClick,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredJobs = useMemo<Job[]>(() => {

    // Strategy: Separate global flags from textual keyword search
    let results = jobs.filter((job) => !archivedApplicationIDs.has(job.id));

    if (!showAllJobs) {
    results = results.filter(
      (job) => job.status === "applied" || job.status === "interviewing"
    );
  }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) {
      return results;
    }

    return results.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";
      const jobType = job.jobType?.toLowerCase() || "";
      const status = job.status?.toLowerCase() || "";

      // Semantic sugar: let 'wishlisted' keyword capture the 'wishlist' status record
      const isWishlistMatch = 
        status === "wishlist" && normalizedQuery.includes("wishlist");

      return (
        title.includes(normalizedQuery) ||
        company.includes(normalizedQuery) ||
        location.includes(normalizedQuery) ||
        jobType.includes(normalizedQuery) ||
        status.includes(normalizedQuery) ||
        isWishlistMatch
      );
    });
  }, [jobs, searchQuery, archivedApplicationIDs]);

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        id: "index",
        header: "#",
        cell: (info: CellContext<Job, unknown>) => (
          <span className="text-zinc-500 font-mono text-sm">
            {info.row.index + 1}
          </span>
        ),
        size: 50,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info: CellContext<Job, unknown>) => (
          <div
            className="truncate font-medium text-zinc-200 text-sm"
            title={info.getValue() as string}
          >
            {info.getValue() as string}
          </div>
        ),
        size: 370,
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: (info: CellContext<Job, unknown>) => (
          <div
            className="truncate text-zinc-300 text-sm"
            title={info.getValue() as string}
          >
            {info.getValue() as string}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: (info: CellContext<Job, unknown>) => {
          const value = info.getValue() as string | undefined;
          return value ? (
            <div
              className="capitalize truncate text-zinc-400 text-sm"
              title={value}
            >
              {value}
            </div>
          ) : (
            <span className="text-zinc-600 text-sm">--</span>
          );
        },
        size: 200,
      },
      {
        accessorKey: "jobType",
        header: "Type",
        cell: (info: CellContext<Job, unknown>) => (
          <span className="capitalize text-sm border px-2 py-1 rounded-sm border-accent-3 bg-accent-3/10 text-foreground w-20 text-center">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info: CellContext<Job, unknown>) => {
          const status = info.getValue() as JobStatus;
          const jobId = info.row.original.id;

          const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onStatusClick(jobId);
          };

          return (
            <button
              type="button"
              className={`w-full border ${STATUS_COLOR_MAP[status]} text-sm font-semibold px-3 py-1.5 rounded-md capitalize cursor-pointer transition-all active:scale-95 duration-150 ease-in-out`}
              onClick={handleClick}
            >
              {status}
            </button>
          );
        },
        size: 160,
      },
      {
        accessorKey: "createDate",
        header: "Apply Date",
        cell: (info: CellContext<Job, unknown>) => (
          <span className="text-zinc-400 text-sm">
            {info.getValue() as string}
          </span>
        ),
        size: 140,
      },
      {
        accessorKey: "lastUpdateDate",
        header: "Last Updated",
        cell: (info: CellContext<Job, unknown>) => (
          <span className="text-zinc-500 text-sm">
            {info.getValue() as string}
          </span>
        ),
        size: 140,
      },
    ],
    [onStatusClick],
  );

  const table = useReactTable<Job>({
    data: filteredJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 150, // Default column size
    },
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 64, // Approximate row height
    overscan: 20,
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleRowClick = (job: Job): void => {
    router.push(`/${userId}/jobs/${job.id}`)
  };

  if (isLoading) {
    return (
      <div className="grow w-full flex justify-center items-center mt-4 px-4">
        <div className="text-center text-xl py-10 text-foreground/50 animate-pulse">
          <FontAwesomeIcon icon={faSpinner} size="2xl" spin className="mb-4" />
          <p>Fetching Job List...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={tableContainerRef}
        className="w-full h-full overflow-auto rounded-xl border border-foreground/5 bg-zinc-900/20 backdrop-blur-sm"
      >
        <div
          style={{
            width: table.getTotalSize(),
            minWidth: "100%",
          }}
          className="flex flex-col"
          role="table"
        >
          {/* Header */}
          <div
            className="sticky top-0 z-20 bg-zinc-950 shadow-sm border-b border-zinc-800 flex min-w-full"
            role="rowgroup"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex w-full" role="row">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center"
                    style={{
                      width: header.getSize(),
                    }}
                    role="columnheader"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Body */}
          <div
            className="relative w-full"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
            role="rowgroup"
          >
            {filteredJobs.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium text-zinc-300 mb-1">
                    No applications found
                  </p>
                  <p className="text-sm">Add a new entry to get started.</p>
                </div>
              </div>
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                if (!row) return null;

                return (
                  <div
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className="group absolute w-full flex cursor-pointer hover:bg-zinc-800/40 transition-colors duration-150 ease-in-out border-b border-zinc-800/50"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    role="row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="px-4 py-3 flex items-center shrink-0"
                        style={{
                          width: cell.column.getSize(),
                        }}
                        role="cell"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationTable;
