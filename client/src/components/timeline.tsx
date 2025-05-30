import { CheckCircle, Clock, Circle } from "lucide-react";

interface TimelineStep {
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  timestamp?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "current":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "pending":
        return <Circle className="w-4 h-4 text-gray-300" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700";
      case "current":
        return "text-orange-700";
      case "pending":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(step.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getStatusColor(step.status)}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{step.description}</p>
            {step.timestamp && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(step.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
