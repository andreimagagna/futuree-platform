import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, DateRange } from "@/store/useStore";

export const DateRangeFilter = () => {
  const { dateRange, setDateRange } = useStore();

  return (
    <div className="flex items-center gap-2">
      <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
        <SelectTrigger className="w-[120px] h-9 text-xs">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="this_week">Esta Semana</SelectItem>
          <SelectItem value="this_month">Este Mês</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
