import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Inbox, CheckCircle, Heart, Users, UserPen, MessageCircle, BarChart3, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import StatCard from "@/components/stat-card";

export default function NgoDashboard() {
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["/api/donations/nearby"],
  });

  const { data: ngoProfile } = useQuery({
    queryKey: ["/api/ngos/profile"],
  });

  const stats = [
    { value: "8", label: "Pending Requests", icon: Inbox, color: "primary" as const },
    { value: "12", label: "Active Donations", icon: CheckCircle, color: "secondary" as const },
    { value: "156", label: "Total Received", icon: Heart, color: "accent" as const },
    { value: "2,847", label: "People Helped", icon: Users, color: "success" as const },
  ];

  const nearbyDonations = donations.filter(d => d.status === "pending").slice(0, 4);

  const recentActivity = [
    {
      id: 1,
      message: "Successfully delivered food packages to 25 families",
      timestamp: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      message: "New donation request accepted from John's Restaurant",
      timestamp: "5 hours ago",
      type: "info",
    },
    {
      id: 3,
      message: "Profile verification documents submitted for review",
      timestamp: "1 day ago",
      type: "warning",
    },
  ];

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      low: "bg-blue-100 text-blue-600",
      medium: "bg-gray-100 text-gray-600",
      high: "bg-orange-100 text-orange-600",
      critical: "bg-red-100 text-red-600",
    };
    return variants[urgency as keyof typeof variants] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage donations and your organization profile</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Nearby Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
                ))}
              </div>
            ) : nearbyDonations.length > 0 ? (
              <div className="space-y-4">
                {nearbyDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{donation.title}</h3>
                        <p className="text-sm text-gray-600">{donation.quantity}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {donation.pickupAddress.split(",")[0]}
                        </p>
                      </div>
                      <Badge className={getUrgencyBadge(donation.urgency)}>
                        {donation.urgency}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Posted {new Date(donation.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" className="btn-primary">
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Inbox className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending donations in your area</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/ngo/profile">
                <Button
                  variant="outline"
                  className="w-full justify-start p-4 h-auto hover:border-primary"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-lg mr-4">
                      <UserPen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Update Profile</h3>
                      <p className="text-sm text-gray-600">Manage organization details</p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/chat">
                <Button
                  variant="outline"
                  className="w-full justify-start p-4 h-auto hover:border-primary"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-secondary bg-opacity-10 rounded-lg mr-4">
                      <MessageCircle className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Message Donors</h3>
                      <p className="text-sm text-gray-600">Communicate with supporters</p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/impact">
                <Button
                  variant="outline"
                  className="w-full justify-start p-4 h-auto hover:border-primary"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-accent bg-opacity-10 rounded-lg mr-4">
                      <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">View Analytics</h3>
                      <p className="text-sm text-gray-600">Track impact and performance</p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
