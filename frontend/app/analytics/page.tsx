"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  DollarSign,
  Users,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
} from "recharts"

const monthlyPerformance = [
  { month: "Jan", campaigns: 12, conversions: 4500, revenue: 2800000, roi: 2.8 },
  { month: "Feb", campaigns: 15, conversions: 5200, revenue: 3200000, roi: 3.1 },
  { month: "Mar", campaigns: 18, conversions: 6800, revenue: 4100000, roi: 3.4 },
  { month: "Apr", campaigns: 22, conversions: 8900, revenue: 5500000, roi: 3.8 },
  { month: "May", campaigns: 25, conversions: 11200, revenue: 7200000, roi: 4.2 },
  { month: "Jun", campaigns: 28, conversions: 14500, revenue: 9100000, roi: 4.5 },
]

const conversionByChannel = [
  { channel: "Mobile App", conversion: 5.2, volume: 45000 },
  { channel: "Social Media", conversion: 3.8, volume: 38000 },
  { channel: "LINE", conversion: 4.1, volume: 32000 },
  { channel: "Email", conversion: 2.9, volume: 28000 },
  { channel: "In-Branch", conversion: 6.8, volume: 15000 },
  { channel: "Website", conversion: 3.2, volume: 25000 },
]

const trendPredictions = [
  {
    trend: "#SongkranSale",
    currentVolume: 125000,
    predictedPeak: 285000,
    peakDate: "Apr 13",
    confidence: 94,
    recommendation: "Launch within 48 hours",
  },
  {
    trend: "K-Pop Comeback",
    currentVolume: 98000,
    predictedPeak: 420000,
    peakDate: "Apr 18",
    confidence: 87,
    recommendation: "Prepare campaign materials",
  },
  {
    trend: "Summer Travel",
    currentVolume: 76000,
    predictedPeak: 180000,
    peakDate: "May 5",
    confidence: 82,
    recommendation: "Early bird promotions",
  },
  {
    trend: "AI Investment",
    currentVolume: 87000,
    predictedPeak: 156000,
    peakDate: "Apr 25",
    confidence: 78,
    recommendation: "Target tech segment",
  },
]

const campaignROI = [
  { name: "Festival Promo", spent: 500000, revenue: 2100000, roi: 4.2 },
  { name: "K-Pop Card", spent: 350000, revenue: 1400000, roi: 4.0 },
  { name: "Travel Insurance", spent: 280000, revenue: 980000, roi: 3.5 },
  { name: "Investment Bonus", spent: 420000, revenue: 1680000, roi: 4.0 },
  { name: "Family Package", spent: 320000, revenue: 1120000, roi: 3.5 },
]

const segmentPerformance = [
  { name: "Urban Millennials", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Gen Z", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Professionals", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Families", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Investors", value: 8, color: "hsl(var(--chart-5))" },
]

const historicalTrends = [
  { date: "Week 1", actual: 3.2, predicted: 3.0 },
  { date: "Week 2", actual: 3.5, predicted: 3.4 },
  { date: "Week 3", actual: 3.8, predicted: 3.9 },
  { date: "Week 4", actual: 4.1, predicted: 4.0 },
  { date: "Week 5", actual: 4.3, predicted: 4.5 },
  { date: "Week 6", actual: null, predicted: 4.8 },
  { date: "Week 7", actual: null, predicted: 5.1 },
  { date: "Week 8", actual: null, predicted: 5.3 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics & Predictions"
      subtitle="Performance metrics and AI-powered forecasting"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Conversions"
            value="52,100"
            change="+28.5%"
            trend="up"
            icon={Target}
            subtitle="vs. last month"
          />
          <MetricCard
            title="Campaign Revenue"
            value="31.9M THB"
            change="+35.2%"
            trend="up"
            icon={DollarSign}
            subtitle="vs. last month"
            highlight
          />
          <MetricCard
            title="Avg. ROI"
            value="3.8x"
            change="+0.6x"
            trend="up"
            icon={TrendingUp}
            subtitle="return on investment"
          />
          <MetricCard
            title="Prediction Accuracy"
            value="91.2%"
            change="+2.4%"
            trend="up"
            icon={Activity}
            subtitle="AI model performance"
          />
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="comparison">Historical</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6 space-y-6">
            {/* Revenue & Conversions */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="conversions" fill="hsl(var(--primary))" name="Conversions" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="roi" stroke="hsl(var(--success))" strokeWidth={2} name="ROI (x)" dot={{ fill: "hsl(var(--success))" }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Conversion by Channel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={conversionByChannel} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="channel" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="conversion" fill="hsl(var(--chart-2))" name="Conversion %" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign ROI Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Campaign ROI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Campaign</th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Spent</th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Revenue</th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">ROI</th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignROI.map((campaign) => (
                        <tr key={campaign.name} className="border-b border-border/50">
                          <td className="py-4 font-medium text-foreground">{campaign.name}</td>
                          <td className="py-4 text-right text-muted-foreground">
                            {(campaign.spent / 1000).toFixed(0)}K THB
                          </td>
                          <td className="py-4 text-right text-foreground">
                            {(campaign.revenue / 1000000).toFixed(1)}M THB
                          </td>
                          <td className="py-4 text-right font-semibold text-success">
                            {campaign.roi}x
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-2 w-24 rounded-full bg-secondary">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${(campaign.roi / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Segment Distribution */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Revenue by Segment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={segmentPerformance}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {segmentPerformance.map((entry, index) => (
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
                    {segmentPerformance.map((item) => (
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Top Performing Segments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Urban Millennials", revenue: "11.2M", growth: "+32%", conversion: "4.8%" },
                    { name: "Gen Z Digital", revenue: "7.9M", growth: "+45%", conversion: "3.9%" },
                    { name: "Tech Professionals", revenue: "6.4M", growth: "+28%", conversion: "5.2%" },
                    { name: "Young Families", revenue: "3.8M", growth: "+18%", conversion: "4.1%" },
                  ].map((segment, index) => (
                    <div
                      key={segment.name}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{segment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Conv. rate: {segment.conversion}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{segment.revenue}</p>
                        <p className="text-sm text-success">{segment.growth}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="mt-6 space-y-6">
            {/* Trend Predictions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">
                    AI Trend Predictions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {trendPredictions.map((prediction) => (
                    <div
                      key={prediction.trend}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {prediction.trend}
                          </Badge>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Current</p>
                              <p className="font-semibold text-foreground">
                                {(prediction.currentVolume / 1000).toFixed(0)}K
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Predicted Peak</p>
                              <p className="font-semibold text-success">
                                {(prediction.predictedPeak / 1000).toFixed(0)}K
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                              {prediction.confidence}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">confidence</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Peak: {prediction.peakDate}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {prediction.recommendation}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prediction vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Prediction Accuracy Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[2, 6]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-2))" }}
                        name="Actual"
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "hsl(var(--primary))" }}
                        name="Predicted"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                  <p className="text-sm text-foreground">
                    <strong>AI Forecast:</strong> Based on current trends and historical data, we predict a 
                    <span className="font-semibold text-success"> 5.3% conversion rate </span>
                    by Week 8. Confidence interval: 4.9% - 5.7%.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6 space-y-6">
            {/* Historical Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Year-over-Year Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", thisYear: 4500, lastYear: 3200 },
                        { month: "Feb", thisYear: 5200, lastYear: 3800 },
                        { month: "Mar", thisYear: 6800, lastYear: 4500 },
                        { month: "Apr", thisYear: 8900, lastYear: 5200 },
                        { month: "May", thisYear: 11200, lastYear: 6800 },
                        { month: "Jun", thisYear: 14500, lastYear: 8200 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="thisYearGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="lastYearGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="lastYear"
                        stroke="hsl(var(--muted))"
                        strokeWidth={2}
                        fill="url(#lastYearGradient)"
                        name="2025"
                      />
                      <Area
                        type="monotone"
                        dataKey="thisYear"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#thisYearGradient)"
                        name="2026"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Conversions</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">52.1K</p>
                      <div className="mt-2 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">+76.8% vs 2025</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-success/10 p-3">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Campaign ROI</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">3.8x</p>
                      <div className="mt-2 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">+1.2x vs 2025</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Reach</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">4.2M</p>
                      <div className="mt-2 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">+45.2% vs 2025</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-chart-2/10 p-3">
                      <Users className="h-6 w-6 text-chart-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  subtitle: string
  highlight?: boolean
}

function MetricCard({ title, value, change, trend, icon: Icon, subtitle, highlight }: MetricCardProps) {
  return (
    <Card className={highlight ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
            <div className="mt-1 flex items-center gap-1">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={trend === "up" ? "text-sm text-success" : "text-sm text-destructive"}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={`rounded-lg p-3 ${highlight ? "bg-primary/20" : "bg-secondary"}`}>
            <Icon className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
