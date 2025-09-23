import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";

const leadStages = [
  { id: "new", label: "New", count: 12, color: "bg-muted" },
  { id: "contacted", label: "Contacted", count: 8, color: "bg-info" },
  { id: "qualified", label: "Qualified", count: 15, color: "bg-warning" },
  { id: "showing", label: "Showing", count: 6, color: "bg-primary" },
  { id: "offer", label: "Offer", count: 4, color: "bg-success" },
  { id: "closed", label: "Closed", count: 3, color: "bg-success" },
];

const sampleLeads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "(555) 123-4567",
    city: "Toronto",
    budget: "$450,000 - $550,000",
    stage: "qualified",
    lastContact: "2 hours ago",
    source: "Website",
    score: 85,
  },
  {
    id: 2,
    name: "Mike Davis",
    email: "mike@email.com", 
    phone: "(555) 987-6543",
    city: "Vancouver",
    budget: "$800,000 - $1,200,000",
    stage: "showing",
    lastContact: "1 day ago",
    source: "Referral",
    score: 92,
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily@email.com",
    phone: "(555) 456-7890",
    city: "Calgary",
    budget: "$350,000 - $425,000",
    stage: "contacted",
    lastContact: "3 days ago",
    source: "Facebook",
    score: 74,
  },
];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");

  const getStageColor = (stage: string) => {
    const stageConfig = leadStages.find(s => s.id === stage);
    return stageConfig?.color || "bg-muted";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage your prospects and track them through the sales pipeline.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sales Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {leadStages.map((stage) => (
              <div
                key={stage.id}
                className="text-center p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-full ${stage.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold">{stage.count}</div>
                <div className="text-sm text-muted-foreground">{stage.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {leadStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="grid gap-4">
        {sampleLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Lead Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold">{lead.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  </div>

                  {/* Location & Budget */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {lead.city}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      {lead.budget}
                    </div>
                  </div>

                  {/* Stage & Source */}
                  <div className="space-y-2">
                    <Badge variant="secondary" className="capitalize">
                      {lead.stage}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Source: {lead.source}
                    </div>
                  </div>

                  {/* Score & Last Contact */}
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                      Score: {lead.score}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last: {lead.lastContact}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}