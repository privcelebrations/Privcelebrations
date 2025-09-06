import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>PriV - Coolest way to celebrate! Exclusive Private Theatre Experience | Gaming</title>
          <meta name="description" content="PriV - Transform your special occasions into unforgettable cinematic memories with our luxury private theatre rooms. Book exclusive experiences for parties, events, and celebrations at PrivCelebrations.com" />
          <meta property="og:title" content="PriV - Exclusive Private Theatre Experience" />
          <meta property="og:description" content="Premium private theatre booking platform with luxury amenities, WhatsApp support, and personalized service for unforgettable celebrations." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://privcelebrations.com" />
          <meta property="og:site_name" content="Privcelebrations.com" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </Helmet>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
