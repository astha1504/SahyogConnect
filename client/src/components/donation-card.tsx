import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Shirt, IndianRupee, Clock } from "lucide-react";

interface Donation {
  id: number;
  title: string;
  type: string;
  quantity: string;
  status: string;
  createdAt: string;
}

interface DonationCardProps {
  donation: Donation;
}

export default function DonationCard({ donation }: DonationCardProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      in_transit: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Utensils className="w-5 h-5 text-primary" />;
      case "clothes":
        return <Shirt className="w-5 h-5 text-accent" />;
      case "money":
        return <IndianRupee className="w-5 h-5 text-secondary" />;
      default:
        return <Utensils className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-primary bg-opacity-10";
      case "clothes":
        return "bg-accent bg-opacity-10";
      case "money":
        return "bg-secondary bg-opacity-10";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(donation.type)}`}>
              {getTypeIcon(donation.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{donation.title}</h3>
              <p className="text-sm text-gray-600">{donation.quantity}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusBadge(donation.status)}>
              {donation.status.replace("_", " ").toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(donation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
