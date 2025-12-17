import { Job } from "@/types/job";
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

type JobStatus =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offered";

const STATUS_COLOR_MAP: Record<JobStatus, string> = {
  wishlist:
    "bg-fuchsia-300 hover:bg-fuchsia-400 text-fuchsia-700 border-fuchsia-600",
  applied: "bg-blue-300 hover:bg-blue-400 text-blue-700 border-blue-600",
  interviewing:
    "bg-amber-300 hover:bg-amber-400 text-amber-700 border-amber-600",
  rejected: "bg-red-300 hover:bg-red-400 text-red-700 border-red-600",
  offered: "bg-green-300 hover:bg-green-400 text-green-700 border-green-600",
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
          (job) => job.status === "applied" || job.status === "interviewing"
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
        (job) => job.jobType.toLowerCase() === activeFilters.jobType
      );
    }

    if (activeFilters.company) {
      jobList = jobList.filter((job) => job.company === activeFilters.company);
    }

    if (activeFilters.location) {
      jobList = jobList.filter(
        (job) => job.location === activeFilters.location
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
        cell: (info: CellContext<Job, unknown>) => info.row.index + 1,
        size: 30,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info: CellContext<Job, unknown>) => info.getValue() as string,
        size: 300,
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: (info: CellContext<Job, unknown>) => info.getValue() as string,
        size: 140,
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: (info: CellContext<Job, unknown>) => {
          const value = info.getValue() as string | undefined;
          return value ? (
            <span className="capitalize">{value}</span>
          ) : (
            <span className="text-gray-400">--</span>
          );
        },
        size: 110,
      },
      {
        accessorKey: "jobType",
        header: "Type",
        cell: (info: CellContext<Job, unknown>) => (
          <span className="capitalize">{info.getValue() as string}</span>
        ),
        size: 80,
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
              className={`w-full h-full border ${STATUS_COLOR_MAP[status]} text-sm px-4 py-1 rounded-md capitalize cursor-pointer`}
              onClick={handleClick}
            >
              {status}
            </button>
          );
        },
        size: 110,
      },
      {
        accessorKey: "createDate",
        header: "Apply Date",
        cell: (info: CellContext<Job, unknown>) => info.getValue() as string,
        size: 100,
      },
      {
        accessorKey: "lastUpdateDate",
        header: "Last Updated",
        cell: (info: CellContext<Job, unknown>) => info.getValue() as string,
        size: 100,
      },
    ],
    [onStatusClick]
  );

  const table = useReactTable<Job>({
    data: filteredJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
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
        <div className="text-center text-xl py-10">
          <FontAwesomeIcon icon={faSpinner} size="2xl" spin /> Fetching Job
          List...
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={tableContainerRef}
        className="grow w-full flex md:justify-center items-start overflow-auto mt-4 px-4 pb-8 md:pb-0 md:px-0"
      >
        <div className="w-full">
          <table className="w-full table-fixed border-separate">
            <thead className="sticky top-0 z-10 bg-zinc-950">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 py-2 text-center font-semibold border border-gray-200/20 text-amber-500"
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              className="text-sm leading-relaxed md:text-base relative"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 border border-gray-200/20 text-center text-md text-gray-100/50"
                  >
                    You Don&apos;t have any applications. Try adding a new
                    Entry.
                  </td>
                </tr>
              ) : (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  if (!row) return null;

                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.original)}
                      className=" w-full cursor-pointer hover:bg-amber-50/5 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`px-2 py-2 text-center border border-gray-200/20 ${
                            virtualRow.index % 2 === 0 ? "bg-amber-50/10" : ""
                          }`}
                          style={{
                            width:
                              cell.column.getSize() !== 150
                                ? cell.column.getSize()
                                : undefined,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
