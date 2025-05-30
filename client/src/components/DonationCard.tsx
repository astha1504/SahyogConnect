import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, getStatusColor, getUrgencyColor } from "@/lib/utils";
import { Package, Shirt, DollarSign, MapPin, Clock } from "lucide-react";

interface Donation {
  id: number;
  title: string;
  description: string;
  type: string;
  quantity: string;
  amount: string;
  status: string;
  urgency: string;
  pickupAddress: string;
  createdAt: string;
}

interface DonationCardProps {
  donation: Donation;
  showActions?: boolean;
  onAccept?: (id: number) => void;
  onChat?: (id: number) => void;
}

export function DonationCard({ donation, showActions = false, onAccept, onChat }: DonationCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Package className="h-5 w-5" />;
      case "clothes":
        return <Shirt className="h-5 w-5" />;
      case "money":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "text-primary";
      case "clothes":
        return "text-accent";
      case "money":
        return "text-secondary";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-opacity-10 rounded-lg ${getTypeColor(donation.type)} bg-current`}>
              {getTypeIcon(donation.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{donation.title}</h3>
              <p className="text-sm text-gray-600">{donation.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getStatusColor(donation.status)}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1).replace('_', ' ')}
            </Badge>
            <Badge className={getUrgencyColor(donation.urgency)}>
              {donation.urgency.charAt(0).toUpperCase() + donation.urgency.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            {donation.quantity || donation.amount}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {donation.pickupAddress}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {formatRelativeTime(donation.createdAt)}
          </div>
        </div>

        {showActions && (
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-xs text-gray-500">
              Posted {formatRelativeTime(donation.createdAt)}
            </span>
            <div className="flex space-x-2">
              {onChat && (
                <Button variant="outline" size="sm" onClick={() => onChat(donation.id)}>
                  Chat
                </Button>
              )}
              {onAccept && donation.status === "pending" && (
                <Button size="sm" onClick={() => onAccept(donation.id)}>
                  Accept
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
