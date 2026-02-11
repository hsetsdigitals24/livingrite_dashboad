import { ArrowDown, ArrowUp } from "lucide-react";

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  positive,
  color
}: {
  label: string;
  value: any;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  positive?: boolean;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          {Icon && <Icon className="w-6 h-6 text-indigo-600" />}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {change && (
          <span className={`text-sm font-medium flex items-center gap-1 ${positive ? "text-green-600" : "text-red-600"}`}>
            {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
export default MetricCard;