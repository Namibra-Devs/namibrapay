import FilterSelect from "./FilterSelect";
import StatusSelect from "./StatusSelect";
import SearchInput from "./SearchInput";
import { mockAccounts, dateRangeOptions } from "@/lib/mock-data/transactions";
import type { TransactionStatus } from "@/lib/mock-data/transactions";

export interface TransactionFilterState {
  account: string;
  dateRange: string;
  statuses: TransactionStatus[];
  search: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilterState;
  onChange: <K extends keyof TransactionFilterState>(
    key: K,
    value: TransactionFilterState[K]
  ) => void;
}

export default function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FilterSelect
        options={mockAccounts}
        value={filters.account}
        onChange={(v) => onChange("account", v)}
      />
      <FilterSelect
        options={dateRangeOptions}
        value={filters.dateRange}
        onChange={(v) => onChange("dateRange", v)}
      />
      <StatusSelect
        values={filters.statuses}
        onChange={(v) => onChange("statuses", v)}
      />
      <SearchInput
        value={filters.search}
        onChange={(v) => onChange("search", v)}
        className="sm:w-56"
      />
    </div>
  );
}
