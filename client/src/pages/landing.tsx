import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Heart, Users, TrendingUp, Shield, MapPin, Star } from "lucide-react";
import StatCard from "@/components/stat-card";
import NgoCard from "@/components/ngo-card";

export default function Landing() {
  const impactStats = [
    { value: "2,847", label: "Donations Completed", icon: Heart },
    { value: "156", label: "Partner NGOs", icon: Users },
    { value: "₹12.4L", label: "Funds Donated", icon: TrendingUp },
    { value: "45,000+", label: "Lives Impacted", icon: Shield },
  ];

  const featuredNgos = [
    {
      id: 1,
      name: "Bright Future Foundation",
      description: "Providing education and nutrition to underprivileged children across rural communities.",
      location: "Mumbai, Maharashtra",
      impactScore: 97,
      verified: true,
      focusAreas: ["Education", "Nutrition", "Healthcare"],
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Hunger Relief Initiative",
      description: "Fighting hunger by distributing meals and groceries to families in need.",
      location: "Delhi, India",
      impactScore: 95,
      verified: true,
      focusAreas: ["Food Security", "Emergency Relief"],
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Community Health Alliance",
      description: "Delivering healthcare services and medical supplies to remote areas.",
      location: "Bangalore, Karnataka",
      impactScore: 93,
      verified: true,
      focusAreas: ["Healthcare", "Medical Aid"],
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=200&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary py-20">
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
                  <Button size="lg" className="btn-accent">
                    Start Donating
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="bg-white text-primary border-white hover:bg-gray-100">
                    Join as NGO
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                alt="Community volunteers helping with donations"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact So Far</h2>
            <p className="text-lg text-gray-600">Real numbers, real change in communities worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                color="primary"
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Sahyog Works</h2>
            <p className="text-lg text-gray-600">Simple steps to make a meaningful impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">Create your account as a donor, NGO, or volunteer and join our community</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect</h3>
              <p className="text-gray-600">Find verified NGOs near you or post your donation requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Impact</h3>
              <p className="text-gray-600">Monitor your donations in real-time and see the direct impact of your generosity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NGOs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured NGOs</h2>
            <p className="text-lg text-gray-600">Verified organizations making a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredNgos.map((ngo) => (
              <NgoCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of donors and verified NGOs in creating positive change in communities across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/impact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                View Impact Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
