import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Utensils, Shirt, IndianRupee } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const donationSchema = z.object({
  type: z.enum(["food", "clothes", "money"], {
    required_error: "Please select a donation type",
  }),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.string().min(1, "Quantity is required"),
  amount: z.string().optional(),
  pickupAddress: z.string().min(10, "Pickup address is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  urgency: z.enum(["low", "medium", "high", "critical"]),
});

type DonationForm = z.infer<typeof donationSchema>;

export default function AddDonation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DonationForm>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      urgency: "medium",
    },
  });

  const createDonationMutation = useMutation({
    mutationFn: async (data: DonationForm) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      toast({
        title: "Donation Created!",
        description: "Your donation request has been submitted successfully. NGOs in your area will be notified.",
      });
      setLocation("/donor/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationForm) => {
    createDonationMutation.mutate(data);
  };

  const donationTypes = [
    {
      value: "food",
      label: "Food",
      description: "Meals, groceries, or ingredients",
      icon: Utensils,
    },
    {
      value: "clothes",
      label: "Clothes",
      description: "Clothing items for all ages",
      icon: Shirt,
    },
    {
      value: "money",
      label: "Money",
      description: "Financial contributions",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Donation</h1>
        <p className="text-gray-600 mt-2">Fill out the details for your donation</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Donation Type */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as "food" | "clothes" | "money")}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {donationTypes.map((type) => (
                <div key={type.value}>
                  <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                  <Label
                    htmlFor={type.value}
                    className={`border-2 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors flex flex-col items-center text-center ${
                      form.watch("type") === type.value
                        ? "border-primary bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <type.icon className="w-8 h-8 mb-3 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500 mt-2">{form.formState.errors.type.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Donation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title for your donation"
                  {...form.register("title")}
                  className={form.formState.errors.title ? "border-red-500" : ""}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity/Amount</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 50 meals, ₹5000, 20 shirts"
                  {...form.register("quantity")}
                  className={form.formState.errors.quantity ? "border-red-500" : ""}
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                )}
              </div>
            </div>

            {form.watch("type") === "money" && (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in rupees"
                  {...form.register("amount")}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe your donation in detail..."
                {...form.register("description")}
                className={form.formState.errors.description ? "border-red-500" : ""}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Pickup */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Pickup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Textarea
                  id="pickupAddress"
                  rows={3}
                  placeholder="Full pickup address..."
                  {...form.register("pickupAddress")}
                  className={form.formState.errors.pickupAddress ? "border-red-500" : ""}
                />
                {form.formState.errors.pickupAddress && (
                  <p className="text-sm text-red-500">{form.formState.errors.pickupAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupTime">Preferred Pickup Time</Label>
                <Select
                  onValueChange={(value) => form.setValue("pickupTime", value)}
                  defaultValue={form.watch("pickupTime")}
                >
                  <SelectTrigger className={form.formState.errors.pickupTime ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.pickupTime && (
                  <p className="text-sm text-red-500">{form.formState.errors.pickupTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                onValueChange={(value) => form.setValue("urgency", value as "low" | "medium" | "high" | "critical")}
                defaultValue={form.watch("urgency")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Within a week</SelectItem>
                  <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
                  <SelectItem value="high">High - Within 24 hours</SelectItem>
                  <SelectItem value="critical">Critical - Immediate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/donor/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary"
            disabled={createDonationMutation.isPending}
          >
            {createDonationMutation.isPending ? "Submitting..." : "Submit Donation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
