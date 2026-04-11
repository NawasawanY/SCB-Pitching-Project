"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Clock,
  Users,
  MessageSquare,
  Hash,
  Filter,
  RefreshCw,
  Flame,
  Globe,
  Newspaper,
  Twitter,
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
import Link from "next/link"

// Simulated external trend data sources
const trendSources = [
  { name: "Social Media", icon: Twitter, count: 156, color: "text-blue-500" },
  { name: "News Articles", icon: Newspaper, count: 48, color: "text-orange-500" },
  { name: "Global Trends", icon: Globe, count: 23, color: "text-green-500" },
]

const liveTrends = [
  {
    id: 1,
    name: "#SongkranSale",
    category: "Lifestyle",
    volume: "125K",
    change: "+45%",
    changeType: "up",
    source: "Twitter",
    sentiment: "positive",
    peakTime: "2-4 days",
    description: "เทศกาลสงกรานต์กำลังมาถึง ผู้บริโภคมองหาโปรโมชั่นและส่วนลดพิเศษ",
    relatedKeywords: ["สงกรานต์", "โปรโมชั่น", "ส่วนลด", "ช้อปปิ้ง"],
    hourlyData: [
      { hour: "6AM", volume: 2400 },
      { hour: "9AM", volume: 5800 },
      { hour: "12PM", volume: 8900 },
      { hour: "3PM", volume: 12400 },
      { hour: "6PM", volume: 15200 },
      { hour: "9PM", volume: 11800 },
      { hour: "Now", volume: 13500 },
    ],
  },
  {
    id: 2,
    name: "K-Pop Comeback",
    category: "Entertainment",
    volume: "98K",
    change: "+32%",
    changeType: "up",
    source: "Twitter",
    sentiment: "positive",
    peakTime: "5-7 days",
    description: "วง K-Pop ยอดนิยมประกาศ comeback พร้อมทัวร์คอนเสิร์ตในเอเชีย",
    relatedKeywords: ["คอนเสิร์ต", "แฟนมีตติ้ง", "บัตรคอนเสิร์ต", "merchandise"],
    hourlyData: [
      { hour: "6AM", volume: 1800 },
      { hour: "9AM", volume: 4200 },
      { hour: "12PM", volume: 7800 },
      { hour: "3PM", volume: 9200 },
      { hour: "6PM", volume: 11500 },
      { hour: "9PM", volume: 14200 },
      { hour: "Now", volume: 10800 },
    ],
  },
  {
    id: 3,
    name: "AI Investment",
    category: "Finance",
    volume: "87K",
    change: "+28%",
    changeType: "up",
    source: "News",
    sentiment: "positive",
    peakTime: "14-21 days",
    description: "กระแสการลงทุนในหุ้นและกองทุน AI กำลังได้รับความสนใจจากนักลงทุนรายย่อย",
    relatedKeywords: ["หุ้น AI", "กองทุนเทคโนโลยี", "การลงทุน", "Nvidia"],
    hourlyData: [
      { hour: "6AM", volume: 3200 },
      { hour: "9AM", volume: 6800 },
      { hour: "12PM", volume: 8200 },
      { hour: "3PM", volume: 7900 },
      { hour: "6PM", volume: 6500 },
      { hour: "9PM", volume: 5200 },
      { hour: "Now", volume: 7400 },
    ],
  },
  {
    id: 4,
    name: "Summer Travel",
    category: "Travel",
    volume: "76K",
    change: "+22%",
    changeType: "up",
    source: "Social",
    sentiment: "positive",
    peakTime: "21-30 days",
    description: "ช่วงหน้าร้อนใกล้เข้ามา คนเริ่มวางแผนท่องเที่ยวต่างประเทศ",
    relatedKeywords: ["เที่ยวญี่ปุ่น", "เที่ยวเกาหลี", "จองตั๋วเครื่องบิน", "โรงแรม"],
    hourlyData: [
      { hour: "6AM", volume: 1500 },
      { hour: "9AM", volume: 3800 },
      { hour: "12PM", volume: 5200 },
      { hour: "3PM", volume: 6100 },
      { hour: "6PM", volume: 7800 },
      { hour: "9PM", volume: 8500 },
      { hour: "Now", volume: 6200 },
    ],
  },
  {
    id: 5,
    name: "EV Subsidies",
    category: "Automotive",
    volume: "65K",
    change: "+18%",
    changeType: "up",
    source: "News",
    sentiment: "neutral",
    peakTime: "30+ days",
    description: "รัฐบาลประกาศมาตรการส่งเสริมรถยนต์ไฟฟ้าใหม่",
    relatedKeywords: ["รถ EV", "สินเชื่อรถยนต์", "ส่วนลดภาษี", "Tesla"],
    hourlyData: [
      { hour: "6AM", volume: 2100 },
      { hour: "9AM", volume: 4500 },
      { hour: "12PM", volume: 5800 },
      { hour: "3PM", volume: 5200 },
      { hour: "6PM", volume: 4800 },
      { hour: "9PM", volume: 4100 },
      { hour: "Now", volume: 5500 },
    ],
  },
]

const newsArticles = [
  {
    title: "สงกรานต์ 2569: ธุรกิจคาดเงินสะพัด 1.5 แสนล้าน",
    source: "Bangkok Post",
    time: "2 ชั่วโมงที่แล้ว",
    url: "#",
  },
  {
    title: "BTS ประกาศคอนเสิร์ตในไทย ตั๋วขายหมดใน 5 นาที",
    source: "Khaosod",
    time: "4 ชั่วโมงที่แล้ว",
    url: "#",
  },
  {
    title: "นักวิเคราะห์แนะลงทุนหุ้น AI รับกระแส Generative AI",
    source: "Prachachat",
    time: "6 ชั่วโมงที่แล้ว",
    url: "#",
  },
  {
    title: "การท่องเที่ยวญี่ปุ่นฟื้นตัว คนไทยจองทัวร์เพิ่ม 200%",
    source: "Thairath",
    time: "8 ชั่วโมงที่แล้ว",
    url: "#",
  },
]

export default function TrendFeedPage() {
  return (
    <DashboardLayout
      title="Trend Feed"
      subtitle="Real-time external signals from social media, news, and global trends"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Live monitoring active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                placeholder="Search trends..."
                className="w-64 pl-9"
              />
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Source Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          {trendSources.map((source) => (
            <Card key={source.name}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${source.color}`}>
                  <source.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{source.name}</p>
                  <p className="text-2xl font-bold text-foreground">{source.count}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Active
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Live Trends List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Flame className="h-5 w-5 text-orange-500" />
                Live Trending Topics
              </h2>
              <Link href="/recommendations">
                <Button>
                  View AI Recommendations
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {liveTrends.map((trend) => (
                <Card key={trend.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid gap-4 p-4 md:grid-cols-[1fr,200px]">
                      {/* Trend Info */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {trend.name}
                              </h3>
                              <Badge variant="outline">{trend.category}</Badge>
                              <Badge 
                                className={
                                  trend.sentiment === "positive" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-gray-100 text-gray-700"
                                }
                              >
                                {trend.sentiment}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {trend.description}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{trend.volume}</span>
                            <span className="text-muted-foreground">mentions</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {trend.changeType === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={trend.changeType === "up" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {trend.change}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Peak: {trend.peakTime}</span>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2">
                          {trend.relatedKeywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trend.hourlyData}>
                            <defs>
                              <linearGradient id={`gradient-${trend.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="volume"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              fill={`url(#gradient-${trend.id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* News Feed Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Newspaper className="h-5 w-5 text-muted-foreground" />
                  Related News
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsArticles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    className="group block rounded-lg border border-border p-3 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                  >
                    <h4 className="font-medium text-foreground group-hover:text-primary line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>{article.time}</span>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Customer Segment Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  AI is analyzing these trends against your customer demographics
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Urban Millennials", match: 94 },
                    { name: "Gen Z Digital", match: 87 },
                    { name: "Young Families", match: 72 },
                  ].map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{segment.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${segment.match}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {segment.match}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/targets">
                  <Button variant="outline" className="mt-2 w-full" size="sm">
                    View All Segments
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
