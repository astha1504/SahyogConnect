import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Shield } from "lucide-react";
import { Link } from "wouter";

interface NGO {
  id: number;
  orgName: string;
  description: string;
  city: string;
  state: string;
  verified: boolean;
  focusAreas: string;
  gallery: string;
}

interface NGOCardProps {
  ngo: NGO;
}

export function NGOCard({ ngo }: NGOCardProps) {
  const focusAreas = JSON.parse(ngo.focusAreas || "[]");
  const gallery = JSON.parse(ngo.gallery || "[]");
  const imageUrl = gallery[0] || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={imageUrl} 
        alt={`${ngo.orgName} activities`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{ngo.orgName}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{ngo.description}</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <span className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {ngo.city}, {ngo.state}
          </span>
          {ngo.verified && (
            <span className="flex items-center text-sm text-green-600">
              <Shield className="h-4 w-4 mr-1" />
              Verified
            </span>
          )}
          <span className="flex items-center text-sm text-yellow-600">
            <Star className="h-4 w-4 mr-1" />
            4.8 Rating
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {focusAreas.slice(0, 3).map((area: string) => (
            <Badge key={area} variant="secondary" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary font-medium">97% Impact Score</span>
          <Link href={`/ngo/${ngo.id}`}>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
