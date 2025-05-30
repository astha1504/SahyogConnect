import { Card, CardContent } from "@/components/ui/card";

interface ImpactStatsProps {
  stats: {
    totalDonations: number;
    totalNGOs: number;
    totalUsers: number;
    totalValue: number;
    livesImpacted: number;
  };
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {stats.totalDonations.toLocaleString()}
        </div>
        <div className="text-gray-600">Donations Completed</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-secondary mb-2">
          {stats.totalNGOs}
        </div>
        <div className="text-gray-600">Partner NGOs</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-accent mb-2">
          ₹{(stats.totalValue / 100000).toFixed(1)}L
        </div>
        <div className="text-gray-600">Funds Donated</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-success mb-2">
          {stats.livesImpacted.toLocaleString()}+
        </div>
        <div className="text-gray-600">Lives Impacted</div>
      </div>
    </div>
  );
}
