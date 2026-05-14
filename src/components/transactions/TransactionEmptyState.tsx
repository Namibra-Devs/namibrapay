interface TransactionEmptyStateProps {
  hasFilters: boolean;
}

function EmptyFolderIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Folder body */}
      <path
        d="M6 18C6 15.8 7.8 14 10 14H24L30 20H54C56.2 20 58 21.8 58 24V50C58 52.2 56.2 54 54 54H10C7.8 54 6 52.2 6 50V18Z"
        stroke="#64c6c3"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* X mark */}
      <path
        d="M24 32L40 46M40 32L24 46"
        stroke="#64c6c3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TransactionEmptyState({ hasFilters }: TransactionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-4">
        <EmptyFolderIcon />
      </div>
      <p className="text-base font-semibold text-gray-700 mb-1">
        {hasFilters ? "No transactions" : "No transactions yet"}
      </p>
      <p className="text-sm text-gray-400 max-w-xs">
        {hasFilters
          ? "There are no transactions for this query. Please try another query or clear your filters."
          : "Your transactions will appear here once you start accepting payments."}
      </p>
    </div>
  );
}
