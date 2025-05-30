import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success" | "warning";
}

export default function StatCard({ value, label, icon: Icon, color }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary bg-opacity-10 text-primary";
      case "secondary":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "accent":
        return "bg-accent bg-opacity-10 text-accent";
      case "success":
        return "bg-success bg-opacity-10 text-success";
      case "warning":
        return "bg-warning bg-opacity-10 text-warning";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
