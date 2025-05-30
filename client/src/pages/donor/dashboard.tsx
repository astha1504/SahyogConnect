import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Clock, IndianRupee, Users, Plus, Route, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import StatCard from "@/components/stat-card";
import DonationCard from "@/components/donation-card";

export default function DonorDashboard() {
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  const stats = [
    { value: "23", label: "Total Donations", icon: Gift, color: "primary" as const },
    { value: "5", label: "Active Donations", icon: Clock, color: "secondary" as const },
    { value: "₹45,200", label: "Amount Donated", icon: IndianRupee, color: "accent" as const },
    { value: "342", label: "Lives Impacted", icon: Users, color: "success" as const },
  ];

  const recentDonations = donations.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your donations and track their impact</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/donor/add-donation">
          <Card className="cursor-pointer card-hover gradient-primary text-white">
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Add New Donation</h3>
              <p className="text-blue-100 text-sm">Create a new donation request</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/donor/track-donations">
          <Card className="cursor-pointer card-hover gradient-secondary text-white">
            <CardContent className="p-6 text-center">
              <Route className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Track Donations</h3>
              <p className="text-green-100 text-sm">Monitor donation progress</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chat">
          <Card className="cursor-pointer card-hover gradient-accent text-white">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Chat with NGOs</h3>
              <p className="text-orange-100 text-sm">Communicate directly</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
              ))}
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No donations yet. Start by creating your first donation!</p>
              <Link href="/donor/add-donation">
                <Button className="mt-4 btn-primary">
                  Add Donation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
