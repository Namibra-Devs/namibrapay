import FilterSelect from "./FilterSelect";
import DateRangeSelect from "./DateRangeSelect";
import StatusSelect from "./StatusSelect";
import SearchInput from "./SearchInput";
import { mockAccounts } from "@/lib/mock-data/transactions";
import type { StatusFilterState } from "./StatusSelect";
import { DEFAULT_STATUS_FILTER } from "./StatusSelect";
import type { DateRangeValue } from "./DateRangeSelect";

export type { StatusFilterState };
export { DEFAULT_STATUS_FILTER };

export interface TransactionFilterState {
  account: string;
  dateRange: DateRangeValue;
  statusFilter: StatusFilterState;
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
        searchable
      />
      <DateRangeSelect
        value={filters.dateRange}
        onChange={(v) => onChange("dateRange", v)}
      />
      <StatusSelect
        value={filters.statusFilter}
        onChange={(v) => onChange("statusFilter", v)}
      />
      <SearchInput
        value={filters.search}
        onChange={(v) => onChange("search", v)}
        className="sm:w-56"
      />
    </div>
  );
}
