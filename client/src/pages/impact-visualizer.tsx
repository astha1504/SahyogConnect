import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Users, IndianRupee, Building, GraduationCap, Utensils } from "lucide-react";
import StatCard from "@/components/stat-card";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler } from 'chart.js';
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
  Legend,
  Filler
);

export default function ImpactVisualizer() {
  const { data: analyticsData = {} } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const impactStats = [
    { 
      value: "2,847", 
      label: "Total Donations", 
      icon: Gift, 
      color: "primary" as const 
    },
    { 
      value: "45,000+", 
      label: "Lives Impacted", 
      icon: Users, 
      color: "secondary" as const 
    },
    { 
      value: "₹12.4L", 
      label: "Total Value", 
      icon: IndianRupee, 
      color: "accent" as const 
    },
    { 
      value: "156", 
      label: "Partner NGOs", 
      icon: Building, 
      color: "success" as const 
    },
  ];

  const geographicData = [
    { city: "Mumbai", donations: 856, percentage: 85, color: "primary" },
    { city: "Delhi", donations: 642, percentage: 64, color: "secondary" },
    { city: "Bangalore", donations: 523, percentage: 52, color: "accent" },
  ];

  const impactStories = [
    {
      id: 1,
      title: "1000 Meals Served",
      description: "Bright Future Foundation successfully distributed 1000 meals to flood-affected families in Kerala.",
      timestamp: "2 days ago",
      icon: Utensils,
      color: "primary",
    },
    {
      id: 2,
      title: "50 Children Educated",
      description: "Education for All Trust opened a new learning center with supplies from recent donations.",
      timestamp: "1 week ago",
      icon: GraduationCap,
      color: "secondary",
    },
  ];

  // Chart data
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
        borderWidth: 0,
      },
    ],
  };

  const monthlyGrowthData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Donations',
        data: [65, 78, 90, 105, 125, 145],
        backgroundColor: 'hsl(142, 71%, 45%)',
        borderColor: 'hsl(142, 71%, 45%)',
        borderWidth: 1,
      },
    ],
  };

  const impactTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lives Impacted',
        data: [1200, 1900, 3000, 5000, 7200, 8900],
        borderColor: 'hsl(216, 90%, 58%)',
        backgroundColor: 'hsla(216, 90%, 58%, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
        <p className="text-gray-600 mt-2">Visualize the collective impact of our platform</p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {impactStats.map((stat, index) => (
          <div
            key={index}
            className={`gradient-${stat.color} text-white p-6 rounded-xl card-hover`}
          >
            <div className="text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-white/80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Donation Types Distribution */}
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

        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Donation Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={monthlyGrowthData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lives Impacted Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={impactTrendData} options={lineOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Geographic Impact */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Geographic Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {geographicData.map((location) => (
              <div key={location.city} className="text-center">
                <div className={`text-2xl font-bold text-${location.color} mb-2`}>
                  {location.city}
                </div>
                <div className="text-gray-600 mb-2">{location.donations} donations</div>
                <Progress value={location.percentage} className="h-2" />
                <div className="text-sm text-gray-500 mt-1">{location.percentage}% of total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Impact Stories */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Impact Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactStories.map((story) => (
              <div key={story.id} className="border border-gray-200 rounded-lg p-4 card-hover">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 bg-${story.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                    <story.icon className={`w-6 h-6 text-${story.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{story.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{story.description}</p>
                    <span className="text-xs text-gray-500">{story.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Join the Impact</h3>
              <p className="text-blue-100 mb-6">
                Every donation makes a difference. Start your journey of giving today and become part of these inspiring impact stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Donating
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
