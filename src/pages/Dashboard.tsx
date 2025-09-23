import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Home,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your real estate business.
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Showing
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Leads"
          value={127}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Properties Listed"
          value={43}
          change="+3 new this week"
          changeType="positive"
          icon={Home}
        />
        <StatsCard
          title="Total Commission"
          value="$48,500"
          change="+25% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Conversion Rate"
          value="24.5%"
          change="+2.1% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "New Leads", count: 45, color: "bg-muted" },
                { stage: "Contacted", count: 32, color: "bg-info" },
                { stage: "Qualified", count: 18, color: "bg-warning" },
                { stage: "Showing", count: 12, color: "bg-primary" },
                { stage: "Offer", count: 8, color: "bg-success" },
                { stage: "Closed", count: 5, color: "bg-success" },
              ].map((item) => (
                <div key={item.stage} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="flex-1">{item.stage}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                type: "call",
                icon: Phone,
                title: "Called Sarah Johnson",
                time: "2 minutes ago",
                color: "text-info",
              },
              {
                type: "email",
                icon: Mail,
                title: "Sent property list to Mike Davis",
                time: "15 minutes ago",
                color: "text-warning",
              },
              {
                type: "meeting",
                icon: Calendar,
                title: "Showing scheduled at Oak Street",
                time: "1 hour ago",
                color: "text-success",
              },
              {
                type: "listing",
                icon: Home,
                title: "New listing added - Maple Ave",
                time: "2 hours ago",
                color: "text-primary",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <activity.icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Add New Lead</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new prospect
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Home className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">List Property</h3>
                <p className="text-sm text-muted-foreground">
                  Add new listing
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Schedule Showing</h3>
                <p className="text-sm text-muted-foreground">
                  Book appointment
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <MapPin className="h-5 w-5 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Property Search</h3>
                <p className="text-sm text-muted-foreground">
                  Find properties
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}