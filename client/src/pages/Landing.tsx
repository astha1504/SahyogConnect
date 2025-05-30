import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImpactStats } from "@/components/ImpactStats";
import { NGOCard } from "@/components/NGOCard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { UserPlus, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: ngos } = useQuery({
    queryKey: ["/api/ngos"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Connect. <span className="text-accent">Donate.</span> Transform.
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Sahyog bridges the gap between generous donors and impactful NGOs, creating a transparent ecosystem for food, clothing, and monetary donations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                    Start Donating
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Join as NGO
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Community volunteers helping with donations" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      {stats && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact So Far</h2>
              <p className="text-lg text-gray-600">Real numbers, real change in communities worldwide</p>
            </div>
            <ImpactStats stats={stats} />
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Sahyog Works</h2>
            <p className="text-lg text-gray-600">Simple steps to make a meaningful impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">Create your account as a donor, NGO, or volunteer and join our community</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect</h3>
              <p className="text-gray-600">Find verified NGOs near you or post your donation requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Impact</h3>
              <p className="text-gray-600">Monitor your donations in real-time and see the direct impact of your generosity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured NGOs */}
      {ngos && ngos.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured NGOs</h2>
              <p className="text-lg text-gray-600">Verified organizations making a difference</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ngos.slice(0, 3).map((ngo: any) => (
                <NGOCard key={ngo.id} ngo={ngo} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
