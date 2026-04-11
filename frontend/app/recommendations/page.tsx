"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  Zap,
  Copy,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  BarChart3,
  MessageSquare,
} from "lucide-react"


// AI Generated Campaign Recommendations
const aiRecommendations = [
  {
    id: 1,
    rank: 1,
    confidence: 96,
    status: "hot",
    trend: {
      name: "#SongkranSale",
      category: "Lifestyle",
      volume: "125K",
      peakWindow: "2-4 days",
    },
    campaign: {
      title: "Songkran Festival Cashback Blast",
      headline: "สงกรานต์นี้ รับ Cashback สูงสุด 20%",
      description: "ฉลองเทศกาลสงกรานต์กับ SCB! รับเงินคืนสูงสุด 20% เมื่อใช้จ่ายผ่านบัตรเครดิต SCB ทุกประเภท ที่ร้านค้าชั้นนำทั่วประเทศ ตั้งแต่วันนี้ - 15 เม.ย. 69",
      cta: "สมัครรับสิทธิ์เลย",
      channels: ["SMS", "Push Notification", "Email", "In-App Banner"],
    },
    targetGroup: {
      name: "Urban Millennials",
      size: "2.4M",
      ageRange: "25-35",
      matchScore: 94,
    },
    predictions: {
      conversionRate: 4.8,
      marketBenchmark: 2.8,
      expectedReach: 1420000,
      estimatedROI: 4.2,
      engagementRate: 9.2,
    },
    metrics: [
      { name: "Trend Match", value: 95 },
      { name: "Audience Fit", value: 94 },
      { name: "Timing", value: 98 },
      { name: "Conversion", value: 88 },
      { name: "ROI Potential", value: 92 },
    ],
    reasoning: [
      "เทรนด์กำลังอยู่ในช่วง peak growth (+45% ใน 24 ชม.)",
      "กลุ่มเป้าหมายมี purchase intent สูงในช่วงเทศกาล",
      "Historical data แสดงว่า cashback campaigns ในช่วงเทศกาลมี conversion สูง 2x",
      "ควรเริ่ม campaign ภายใน 48 ชม. เพื่อจับ peak timing",
    ],
  },
  {
    id: 2,
    rank: 2,
    confidence: 89,
    status: "recommended",
    trend: {
      name: "K-Pop Comeback",
      category: "Entertainment",
      volume: "98K",
      peakWindow: "5-7 days",
    },
    campaign: {
      title: "K-Pop Fan Exclusive Benefits",
      headline: "สิทธิพิเศษสำหรับแฟนคลับ K-Pop ตัวจริง!",
      description: "สมัครบัตรเครดิต SCB วันนี้ รับสิทธิ์ซื้อบัตรคอนเสิร์ต presale + ส่วนลด merchandise 15% + สะสมคะแนนแลก meet & greet",
      cta: "สมัครบัตร K-Pop Fan Card",
      channels: ["Social Media", "Influencer", "LINE OA", "TikTok"],
    },
    targetGroup: {
      name: "Gen Z Digital Natives",
      size: "1.8M",
      ageRange: "18-24",
      matchScore: 87,
    },
    predictions: {
      conversionRate: 3.9,
      marketBenchmark: 2.5,
      expectedReach: 980000,
      estimatedROI: 3.5,
      engagementRate: 12.4,
    },
    metrics: [
      { name: "Trend Match", value: 92 },
      { name: "Audience Fit", value: 87 },
      { name: "Timing", value: 85 },
      { name: "Conversion", value: 82 },
      { name: "ROI Potential", value: 78 },
    ],
    reasoning: [
      "กระแส K-Pop comeback กำลังเติบโตอย่างรวดเร็ว",
      "Gen Z มี brand loyalty สูงกับ K-Pop idols",
      "การผูกโปรโมชั่นกับคอนเสิร์ตจะสร้าง urgency",
      "Social sharing potential สูง ช่วยเพิ่ม organic reach",
    ],
  },
  {
    id: 3,
    rank: 3,
    confidence: 84,
    status: "recommended",
    trend: {
      name: "AI Investment",
      category: "Finance",
      volume: "87K",
      peakWindow: "14-21 days",
    },
    campaign: {
      title: "AI Tech Fund Investment Package",
      headline: "ลงทุนในอนาคต กับ AI Technology Fund",
      description: "เริ่มต้นลงทุนในกองทุน AI & Technology ของ SCB เริ่มต้นเพียง 1,000 บาท พร้อมรับบทวิเคราะห์เชิงลึกฟรี และค่าธรรมเนียมซื้อ 0% ตลอดเดือนเมษายน",
      cta: "เริ่มลงทุนเลย",
      channels: ["Email", "SCB Easy App", "Website Banner", "LINE OA"],
    },
    targetGroup: {
      name: "Tech-Savvy Investors",
      size: "890K",
      ageRange: "30-50",
      matchScore: 91,
    },
    predictions: {
      conversionRate: 5.2,
      marketBenchmark: 3.2,
      expectedReach: 520000,
      estimatedROI: 5.8,
      engagementRate: 6.8,
    },
    metrics: [
      { name: "Trend Match", value: 88 },
      { name: "Audience Fit", value: 91 },
      { name: "Timing", value: 75 },
      { name: "Conversion", value: 92 },
      { name: "ROI Potential", value: 95 },
    ],
    reasoning: [
      "กระแส AI investment เป็น long-term trend",
      "Target group มี investment appetite สูง",
      "มี timeframe ยืดหยุ่นกว่า campaigns อื่น",
      "High-value conversion แม้ reach น้อยกว่า",
    ],
  },
  {
    id: 4,
    rank: 4,
    confidence: 78,
    status: "consider",
    trend: {
      name: "Summer Travel",
      category: "Travel",
      volume: "76K",
      peakWindow: "21-30 days",
    },
    campaign: {
      title: "Summer Getaway Travel Loan",
      headline: "ฝันอยากไปเที่ยว? SCB ช่วยได้",
      description: "สินเชื่อท่องเที่ยว SCB ดอกเบี้ยพิเศษ 0.89% ต่อเดือน อนุมัติไว ภายใน 24 ชม. วงเงินสูงสุด 500,000 บาท พร้อมประกันการเดินทางฟรี",
      cta: "สมัครสินเชื่อเลย",
      channels: ["Facebook", "Instagram", "Google Ads", "Travel Agency Partner"],
    },
    targetGroup: {
      name: "Young Families",
      size: "1.2M",
      ageRange: "28-40",
      matchScore: 72,
    },
    predictions: {
      conversionRate: 3.2,
      marketBenchmark: 2.1,
      expectedReach: 680000,
      estimatedROI: 3.1,
      engagementRate: 5.4,
    },
    metrics: [
      { name: "Trend Match", value: 78 },
      { name: "Audience Fit", value: 72 },
      { name: "Timing", value: 68 },
      { name: "Conversion", value: 75 },
      { name: "ROI Potential", value: 72 },
    ],
    reasoning: [
      "เทรนด์ยังอยู่ในช่วง early growth",
      "สามารถรอ timing ที่ดีกว่าได้",
      "ควร monitor ต่อและเตรียม campaign ไว้",
      "อาจเริ่ม soft launch ก่อน full campaign",
    ],
  },
]

export default function RecommendationsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState(aiRecommendations[0])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleRegenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <DashboardLayout
      title="AI Recommendations"
      subtitle="AI-generated campaign recommendations based on trends and customer demographics"
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {aiRecommendations.length} Campaigns Generated
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: 5 mins ago
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRegenerate}
            disabled={isGenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Regenerating..." : "Regenerate Recommendations"}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Campaign List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recommended Campaigns (Ranked by AI)
            </h3>
            {aiRecommendations.map((rec) => (
              <Card
                key={rec.id}
                className={`cursor-pointer transition-all ${
                  selectedCampaign.id === rec.id
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedCampaign(rec)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        rec.rank === 1 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {rec.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground line-clamp-1">
                            {rec.campaign.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rec.trend.name} • {rec.targetGroup.name}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        rec.status === "hot" 
                          ? "bg-red-100 text-red-700"
                          : rec.status === "recommended"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {rec.status === "hot" ? "Hot" : rec.status === "recommended" ? "Recommended" : "Consider"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-3.5 w-3.5" />
                      <span>{rec.predictions.conversionRate}% conv.</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <Zap className="h-3.5 w-3.5" />
                      <span>{rec.confidence}% confidence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaign Detail */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary">
                      {selectedCampaign.trend.name}
                    </Badge>
                    <Badge variant="outline">
                      {selectedCampaign.trend.category}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-xl">
                    {selectedCampaign.campaign.title}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Target: {selectedCampaign.targetGroup.name} ({selectedCampaign.targetGroup.size} users)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {selectedCampaign.confidence}%
                  </div>
                  <p className="text-xs text-muted-foreground">AI Confidence</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <Tabs defaultValue="campaign">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="campaign">Campaign Content</TabsTrigger>
                  <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
                </TabsList>

                <TabsContent value="campaign" className="mt-4 space-y-4">
                  {/* Campaign Content */}
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      {selectedCampaign.campaign.headline}
                    </h4>
                    <p className="mt-2 text-muted-foreground">
                      {selectedCampaign.campaign.description}
                    </p>
                    <Button className="mt-4">
                      {selectedCampaign.campaign.cta}
                    </Button>
                  </div>

                  {/* Channels */}
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">
                      Recommended Channels
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.campaign.channels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {(selectedCampaign.predictions.expectedReach / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-muted-foreground">Expected Reach</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedCampaign.predictions.conversionRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">Predicted Conversion</p>
                    </div>
                    <div className="rounded-lg border border-border p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {selectedCampaign.predictions.estimatedROI}x
                      </p>
                      <p className="text-xs text-muted-foreground">Estimated ROI</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Content
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reasoning" className="mt-4 space-y-4">
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <h5 className="flex items-center gap-2 font-medium text-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Why AI Recommends This Campaign
                    </h5>
                    <div className="mt-4 space-y-3">
                      {selectedCampaign.reasoning.map((reason, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                          <p className="text-sm text-muted-foreground">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium text-foreground">Trend Analysis</h5>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Volume</span>
                          <span className="font-medium text-foreground">{selectedCampaign.trend.volume}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Peak Window</span>
                          <span className="font-medium text-foreground">{selectedCampaign.trend.peakWindow}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Category</span>
                          <span className="font-medium text-foreground">{selectedCampaign.trend.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium text-foreground">Target Group Match</h5>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Segment</span>
                          <span className="font-medium text-foreground">{selectedCampaign.targetGroup.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Age Range</span>
                          <span className="font-medium text-foreground">{selectedCampaign.targetGroup.ageRange}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-medium text-green-600">{selectedCampaign.targetGroup.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
