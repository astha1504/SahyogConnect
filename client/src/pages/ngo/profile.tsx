import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, Star, Phone, Globe, Edit } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ngoProfileSchema = z.object({
  organizationName: z.string().min(3, "Organization name is required"),
  description: z.string().min(10, "Description is required"),
  mission: z.string().min(10, "Mission statement is required"),
  location: z.string().min(5, "Location is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is required"),
  focusAreas: z.array(z.string()).min(1, "At least one focus area is required"),
});

type NgoProfileForm = z.infer<typeof ngoProfileSchema>;

export default function NgoProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ngo, isLoading } = useQuery({
    queryKey: ["/api/ngos/profile"],
  });

  const form = useForm<NgoProfileForm>({
    resolver: zodResolver(ngoProfileSchema),
    defaultValues: {
      organizationName: ngo?.organizationName || "",
      description: ngo?.description || "",
      mission: ngo?.mission || "",
      location: ngo?.location || "",
      website: ngo?.website || "",
      phone: ngo?.phone || "",
      focusAreas: ngo?.focusAreas || [],
    },
  });

  // Update form values when ngo data loads
  if (ngo && !form.formState.isDirty) {
    form.reset({
      organizationName: ngo.organizationName,
      description: ngo.description || "",
      mission: ngo.mission || "",
      location: ngo.location,
      website: ngo.website || "",
      phone: ngo.phone || "",
      focusAreas: ngo.focusAreas || [],
    });
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: NgoProfileForm) => {
      const response = await apiRequest("PATCH", `/api/ngos/${ngo.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ngos/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your organization profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NgoProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const impactStats = [
    { label: "Children Educated", value: "2,450", color: "text-primary" },
    { label: "Meals Provided", value: "45,000+", color: "text-secondary" },
    { label: "Communities Served", value: "23", color: "text-accent" },
    { label: "Volunteers Active", value: "156", color: "text-purple-600" },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No NGO profile found. Please create your profile first.</p>
            <Button className="btn-primary">Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
        <p className="text-gray-600 mt-2">Manage your public profile and organization details</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=300&fit=crop"
            alt="NGO activities with children"
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-xl" />
        </div>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {ngo.organizationName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{ngo.organizationName}</h2>
              <p className="text-gray-600 mt-1">Registered NGO • Est. 2015</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {ngo.location}
                </span>
                {ngo.verified && (
                  <span className="flex items-center text-sm text-green-600">
                    <Shield className="w-4 h-4 mr-1" />
                    Verified Organization
                  </span>
                )}
                <span className="flex items-center text-sm text-yellow-600">
                  <Star className="w-4 h-4 mr-1" />
                  {ngo.impactScore}/100 Impact Score
                </span>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "" : "btn-primary"}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        // Edit Form
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    {...form.register("organizationName")}
                    className={form.formState.errors.organizationName ? "border-red-500" : ""}
                  />
                  {form.formState.errors.organizationName && (
                    <p className="text-sm text-red-500">{form.formState.errors.organizationName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    className={form.formState.errors.location ? "border-red-500" : ""}
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...form.register("description")}
                  className={form.formState.errors.description ? "border-red-500" : ""}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  rows={4}
                  {...form.register("mission")}
                  className={form.formState.errors.mission ? "border-red-500" : ""}
                />
                {form.formState.errors.mission && (
                  <p className="text-sm text-red-500">{form.formState.errors.mission.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    className={form.formState.errors.phone ? "border-red-500" : ""}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    {...form.register("website")}
                    className={form.formState.errors.website ? "border-red-500" : ""}
                  />
                  {form.formState.errors.website && (
                    <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        // Display Mode
        <div className="space-y-8">
          {/* Mission & About */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {ngo.mission || "Mission statement not provided."}
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {ngo.focusAreas?.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  {ngo.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {ngo.phone}
                    </div>
                  )}
                  {ngo.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {ngo.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Our Work in Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`NGO work ${index + 1}`}
                    className="rounded-lg shadow-sm w-full h-48 object-cover hover:shadow-md transition-shadow cursor-pointer"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation CTA */}
          <Card className="gradient-primary text-white">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">Support Our Mission</h3>
              <p className="text-blue-100 mb-6">
                Your donations help us continue our work in providing education, nutrition, and healthcare to those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  View Donation Requests
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
