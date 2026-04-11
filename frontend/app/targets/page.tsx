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
  MapPin,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Smartphone,
  Heart,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

const targetSegments = [
  {
    id: 1,
    name: "Urban Millennials",
    ageRange: "25-35",
    size: 2400000,
    avgIncome: 45000,
    engagementScore: 92,
    conversionPotential: 4.2,
    topInterests: ["Technology", "Travel", "Food & Dining", "Entertainment"],
    location: "Bangkok, Chiang Mai, Phuket",
    preferredChannels: ["Mobile App", "Social Media", "LINE"],
    productAffinity: ["Credit Cards", "Investments", "Travel Insurance"],
    trendAlignment: [
      { trend: "#SongkranSale", score: 95 },
      { trend: "K-Pop Comeback", score: 78 },
      { trend: "Summer Travel", score: 88 },
    ],
  },
  {
    id: 2,
    name: "Gen Z Digital Natives",
    ageRange: "18-24",
    size: 1800000,
    avgIncome: 25000,
    engagementScore: 88,
    conversionPotential: 3.5,
    topInterests: ["Gaming", "Music", "Fashion", "Social Media"],
    location: "Bangkok, University Towns",
    preferredChannels: ["TikTok", "Instagram", "Mobile App"],
    productAffinity: ["Savings Accounts", "Debit Cards", "E-Wallet"],
    trendAlignment: [
      { trend: "K-Pop Comeback", score: 98 },
      { trend: "#SongkranSale", score: 72 },
      { trend: "AI Investment", score: 45 },
    ],
  },
  {
    id: 3,
    name: "Tech-Savvy Professionals",
    ageRange: "30-45",
    size: 1500000,
    avgIncome: 85000,
    engagementScore: 78,
    conversionPotential: 5.8,
    topInterests: ["Technology", "Investments", "Career Growth", "Gadgets"],
    location: "Bangkok, Tech Hubs",
    preferredChannels: ["Email", "LinkedIn", "Mobile App"],
    productAffinity: ["Wealth Management", "Credit Cards", "Insurance"],
    trendAlignment: [
      { trend: "AI Investment", score: 96 },
      { trend: "EV Subsidies", score: 82 },
      { trend: "Summer Travel", score: 68 },
    ],
  },
  {
    id: 4,
    name: "Young Families",
    ageRange: "28-40",
    size: 1200000,
    avgIncome: 65000,
    engagementScore: 72,
    conversionPotential: 4.5,
    topInterests: ["Family Activities", "Education", "Home & Living", "Health"],
    location: "Suburban Bangkok, Regional Cities",
    preferredChannels: ["Facebook", "LINE", "Email"],
    productAffinity: ["Home Loans", "Education Savings", "Family Insurance"],
    trendAlignment: [
      { trend: "Summer Travel", score: 92 },
      { trend: "#SongkranSale", score: 85 },
      { trend: "EV Subsidies", score: 78 },
    ],
  },
  {
    id: 5,
    name: "Active Investors",
    ageRange: "35-55",
    size: 890000,
    avgIncome: 120000,
    engagementScore: 65,
    conversionPotential: 6.2,
    topInterests: ["Stock Market", "Real Estate", "Crypto", "Business"],
    location: "Bangkok CBD, Financial Districts",
    preferredChannels: ["Email", "Mobile App", "Direct Call"],
    productAffinity: ["Wealth Management", "Investment Funds", "Premium Cards"],
    trendAlignment: [
      { trend: "AI Investment", score: 98 },
      { trend: "EV Subsidies", score: 75 },
      { trend: "Crypto Regulation", score: 88 },
    ],
  },
]

const demographicData = [
  { age: "18-24", male: 320, female: 380 },
  { age: "25-34", male: 480, female: 520 },
  { age: "35-44", male: 350, female: 380 },
  { age: "45-54", male: 280, female: 310 },
  { age: "55+", male: 180, female: 220 },
]

const incomeDistribution = [
  { name: "< 25K", value: 18, color: "hsl(var(--chart-5))" },
  { name: "25K-50K", value: 32, color: "hsl(var(--chart-4))" },
  { name: "50K-85K", value: 28, color: "hsl(var(--chart-3))" },
  { name: "85K-120K", value: 15, color: "hsl(var(--chart-2))" },
  { name: "> 120K", value: 7, color: "hsl(var(--chart-1))" },
]

const segmentScatter = targetSegments.map((seg) => ({
  name: seg.name,
  engagement: seg.engagementScore,
  conversion: seg.conversionPotential,
  size: seg.size / 100000,
}))

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
                      <p className="text-sm text-muted-foreground">
                        Age: {segment.ageRange}
                      </p>
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
                    {(selectedSegment.size / 1000000).toFixed(2)}M customers | Age: {selectedSegment.ageRange}
                  </p>
                </div>
                <Link href="/recommendations">
                  <Button size="sm">
                    View AI Recommendations <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-chart-4" />
                    Primary Locations
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedSegment.location}
                  </p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-medium text-foreground">
                    <Smartphone className="h-4 w-4 text-chart-2" />
                    Preferred Channels
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSegment.preferredChannels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="bg-chart-2/10 text-chart-2">
                        {channel}
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

        {/* Analytics Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Demographics Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Age & Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="age" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={50} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="male" fill="hsl(var(--chart-1))" name="Male" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="female" fill="hsl(var(--chart-4))" name="Female" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-1" />
                  <span className="text-sm text-muted-foreground">Male</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-4" />
                  <span className="text-sm text-muted-foreground">Female</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Income Distribution (Monthly THB)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {incomeDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Segment Scatter Plot */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Segment Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      dataKey="engagement"
                      name="Engagement"
                      unit="%"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Engagement Score (%)", position: "bottom", offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="conversion"
                      name="Conversion"
                      unit="%"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Conversion Potential (%)", angle: -90, position: "insideLeft" }}
                    />
                    <ZAxis type="number" dataKey="size" range={[100, 1000]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "size") return [`${(value * 100000).toLocaleString()}`, "Size"]
                        return [value, name]
                      }}
                    />
                    <Scatter
                      name="Segments"
                      data={segmentScatter}
                      fill="hsl(var(--primary))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Bubble size represents segment population. Top-right quadrant indicates high-value segments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
