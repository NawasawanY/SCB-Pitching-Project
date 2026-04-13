"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Zap,
  RefreshCw,
  Newspaper,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// AI Generated Campaign Recommendations linked to news
const aiRecommendations = [
  {
    id: 1,
    rank: 1,
    confidence: 96,
    status: "hot",
    linkedNews: {
      headline: "กนง. มีมติ 5-2 คงดอกเบี้ย พร้อมส่งสัญญาณลดรอบถัดไป",
      source: "Bank of Thailand",
      category: "Rate Change",
      impact: "High",
    },
    campaign: {
      title: "Fixed Deposit Rate Lock Campaign",
      headline: "ล็อคดอกเบี้ยสูงก่อนลด! เงินฝากประจำ SCB 2.75%",
      description: "โอกาสสุดท้ายก่อนดอกเบี้ยลด! เปิดบัญชีเงินฝากประจำ SCB รับดอกเบี้ยสูงถึง 2.75% ต่อปี ล็อคอัตราดอกเบี้ยนาน 12 เดือน ฝากขั้นต่ำเพียง 10,000 บาท เริ่มต้นวันนี้ - สิ้นเดือนนี้เท่านั้น",
      cta: "เปิดบัญชีเลย",
    },
    targetGroup: {
      name: "Prime",
      size: "890K",
      matchScore: 94,
    },
    predictions: {
      expectedSent: 520000,
      expectedCTR: 0.4,
      expectedCVS: 0.8,
      expectedTransactions: 4400,
      expectedAllotment: 8800000,
    },
    reasoning: [
      "ข่าว BOT ส่งสัญญาณลดดอกเบี้ย สร้าง urgency ให้ลูกค้าล็อคอัตราดอกเบี้ยสูงก่อน",
      "กลุ่ม Prime มี idle cash สูง เหมาะกับการฝากประจำ",
      "Historical data: campaign Fixed Deposit หลังข่าวดอกเบี้ยมี conversion สูง 3x",
      "ควรเริ่ม campaign ภายใน 24-48 ชม. ก่อนข่าวเย็นลง",
    ],
  },
  {
    id: 2,
    rank: 2,
    confidence: 92,
    status: "hot",
    linkedNews: {
      headline: "SET Index ปิดบวก 15 จุด มูลค่าซื้อขายทะลุ 8 หมื่นล้าน",
      source: "SET Announcements",
      category: "Market Volatility",
      impact: "High",
    },
    campaign: {
      title: "Equity Fund Investment Promotion",
      headline: "ตลาดหุ้นขาขึ้น! เริ่มลงทุนกองทุนหุ้นไทยวันนี้",
      description: "จับจังหวะตลาดหุ้นขาขึ้น ลงทุนกองทุนหุ้นไทย SCB SET50 Index Fund ค่าธรรมเนียมซื้อ 0% ตลอดเดือนนี้ เริ่มต้นเพียง 1,000 บาท พร้อมรับรายงานวิเคราะห์ตลาดรายสัปดาห์ฟรี",
      cta: "ลงทุนเลย",
    },
    targetGroup: {
      name: "Wealth Potential",
      size: "1.5M",
      matchScore: 88,
    },
    predictions: {
      expectedSent: 680000,
      expectedCTR: 0.35,
      expectedCVS: 0.7,
      expectedTransactions: 4800,
      expectedAllotment: 7200000,
    },
    reasoning: [
      "SET Index ทำ new high สร้าง positive sentiment ในตลาด",
      "นักลงทุนรายย่อยมักตามกระแสตลาดขาขึ้น",
      "กลุ่ม Wealth Potential มีความสนใจในการลงทุนสูง",
      "ค่าธรรมเนียม 0% เป็น strong incentive ในช่วงตลาดบวก",
    ],
  },
  {
    id: 3,
    rank: 3,
    confidence: 89,
    status: "recommended",
    linkedNews: {
      headline: "SCB เปิดตัวกองทุน AI Technology Fund ผลตอบแทน YTD +24%",
      source: "Prachachat Business",
      category: "Fund Launch",
      impact: "High",
    },
    campaign: {
      title: "AI Tech Fund Launch Campaign",
      headline: "ลงทุนในอนาคต กับ SCB AI Technology Fund",
      description: "เปิดตัวกองทุนใหม่! SCB AI Technology Fund ลงทุนในหุ้น AI และเทคโนโลยีชั้นนำระดับโลก ผลตอบแทนตั้งแต่ต้นปี +24% เริ่มต้นลงทุนเพียง 1,000 บาท รับบทวิเคราะห์เชิงลึก AI Trends ฟรี",
      cta: "ศึกษากองทุน",
    },
    targetGroup: {
      name: "First",
      size: "320K",
      matchScore: 91,
    },
    predictions: {
      expectedSent: 180000,
      expectedCTR: 0.5,
      expectedCVS: 0.9,
      expectedTransactions: 1600,
      expectedAllotment: 4000000,
    },
    reasoning: [
      "กองทุนใหม่ได้รับความสนใจจากสื่อ สร้าง awareness สูง",
      "ผลตอบแทน +24% YTD เป็น strong selling point",
      "กลุ่ม First มี investment appetite และรับความเสี่ยงได้",
      "เทรนด์ AI investment เป็น long-term growth trend",
    ],
  },
  {
    id: 4,
    rank: 4,
    confidence: 82,
    status: "recommended",
    linkedNews: {
      headline: "สินเชื่อบ้านไตรมาส 2 คาดโต 8% หลังดอกเบี้ยมีแนวโน้มลด",
      source: "Thairath Business",
      category: "Macroeconomic",
      impact: "Medium",
    },
    campaign: {
      title: "Home Loan Refinance Promotion",
      headline: "รีไฟแนนซ์บ้านตอนนี้ ดอกเบี้ยต่ำที่สุด!",
      description: "รีไฟแนนซ์สินเชื่อบ้านกับ SCB ดอกเบี้ยเริ่มต้น 2.99% ต่อปี ฟรีค่าประเมินราคา ฟรีค่าจดจำนอง อนุมัติไว ภายใน 3 วันทำการ วงเงินสูงสุด 50 ล้านบาท",
      cta: "คำนวณวงเงิน",
    },
    targetGroup: {
      name: "Upper Mass",
      size: "2.4M",
      matchScore: 78,
    },
    predictions: {
      expectedSent: 850000,
      expectedCTR: 0.3,
      expectedCVS: 0.55,
      expectedTransactions: 4900,
      expectedAllotment: 9800000,
    },
    reasoning: [
      "ข่า���สินเชื่อบ้านโตสร้าง context ที่ดีสำหรับ refinance campaign",
      "ลูกค้าที่มีสินเชื่อบ้านอยู่แล้วอาจมองหา rate ที่ดีกว่า",
      "กลุ่ม Upper Mass มีสัดส่วนผู้มีสินเชื่อบ้านสูง",
      "Campaign นี้มี longer runway สามารถทำได้ต่อเนื่อง",
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
      subtitle="AI-generated campaign recommendations based on real-time financial news"
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
              Based on news from last 24 hours
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline">
                <Newspaper className="mr-2 h-4 w-4" />
                View News Feed
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Regenerating..." : "Regenerate All"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Campaign List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Campaigns Linked to News
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
                        <h4 className="font-medium text-foreground line-clamp-1">
                          {rec.campaign.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {rec.linkedNews.headline}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        rec.status === "hot" 
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {rec.status === "hot" ? "Hot" : "Recommended"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <Badge variant="outline" className="text-xs">
                      {rec.linkedNews.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <Zap className="h-3.5 w-3.5" />
                      <span>{rec.confidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaign Detail */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b border-border pb-4">
              {/* Linked News Source */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Newspaper className="h-3.5 w-3.5" />
                  <span>Based on news from {selectedCampaign.linkedNews.source}</span>
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {selectedCampaign.linkedNews.headline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedCampaign.linkedNews.category}
                  </Badge>
                  <Badge 
                    className={
                      selectedCampaign.linkedNews.impact === "High" 
                        ? "bg-red-100 text-red-700 text-xs"
                        : "bg-yellow-100 text-yellow-700 text-xs"
                    }
                  >
                    {selectedCampaign.linkedNews.impact} Impact
                  </Badge>
                </div>
              </div>

              <div>
                <CardTitle className="text-xl">
                  {selectedCampaign.campaign.title}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Target: {selectedCampaign.targetGroup.name} ({selectedCampaign.targetGroup.size} users)
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <Tabs defaultValue="campaign">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="campaign">Campaign Content</TabsTrigger>
                  <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
                </TabsList>

                <TabsContent value="campaign" className="mt-4 space-y-4">
                  {/* Multi-Variant Message Generation */}
                  <div>
                    <div className="space-y-3">
                      {/* Variant A - Urgency */}
                      <div className="rounded-lg border border-primary bg-primary/5 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-primary/10 text-primary">Variant A - Urgency</Badge>
                          <Badge variant="outline" className="text-green-600">Recommended</Badge>
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">
                          {selectedCampaign.campaign.headline}
                        </h4>
                        <p className="mt-2 text-muted-foreground">
                          {selectedCampaign.campaign.description}
                        </p>
                        <Button className="mt-3" size="sm">
                          {selectedCampaign.campaign.cta}
                        </Button>
                      </div>

                      {/* Variant B - Educational */}
                      <div className="rounded-lg border border-border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">Variant B - Educational</Badge>
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">
                          รู้หรือไม่? ตอนนี้คือจังหวะที่ดีในการลงทุน
                        </h4>
                        <p className="mt-2 text-muted-foreground">
                          จากสถานการณ์ตลาดล่าสุด SCB มีผลิตภัณฑ์ที่ตอบโจทย์การลงทุนของคุณ เรียนรู้เพิ่มเติมเกี่ยวกับโอกาสและสิทธิประโยชน์ที่รอคุณอยู่
                        </p>
                        <Button className="mt-3" size="sm" variant="outline">
                          เรียนรู้เพิ่มเติม
                        </Button>
                      </div>

                      {/* Variant C - Opportunity */}
                      <div className="rounded-lg border border-border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">Variant C - Opportunity</Badge>
                        </div>
                        <h4 className="text-lg font-semibold text-foreground">
                          โอกาสพิเศษเฉพาะคุณจากข่าวการเงินล่าสุด!
                        </h4>
                        <p className="mt-2 text-muted-foreground">
                          เราเลือกข้อเสนอนี้มาเพื่อคุณโดยเฉพาะ บนพื้นฐานของสถานการณ์ตลาดปัจจุบัน SCB พร้อมช่วยให้คุณบรรลุเป้าหมายทางการเงิน
                        </p>
                        <Button className="mt-3" size="sm" variant="outline">
                          รับข้อเสนอพิเศษ
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expected KPIs */}
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-medium text-foreground">
                        Expected Campaign KPIs
                      </h5>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Benchmark: CTR 0.3% | CVS 0.6%</span>
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-5">
                      <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {(selectedCampaign.predictions.expectedSent / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Expected Sent</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedCampaign.predictions.expectedCTR}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Expected CTR</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">above benchmark</p>

                      </div>
                      <div className="rounded-lg bg-primary/10 p-3 text-center">
                        <p className="text-2xl font-bold text-primary">
                          {selectedCampaign.predictions.expectedCVS}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Expected CVS</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">above benchmark</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {selectedCampaign.predictions.expectedTransactions.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Expected Trans</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {(selectedCampaign.predictions.expectedAllotment / 1000000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Allotment (THB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Regenerate Button */}
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                      {isGenerating ? "Generating..." : "Regenerate This Campaign"}
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
                      <h5 className="font-medium text-foreground">News Context</h5>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Source</span>
                          <span className="font-medium text-foreground">{selectedCampaign.linkedNews.source}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Category</span>
                          <span className="font-medium text-foreground">{selectedCampaign.linkedNews.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Impact</span>
                          <Badge 
                            className={
                              selectedCampaign.linkedNews.impact === "High" 
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {selectedCampaign.linkedNews.impact}
                          </Badge>
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
                          <span className="text-muted-foreground">Size</span>
                          <span className="font-medium text-foreground">{selectedCampaign.targetGroup.size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-medium text-green-600">{selectedCampaign.targetGroup.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/">
                      <Button variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Original News
                      </Button>
                    </Link>
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
