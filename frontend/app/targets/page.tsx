"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Heart,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react"
import Link from "next/link"


const targetSegments = [
  {
    id: 1,
    name: "Private",
    size: 85000,
    avgIncome: 500000,
    engagementScore: 72,
    conversionPotential: 8.5,
    topInterests: ["Wealth Management", "Real Estate", "Luxury Travel", "Golf"],
    location: "Bangkok CBD, Sathorn, Sukhumvit",
    preferredChannels: ["Relationship Manager", "Private App", "Email"],
    productAffinity: ["Private Banking", "Family Office", "Exclusive Investments"],
    trendAlignment: [
      { trend: "AI Investment", score: 92 },
      { trend: "Luxury Travel", score: 88 },
      { trend: "Real Estate", score: 95 },
    ],
  },
  {
    id: 2,
    name: "First",
    size: 320000,
    avgIncome: 250000,
    engagementScore: 78,
    conversionPotential: 7.2,
    topInterests: ["Investments", "Travel", "Fine Dining", "Business"],
    location: "Bangkok, Major Cities",
    preferredChannels: ["Priority Banking", "Mobile App", "Email"],
    productAffinity: ["Priority Wealth", "Premium Cards", "Investment Funds"],
    trendAlignment: [
      { trend: "AI Investment", score: 94 },
      { trend: "Summer Travel", score: 82 },
      { trend: "EV Subsidies", score: 76 },
    ],
  },
  {
    id: 3,
    name: "Prime",
    size: 890000,
    avgIncome: 120000,
    engagementScore: 82,
    conversionPotential: 6.1,
    topInterests: ["Technology", "Investments", "Travel", "Lifestyle"],
    location: "Bangkok, Regional Capitals",
    preferredChannels: ["Mobile App", "Email", "LINE"],
    productAffinity: ["Wealth Management", "Credit Cards", "Insurance"],
    trendAlignment: [
      { trend: "AI Investment", score: 88 },
      { trend: "#SongkranSale", score: 85 },
      { trend: "Summer Travel", score: 80 },
    ],
  },
  {
    id: 4,
    name: "Wealth Potential",
    size: 1500000,
    avgIncome: 75000,
    engagementScore: 88,
    conversionPotential: 5.4,
    topInterests: ["Career Growth", "Technology", "Travel", "Investments"],
    location: "Bangkok, Tech Hubs, Business Districts",
    preferredChannels: ["Mobile App", "Social Media", "LINE"],
    productAffinity: ["Investment Funds", "Credit Cards", "Savings"],
    trendAlignment: [
      { trend: "#SongkranSale", score: 92 },
      { trend: "K-Pop Comeback", score: 75 },
      { trend: "AI Investment", score: 84 },
    ],
  },
  {
    id: 5,
    name: "Upper Mass",
    size: 2400000,
    avgIncome: 45000,
    engagementScore: 85,
    conversionPotential: 4.2,
    topInterests: ["Shopping", "Entertainment", "Food & Dining", "Travel"],
    location: "Bangkok, Major Cities",
    preferredChannels: ["Mobile App", "Social Media", "LINE", "TikTok"],
    productAffinity: ["Credit Cards", "Personal Loans", "Savings Accounts"],
    trendAlignment: [
      { trend: "#SongkranSale", score: 95 },
      { trend: "K-Pop Comeback", score: 88 },
      { trend: "Summer Travel", score: 78 },
    ],
  },
  {
    id: 6,
    name: "Mass",
    size: 3800000,
    avgIncome: 28000,
    engagementScore: 78,
    conversionPotential: 3.2,
    topInterests: ["Shopping", "Entertainment", "Daily Deals", "Social Media"],
    location: "Nationwide",
    preferredChannels: ["Mobile App", "LINE", "SMS"],
    productAffinity: ["Savings Accounts", "Debit Cards", "Personal Loans"],
    trendAlignment: [
      { trend: "#SongkranSale", score: 98 },
      { trend: "K-Pop Comeback", score: 82 },
      { trend: "Daily Deals", score: 90 },
    ],
  },
  {
    id: 7,
    name: "Lower Mass",
    size: 2100000,
    avgIncome: 18000,
    engagementScore: 65,
    conversionPotential: 2.4,
    topInterests: ["Savings", "Daily Deals", "Basic Banking", "Mobile Top-up"],
    location: "Regional Areas, Rural",
    preferredChannels: ["SMS", "LINE", "Branch"],
    productAffinity: ["Savings Accounts", "Basic Insurance", "Micro Loans"],
    trendAlignment: [
      { trend: "#SongkranSale", score: 85 },
      { trend: "Daily Deals", score: 92 },
      { trend: "Government Subsidies", score: 88 },
    ],
  },
  {
    id: 8,
    name: "Retiree",
    size: 1200000,
    avgIncome: 35000,
    engagementScore: 58,
    conversionPotential: 3.8,
    topInterests: ["Health", "Travel", "Family", "Savings"],
    location: "Bangkok, Provincial Cities",
    preferredChannels: ["Branch", "Call Center", "LINE"],
    productAffinity: ["Fixed Deposits", "Health Insurance", "Estate Planning"],
    trendAlignment: [
      { trend: "Health & Wellness", score: 95 },
      { trend: "Summer Travel", score: 72 },
      { trend: "Government Benefits", score: 88 },
    ],
  },
]



export default function TargetsPage() {
  const [selectedSegment, setSelectedSegment] = useState(targetSegments[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSegments = targetSegments.filter((seg) =>
    seg.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout
      title="Target Groups"
      subtitle="Analyze and segment customer demographics"
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">7.79M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                  <p className="text-2xl font-bold text-foreground">79%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-3/10 p-2">
                  <CreditCard className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Conversion</p>
                  <p className="text-2xl font-bold text-foreground">4.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2">
                  <Star className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Segments</p>
                  <p className="text-2xl font-bold text-foreground">32</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="high">High Potential</SelectItem>
              <SelectItem value="engaged">Most Engaged</SelectItem>
              <SelectItem value="growing">Fast Growing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Segment List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Customer Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredSegments.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    selectedSegment.id === segment.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{segment.name}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {(segment.size / 1000000).toFixed(1)}M customers
                    </span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {segment.conversionPotential}% conv.
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="text-foreground">{segment.engagementScore}%</span>
                    </div>
                    <Progress value={segment.engagementScore} className="mt-1 h-1.5" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Segment Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedSegment.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {(selectedSegment.size / 1000000).toFixed(2)}M customers
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm">Avg. Income</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {selectedSegment.avgIncome.toLocaleString()} THB
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Engagement Score</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {selectedSegment.engagementScore}%
                  </p>
                </div>
                <div className="rounded-lg bg-success/5 border border-success/20 p-4">
                  <div className="flex items-center gap-2 text-success">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Conversion Potential</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {selectedSegment.conversionPotential}%
                  </p>
                </div>
              </div>

              {/* Attributes */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-foreground">
                    <Heart className="h-4 w-4 text-primary" />
                    Top Interests
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSegment.topInterests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-foreground">
                    <ShoppingBag className="h-4 w-4 text-chart-3" />
                    Product Affinity
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSegment.productAffinity.map((product) => (
                      <Badge key={product} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                
              </div>

              {/* Trend Alignment */}
              <div>
                <h4 className="mb-3 font-medium text-foreground">Trend Alignment</h4>
                <div className="space-y-3">
                  {selectedSegment.trendAlignment.map((trend) => (
                    <div key={trend.trend}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{trend.trend}</span>
                        <span className={`font-medium ${trend.score >= 80 ? "text-success" : trend.score >= 60 ? "text-warning" : "text-muted-foreground"}`}>
                          {trend.score}%
                        </span>
                      </div>
                      <Progress
                        value={trend.score}
                        className="mt-1 h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </DashboardLayout>
  )
}
