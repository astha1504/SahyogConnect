import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, MessageCircle, Share, Download, Eye, Star } from "lucide-react";
import Timeline from "@/components/timeline";
import { Link } from "wouter";

export default function TrackDonations() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  const filteredDonations = donations.filter((donation) => {
    if (statusFilter !== "all" && donation.status !== statusFilter) return false;
    if (typeFilter !== "all" && donation.type !== typeFilter) return false;
    return true;
  });

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

  const getProgress = (status: string) => {
    const progressMap = {
      pending: 25,
      accepted: 50,
      in_transit: 75,
      delivered: 100,
      cancelled: 0,
    };
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  const getTimelineSteps = (donation: any) => [
    {
      title: "Donation Created",
      description: `Created on ${new Date(donation.createdAt).toLocaleDateString()}`,
      status: "completed",
      timestamp: donation.createdAt,
    },
    {
      title: "NGO Acceptance",
      description: donation.ngoId ? "Accepted by NGO" : "Waiting for NGO acceptance",
      status: donation.ngoId ? "completed" : "pending",
      timestamp: donation.ngoId ? donation.updatedAt : null,
    },
    {
      title: "Pickup/Processing",
      description: donation.status === "in_transit" ? "Pickup in progress" : "Awaiting pickup",
      status: donation.status === "in_transit" || donation.status === "delivered" ? "completed" : "pending",
      timestamp: donation.status === "in_transit" ? donation.updatedAt : null,
    },
    {
      title: "Delivery Complete",
      description: donation.status === "delivered" ? "Successfully delivered" : "Pending delivery",
      status: donation.status === "delivered" ? "completed" : "pending",
      timestamp: donation.status === "delivered" ? donation.updatedAt : null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Donations</h1>
        <p className="text-gray-600 mt-2">Monitor the progress of your donations in real-time</p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="clothes">Clothes</SelectItem>
                <SelectItem value="money">Money</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" placeholder="Filter by date" />

            <Button className="btn-primary">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDonations.map((donation) => (
            <Card key={donation.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                    <p className="text-gray-600">
                      {donation.type.charAt(0).toUpperCase() + donation.type.slice(1)} - {donation.quantity}
                    </p>
                    <Badge className={`mt-2 ${getStatusBadge(donation.status)}`}>
                      {donation.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">DON-{donation.id.toString().padStart(6, "0")}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{getProgress(donation.status)}% Complete</span>
                  </div>
                  <Progress value={getProgress(donation.status)} className="h-2" />
                </div>

                {/* Timeline */}
                <Timeline steps={getTimelineSteps(donation)} />

                {/* Impact Stats for Completed Donations */}
                {donation.status === "delivered" && donation.actualImpact && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-green-800 mb-2">Impact Report</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-600">People Helped</p>
                        <p className="text-xl font-bold text-green-800">{donation.actualImpact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Distribution Complete</p>
                        <p className="text-xl font-bold text-green-800">100%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  {donation.status !== "delivered" ? (
                    <Link href="/chat">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with NGO
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Impact Photos
                    </Button>
                  )}

                  <div className="flex space-x-2">
                    {donation.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-1" />
                        Rate NGO
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      {donation.status === "delivered" ? "Certificate" : "Receipt"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredDonations.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No donations found matching your filters.</p>
                <Link href="/donor/add-donation">
                  <Button className="btn-primary">Create Your First Donation</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
