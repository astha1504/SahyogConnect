import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Layout from "@/components/layout/layout";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import DonorDashboard from "@/pages/donor/dashboard";
import AddDonation from "@/pages/donor/add-donation";
import TrackDonations from "@/pages/donor/track-donations";
import NgoDashboard from "@/pages/ngo/dashboard";
import NgoProfile from "@/pages/ngo/profile";
import AdminDashboard from "@/pages/admin/dashboard";
import Chat from "@/pages/chat";
import ImpactVisualizer from "@/pages/impact-visualizer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/donor/dashboard" component={DonorDashboard} />
      <Route path="/donor/add-donation" component={AddDonation} />
      <Route path="/donor/track-donations" component={TrackDonations} />
      <Route path="/ngo/dashboard" component={NgoDashboard} />
      <Route path="/ngo/profile" component={NgoProfile} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/chat" component={Chat} />
      <Route path="/impact" component={ImpactVisualizer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
