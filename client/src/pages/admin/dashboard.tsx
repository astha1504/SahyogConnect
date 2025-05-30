import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Users, TrendingUp, MapPin, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/stat-card";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingNgos = [], isLoading: loadingNgos } = useQuery({
    queryKey: ["/api/ngos/pending"],
  });

  const { data: analyticsData = {} } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const verifyNgoMutation = useMutation({
    mutationFn: async ({ ngoId, verified }: { ngoId: number; verified: boolean }) => {
      const response = await apiRequest("PATCH", `/api/ngos/${ngoId}/verify`, { verified });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/ngos/pending"] });
      toast({
        title: variables.verified ? "NGO Approved" : "NGO Rejected",
        description: `The NGO has been ${variables.verified ? "approved" : "rejected"} successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update NGO status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const stats = [
    { 
      value: pendingNgos.length.toString(), 
      label: "Pending Approvals", 
      icon: Clock, 
      color: "warning" as const 
    },
    { 
      value: "156", 
      label: "Verified NGOs", 
      icon: CheckCircle, 
      color: "secondary" as const 
    },
    { 
      value: analyticsData.totalDonations?.toString() || "0", 
      label: "Active Donors", 
      icon: Users, 
      color: "primary" as const 
    },
    { 
      value: "+23%", 
      label: "Platform Growth", 
      icon: TrendingUp, 
      color: "accent" as const 
    },
  ];

  const handleVerifyNgo = (ngoId: number, verified: boolean) => {
    verifyNgoMutation.mutate({ ngoId, verified });
  };

  const recentActivity = [
    {
      id: 1,
      message: 'NGO "Hope Foundation" has been verified and approved',
      timestamp: "1 hour ago",
      type: "success",
    },
    {
      id: 2,
      message: "New donation flagged for review - Large monetary donation",
      timestamp: "3 hours ago",
      type: "warning",
    },
    {
      id: 3,
      message: "Platform reached 3000 total users milestone",
      timestamp: "1 day ago",
      type: "info",
    },
    {
      id: 4,
      message: "NGO registration rejected - Invalid documentation",
      timestamp: "2 days ago",
      type: "error",
    },
  ];

  // Chart data
  const platformGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Platform Growth',
        data: [120, 190, 300, 500, 720, 890],
        borderColor: 'hsl(216, 90%, 58%)',
        backgroundColor: 'hsla(216, 90%, 58%, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const donationTypesData = {
    labels: ['Food', 'Clothes', 'Money'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          'hsl(216, 90%, 58%)',
          'hsl(158, 70%, 30%)',
          'hsl(20, 91%, 48%)',
        ],
      },
    ],
  };

  const monthlyGrowthData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        label: 'Donations',
        data: [65, 78, 90, 105],
        backgroundColor: 'hsl(142, 71%, 45%)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform oversight and NGO management</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* NGO Approval Queue & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* NGO Registration Requests */}
        <Card>
          <CardHeader>
            <CardTitle>NGO Registration Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingNgos ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
                ))}
              </div>
            ) : pendingNgos.length > 0 ? (
              <div className="space-y-4">
                {pendingNgos.map((ngo: any) => (
                  <div key={ngo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ngo.organizationName}</h3>
                        <p className="text-sm text-gray-600">{ngo.description}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {ngo.location}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-600">Pending</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Submitted {new Date(ngo.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleVerifyNgo(ngo.id, false)}
                          disabled={verifyNgoMutation.isPending}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleVerifyNgo(ngo.id, true)}
                          disabled={verifyNgoMutation.isPending}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending NGO registrations</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={platformGrowthData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Donation Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={donationTypesData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={monthlyGrowthData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
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
                      : activity.type === "error"
                      ? "bg-red-500"
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
