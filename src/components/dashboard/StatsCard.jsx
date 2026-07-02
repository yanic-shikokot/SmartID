import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", color)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
