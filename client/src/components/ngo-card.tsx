import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Star } from "lucide-react";
import { Link } from "wouter";

interface Ngo {
  id: number;
  name: string;
  description: string;
  location: string;
  impactScore: number;
  verified: boolean;
  focusAreas: string[];
  image: string;
}

interface NgoCardProps {
  ngo: Ngo;
}

export default function NgoCard({ ngo }: NgoCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative">
        <img 
          src={ngo.image} 
          alt={`${ngo.name} activities`}
          className="w-full h-48 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-10" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{ngo.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ngo.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              {ngo.location}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {ngo.focusAreas.slice(0, 2).map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {ngo.focusAreas.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{ngo.focusAreas.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {ngo.verified && (
              <span className="flex items-center text-sm text-green-600">
                <Shield className="w-4 h-4 mr-1" />
                Verified
              </span>
            )}
            <span className="flex items-center text-sm text-yellow-600">
              <Star className="w-4 h-4 mr-1" />
              {ngo.impactScore}% Impact
            </span>
          </div>
          <Link href="/ngo/profile">
            <Button variant="outline" size="sm" className="text-primary hover:text-primary/80">
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
