"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertTriangle,
  Send,
  MousePointer,
  DollarSign,
  FileText,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Seeded random for deterministic values (avoids hydration mismatch)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Static campaign data to avoid hydration issues
const campaigns = [
  { id: 1, name: "Interest Rate Cut - Fixed Deposit", sent: 485000, clicked: 12850, ctr: 2.65, ctrTarget: 2.4, transAll: 1028, transModeled: 654, cvsAll: "1.85", cvsModeled: 1.35, cvsTarget: 1.2, allotment: 15000000, fee: 425000, performance: "above", segment: "Prime" },
  { id: 2, name: "AI Tech Fund Launch", sent: 320000, clicked: 7680, ctr: 2.4, ctrTarget: 2.5, transAll: 614, transModeled: 312, cvsAll: "1.42", cvsModeled: 0.98, cvsTarget: 1.1, allotment: 8500000, fee: 198000, performance: "on-track", segment: "Wealth Potential" },
  { id: 3, name: "Home Loan Refinance Q2", sent: 180000, clicked: 2520, ctr: 1.4, ctrTarget: 2.2, transAll: 202, transModeled: 52, cvsAll: "0.45", cvsModeled: 0.29, cvsTarget: 0.8, allotment: 25000000, fee: 65000, performance: "below", segment: "First" },
  { id: 4, name: "Credit Card Cashback Promo", sent: 520000, clicked: 14560, ctr: 2.8, ctrTarget: 2.3, transAll: 1165, transModeled: 728, cvsAll: "1.95", cvsModeled: 1.4, cvsTarget: 1.0, allotment: 12000000, fee: 380000, performance: "above", segment: "Mass" },
  { id: 5, name: "Savings Account Welcome", sent: 280000, clicked: 5320, ctr: 1.9, ctrTarget: 2.0, transAll: 426, transModeled: 266, cvsAll: "1.15", cvsModeled: 0.95, cvsTarget: 0.9, allotment: 6500000, fee: 142000, performance: "on-track", segment: "Mass" },
  { id: 6, name: "Auto Loan Spring Sale", sent: 145000, clicked: 2175, ctr: 1.5, ctrTarget: 2.1, transAll: 174, transModeled: 87, cvsAll: "0.72", cvsModeled: 0.6, cvsTarget: 0.85, allotment: 18000000, fee: 58000, performance: "below", segment: "Upper Mass" },
  { id: 7, name: "Travel Insurance Bundle", sent: 195000, clicked: 4095, ctr: 2.1, ctrTarget: 1.8, transAll: 328, transModeled: 205, cvsAll: "1.28", cvsModeled: 1.05, cvsTarget: 0.75, allotment: 4200000, fee: 95000, performance: "above", segment: "First" },
  { id: 8, name: "Investment Fund Q2", sent: 380000, clicked: 9880, ctr: 2.6, ctrTarget: 2.2, transAll: 790, transModeled: 494, cvsAll: "1.62", cvsModeled: 1.3, cvsTarget: 1.0, allotment: 22000000, fee: 285000, performance: "above", segment: "Wealth Potential" },
  { id: 9, name: "Personal Loan Flash", sent: 420000, clicked: 7140, ctr: 1.7, ctrTarget: 2.4, transAll: 571, transModeled: 286, cvsAll: "0.85", cvsModeled: 0.68, cvsTarget: 1.1, allotment: 28000000, fee: 195000, performance: "below", segment: "Mass" },
  { id: 10, name: "Premium Card Upgrade", sent: 85000, clicked: 2380, ctr: 2.8, ctrTarget: 2.5, transAll: 190, transModeled: 119, cvsAll: "1.75", cvsModeled: 1.4, cvsTarget: 1.2, allotment: 5500000, fee: 68000, performance: "above", segment: "Private" },
  { id: 11, name: "Fixed Deposit 12M Special", sent: 290000, clicked: 7540, ctr: 2.6, ctrTarget: 2.3, transAll: 603, transModeled: 377, cvsAll: "1.58", cvsModeled: 1.3, cvsTarget: 1.05, allotment: 35000000, fee: 198000, performance: "above", segment: "Retiree" },
  { id: 12, name: "Mutual Fund Promotion", sent: 345000, clicked: 7590, ctr: 2.2, ctrTarget: 2.1, transAll: 607, transModeled: 380, cvsAll: "1.35", cvsModeled: 1.1, cvsTarget: 0.95, allotment: 18500000, fee: 215000, performance: "on-track", segment: "First" },
  { id: 13, name: "SME Business Loan", sent: 125000, clicked: 2000, ctr: 1.6, ctrTarget: 2.0, transAll: 160, transModeled: 80, cvsAll: "0.78", cvsModeled: 0.64, cvsTarget: 0.9, allotment: 45000000, fee: 52000, performance: "below", segment: "Upper Mass" },
  { id: 14, name: "Mortgage Rate Lock", sent: 165000, clicked: 3630, ctr: 2.2, ctrTarget: 2.0, transAll: 290, transModeled: 182, cvsAll: "1.32", cvsModeled: 1.1, cvsTarget: 0.85, allotment: 32000000, fee: 98000, performance: "above", segment: "First" },
  { id: 15, name: "Student Savings Account", sent: 180000, clicked: 3420, ctr: 1.9, ctrTarget: 1.8, transAll: 274, transModeled: 171, cvsAll: "1.12", cvsModeled: 0.95, cvsTarget: 0.8, allotment: 2800000, fee: 78000, performance: "on-track", segment: "Mass" },
  { id: 16, name: "Retirement Planning", sent: 95000, clicked: 2375, ctr: 2.5, ctrTarget: 2.2, transAll: 190, transModeled: 119, cvsAll: "1.52", cvsModeled: 1.25, cvsTarget: 1.0, allotment: 15000000, fee: 62000, performance: "above", segment: "Retiree" },
  { id: 17, name: "Gold Investment Fund", sent: 210000, clicked: 5040, ctr: 2.4, ctrTarget: 2.1, transAll: 403, transModeled: 252, cvsAll: "1.45", cvsModeled: 1.2, cvsTarget: 0.95, allotment: 12000000, fee: 138000, performance: "above", segment: "Wealth Potential" },
  { id: 18, name: "Foreign Currency Promo", sent: 155000, clicked: 2945, ctr: 1.9, ctrTarget: 2.0, transAll: 236, transModeled: 147, cvsAll: "1.15", cvsModeled: 0.95, cvsTarget: 0.9, allotment: 8500000, fee: 82000, performance: "on-track", segment: "Prime" },
  { id: 19, name: "Digital Banking Launch", sent: 450000, clicked: 11250, ctr: 2.5, ctrTarget: 2.3, transAll: 900, transModeled: 563, cvsAll: "1.55", cvsModeled: 1.25, cvsTarget: 1.05, allotment: 9800000, fee: 295000, performance: "on-track", segment: "Mass" },
  { id: 20, name: "Mobile Pay Cashback", sent: 580000, clicked: 14500, ctr: 2.5, ctrTarget: 2.2, transAll: 1160, transModeled: 725, cvsAll: "1.58", cvsModeled: 1.25, cvsTarget: 1.0, allotment: 7200000, fee: 385000, performance: "above", segment: "Mass" },
  ...Array.from({ length: 30 }, (_, i) => {
    const idx = i + 21
    const seed = idx * 1234
    const ctrTarget = Number((seededRandom(seed) * 1.5 + 1.5).toFixed(2))
    const ctr = Number((seededRandom(seed + 1) * 2 + 0.8).toFixed(2))
    const cvsTarget = Number((seededRandom(seed + 2) * 0.8 + 0.4).toFixed(2))
    const cvsModeled = Number((seededRandom(seed + 3) * 1.2 + 0.2).toFixed(2))
    const sent = Math.floor(seededRandom(seed + 4) * 400000 + 100000)
    const clicked = Math.floor(sent * ctr / 100)
    let performance = "on-track"
    if (ctr >= ctrTarget * 1.1) performance = "above"
    if (ctr < ctrTarget * 0.8) performance = "below"
    const names = [
      "Insurance Bundling", "Wealth Management Intro", "Emergency Fund Campaign", "Tax Saving Investment",
      "Education Loan Drive", "Senior Citizen FD", "NRI Account Opening", "Corporate Card Launch",
      "Trade Finance Promo", "Green Bond Investment", "EV Loan Subsidy", "Healthcare Finance",
      "Women Savings Plus", "First Home Buyer", "Agri Loan Season", "Festive Personal Loan",
      "Balance Transfer Offer", "Stock Trading Promo", "Crypto Investment Info", "Real Estate Fund",
      "Pension Plan Launch", "Child Education Plan", "Marriage Savings", "Vacation Loan",
      "Home Improvement Loan", "Debt Consolidation", "Business Expansion", "Startup Funding Info",
      "Export Finance", "Import Finance"
    ]
    const segments = ["Prime", "First", "Mass", "Upper Mass", "Wealth Potential", "Private", "Retiree"]
    return {
      id: idx,
      name: names[i],
      sent,
      clicked,
      ctr,
      ctrTarget,
      transAll: Math.floor(clicked * 0.08),
      transModeled: Math.floor(clicked * 0.05),
      cvsAll: (seededRandom(seed + 5) * 1.5 + 0.3).toFixed(2),
      cvsModeled,
      cvsTarget,
      allotment: Math.floor(seededRandom(seed + 6) * 20000000 + 5000000),
      fee: Math.floor(seededRandom(seed + 7) * 400000 + 50000),
      performance,
      segment: segments[Math.floor(seededRandom(seed + 8) * 7)],
    }
  })
]

// Click timeline data
const clickTimeline = [
  { time: "0h", actual: 2450, expected: 2200 },
  { time: "1h", actual: 5890, expected: 5500 },
  { time: "2h", actual: 8420, expected: 8200 },
  { time: "3h", actual: 10250, expected: 10500 },
  { time: "4h", actual: 11580, expected: 12200 },
  { time: "5h", actual: 12320, expected: 13500 },
  { time: "6h", actual: 12850, expected: 14200 },
]

// Performance alerts
const alerts = campaigns.filter(c => c.performance === "below").slice(0, 3).map(c => ({
  id: c.id,
  campaign: c.name,
  issue: `CTR ${Math.round((1 - c.ctr / c.ctrTarget) * 100)}% below target`,
  detail: `${c.ctr}% actual vs ${c.ctrTarget}% expected`,
  action: "Consider resending to different segment or adjusting message",
}))

const ITEMS_PER_PAGE = 10

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0])

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns]
    
    // Search filter
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(c => c.performance === statusFilter)
    }
    
    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField as keyof typeof a]
      let bVal: any = b[sortField as keyof typeof b]
      if (typeof aVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal
    })
    
    return result
  }, [searchQuery, statusFilter, sortField, sortDir])

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Summary stats
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicked, 0)
  const avgCTR = (totalClicks / totalSent * 100).toFixed(2)
  const totalTrans = campaigns.reduce((sum, c) => sum + c.transModeled, 0)

  // Status counts
  const aboveCount = campaigns.filter(c => c.performance === "above").length
  const onTrackCount = campaigns.filter(c => c.performance === "on-track").length
  const belowCount = campaigns.filter(c => c.performance === "below").length

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Real-time performance monitoring"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>
            <span className="text-sm text-muted-foreground">{campaigns.length} campaigns active</span>
          </div>
        </div>

        {/* Alert Banner */}
        {alerts.length > 0 && (
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-orange-800">
                    {alerts.length} campaign{alerts.length > 1 ? "s" : ""} performing below target
                  </p>
                  <p className="mt-1 text-sm text-orange-700">
                    {alerts[0].campaign}: {alerts[0].issue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benchmark Reference */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Performance Benchmarks</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0.3%</p>
                  <p className="text-xs text-muted-foreground">CTR Target</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0.6%</p>
                  <p className="text-xs text-muted-foreground">CVS Target</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">80%</p>
                  <p className="text-xs text-muted-foreground">6h Click Threshold</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {(totalSent / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {(totalClicks / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <MousePointer className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg CTR</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{avgCTR}%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{totalTrans.toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Click Timeline</TabsTrigger>
            <TabsTrigger value="report">AI Report</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Search */}
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Status Filters */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setStatusFilter("all"); setCurrentPage(1) }}
                    >
                      All ({campaigns.length})
                    </Button>
                    <Button
                      variant={statusFilter === "above" ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setStatusFilter("above"); setCurrentPage(1) }}
                      className={statusFilter !== "above" ? "border-green-300 text-green-700 hover:bg-green-50" : "bg-green-600"}
                    >
                      Above ({aboveCount})
                    </Button>
                    <Button
                      variant={statusFilter === "on-track" ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setStatusFilter("on-track"); setCurrentPage(1) }}
                      className={statusFilter !== "on-track" ? "border-blue-300 text-blue-700 hover:bg-blue-50" : "bg-blue-600"}
                    >
                      On Track ({onTrackCount})
                    </Button>
                    <Button
                      variant={statusFilter === "below" ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setStatusFilter("below"); setCurrentPage(1) }}
                      className={statusFilter !== "below" ? "border-orange-300 text-orange-700 hover:bg-orange-50" : "bg-orange-600"}
                    >
                      Below ({belowCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="pb-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-1">
                            Campaign
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 text-left font-medium text-muted-foreground">Segment</th>
                        <th 
                          className="pb-3 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("sent")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Sent
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th 
                          className="pb-3 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("ctr")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            CTR
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th 
                          className="pb-3 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                          onClick={() => handleSort("cvsModeled")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            CVS
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Trans</th>
                        <th className="pb-3 text-right font-medium text-muted-foreground">Allotment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCampaigns.map((c) => (
                        <tr 
                          key={c.id} 
                          className="border-b border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
                          onClick={() => setSelectedCampaign(c)}
                        >
                          <td className="py-3 font-medium text-foreground max-w-[200px] truncate">
                            {c.name}
                          </td>
                          <td className="py-3">
                            <Badge 
                              variant="secondary"
                              className={
                                c.performance === "above" 
                                  ? "bg-green-100 text-green-700" 
                                  : c.performance === "on-track"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                              }
                            >
                              {c.performance === "above" ? "Above" : c.performance === "on-track" ? "On Track" : "Below"}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">{c.segment}</td>
                          <td className="py-3 text-right text-foreground">{(c.sent / 1000).toFixed(0)}K</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className={c.ctr >= c.ctrTarget ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                                {c.ctr}%
                              </span>
                              {c.ctr >= c.ctrTarget ? (
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-orange-500" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className={c.cvsModeled >= c.cvsTarget ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                              {c.cvsModeled}%
                            </span>
                          </td>
                          <td className="py-3 text-right text-foreground">{c.transModeled}</td>
                          <td className="py-3 text-right text-foreground">{(c.allotment / 1000000).toFixed(1)}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-4">
              {/* Chart */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Click Accumulation (6-Hour Window)</CardTitle>
                    <Badge variant="outline">80.69% threshold at 6h</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={clickTimeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(v) => `${(v/1000).toFixed(0)}K`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} clicks`, ""]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="expected" 
                          stroke="#94a3b8" 
                          fill="#94a3b8"
                          fillOpacity={0.15}
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          name="Expected"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#7c3aed" 
                          fill="#7c3aed"
                          fillOpacity={0.3}
                          strokeWidth={2}
                          name="Actual"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#7c3aed" }} />
                      <span className="text-sm text-muted-foreground">Actual Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#94a3b8" }} />
                      <span className="text-sm text-muted-foreground">Expected Clicks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">6h Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="text-xl font-bold text-foreground">14,200</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="text-xl font-bold text-foreground">12,850</p>
                  </div>
                  <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <p className="font-medium text-orange-700">Below Target</p>
                    </div>
                    <p className="mt-1 text-sm text-orange-600">-9.5% variance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          

          {/* AI Report Tab */}
          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5" />
                    AI Performance Summary
                  </CardTitle>
                  <Badge variant="outline">Generated today at 09:00</Badge>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
  <div className="rounded-lg bg-secondary/50 p-4 space-y-4">

    {/* Top Performers */}
    <div>
      <h4 className="font-semibold text-foreground">Top Performers</h4>
      <p className="text-muted-foreground">
        {campaigns.filter(c => c.performance === "above").length} campaigns are outperforming their targets.
        The top-performing campaign is driving a strong {campaigns[0].ctr}% CTR, significantly exceeding the 0.27% benchmark.
        High-performing campaigns are primarily concentrated in investment and savings products, indicating strong customer interest in wealth-building opportunities.
      </p>
    </div>

    {/* Attention Required */}
    <div>
      <h4 className="font-semibold text-foreground">Attention Required</h4>
      <p className="text-muted-foreground">
        {campaigns.filter(c => c.performance === "below").length} campaigns are underperforming against expectations.
        Several campaigns show low CTR despite high reach, suggesting suboptimal targeting or message relevance.
        Immediate optimization is recommended for campaigns falling below the CTR threshold to improve engagement and conversion outcomes.
      </p>
    </div>

    {/* Recommendation */}
    <div>
      <h4 className="font-semibold text-foreground">Recommendation</h4>
      <p className="text-muted-foreground">
        Based on current performance trends and market signals, investment and savings campaigns are gaining strong momentum.
        Consider reallocating budget from underperforming loan campaigns to higher-performing segments such as Prime and Wealth Potential.
        Additionally, refine targeting and refresh creatives for low-performing campaigns to better align with current customer preferences.
      </p>
    </div>

  </div>
</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
