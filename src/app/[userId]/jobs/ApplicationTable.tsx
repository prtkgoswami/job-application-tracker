import { Job, JobStatus } from "@/types/job";
import { ActiveFilters } from "./OptionsModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import JobDetailsModal from "./JobDetailsModal";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

const STATUS_COLOR_MAP: Record<JobStatus, string> = {
  wishlist:
    "bg-fuchsia-300 hover:bg-fuchsia-400 text-fuchsia-700 border-fuchsia-600",
  applied: "bg-blue-300 hover:bg-blue-400 text-blue-700 border-blue-600",
  interviewing:
    "bg-amber-300 hover:bg-amber-400 text-amber-700 border-amber-600",
  rejected: "bg-red-300 hover:bg-red-400 text-red-700 border-red-600",
  offered: "bg-green-300 hover:bg-green-400 text-green-700 border-green-600",
  cancelled: "bg-gray-300 hover:bg-gray-400 text-gray-700 border-gray-600",
} as const;

interface ApplicationTableProps {
  userId: string;
  activeFilters: ActiveFilters;
  archivedApplicationIDs: Set<string>;
  jobs: Job[];
  isLoading: boolean;
  error?: Error;
  onStatusClick: (id: string) => void;
  refetch: () => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  userId,
  activeFilters,
  archivedApplicationIDs,
  jobs,
  isLoading,
  error,
  onStatusClick,
  refetch,
}) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const filteredJobs = useMemo<Job[]>(() => {
    let jobList: Job[] = [...jobs];

    switch (activeFilters.status) {
      case "active":
        jobList = jobList.filter(
          (job) => job.status === "applied" || job.status === "interviewing",
        );
        break;
      case "applied":
        jobList = jobList.filter((job) => job.status === "applied");
        break;
      case "wishlisted":
        jobList = jobList.filter((job) => job.status === "wishlist");
        break;
      case "interviewing":
        jobList = jobList.filter((job) => job.status === "interviewing");
        break;
      case "offered":
        jobList = jobList.filter((job) => job.status === "offered");
        break;
      case "rejected":
        jobList = jobList.filter((job) => job.status === "rejected");
        break;
    }

    if (activeFilters.jobType) {
      jobList = jobList.filter(
        (job) => job.jobType.toLowerCase() === activeFilters.jobType,
      );
    }

    if (activeFilters.company) {
      jobList = jobList.filter((job) => job.company === activeFilters.company);
    }

    if (activeFilters.location) {
      jobList = jobList.filter(
        (job) => job.location === activeFilters.location,
      );
    }

    if (!activeFilters.showArchived) {
      jobList = jobList.filter((job) => !archivedApplicationIDs.has(job.id));
    }

    return jobList;
  }, [jobs, activeFilters, archivedApplicationIDs]);

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
          <span className="capitalize text-zinc-400 text-sm">
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
              className={`w-full border ${STATUS_COLOR_MAP[status]} text-sm font-semibold px-3 py-1.5 rounded-md capitalize cursor-pointer transition-transform active:scale-95`}
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
    setSelectedJob(job);
  };

  const handleModalClose = (): void => {
    setSelectedJob(null);
  };

  if (isLoading) {
    return (
      <div className="grow w-full flex justify-center items-center mt-4 px-4">
        <div className="text-center text-xl py-10 text-zinc-400 animate-pulse">
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
        className="w-full h-full overflow-auto rounded-xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm"
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

      <JobDetailsModal
        userId={userId}
        jobData={selectedJob}
        isVisible={!!selectedJob}
        onClose={handleModalClose}
        refetchData={refetch}
      />
    </>
  );
};

export default ApplicationTable;
