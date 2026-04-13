"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ExternalLink,
  Clock,
  RefreshCw,
  Newspaper,
  AlertCircle,
  ChevronRight,
  Search,
  Settings,
} from "lucide-react"
import Link from "next/link"

// Financial News with FR-N02 & FR-N03 requirements
const financialNews = [
  {
    id: 1,
    headline: "กนง. มีมติ 5-2 คงดอกเบี้ย พร้อมส่งสัญญาณลดรอบถัดไป",
    summary: "คณะกรรมการนโยบายการเงิน มีมติคงอัตราดอกเบี้ยนโยบายที่ 2.25% แต่ส่งสัญญาณชัดเจนว่าพร้อมปรับลดในการประชุมรอบถัดไป หากเศรษฐกิจชะลอตัวต่อเนื่อง นักวิเคราะห์คาดการณ์ว่าจะลดดอกเบี้ย 0.25% ในเดือนหน้า",
    source: "Bank of Thailand",
    time: "30 นาทีที่แล้ว",
    category: "Rate Change",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 98,
    affectedProducts: ["Fixed Deposits", "Home Loans", "Investment Funds", "Bonds"],
    url: "#",
  },
  {
    id: 2,
    headline: "SET Index ปิดบวก 15 จุด มูลค่าซื้อขายทะลุ 8 หมื่นล้าน",
    summary: "ดัชนี SET ปิดตลาดที่ 1,425 จุด เพิ่มขึ้น 15 จุด (+1.06%) มูลค่าการซื้อขายรวม 82,500 ล้านบาท นักลงทุนต่างชาติซื้อสุทธิ 2,500 ล้านบาท หุ้นกลุ่มพลังงานและธนาคารเป็นแรงหนุนหลัก",
    source: "SET Announcements",
    time: "2 ชั่วโมงที่แล้ว",
    category: "Market Volatility",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 92,
    affectedProducts: ["Equity Funds", "ETFs", "Stock Trading"],
    url: "#",
  },
  {
    id: 3,
    headline: "SCB เปิดตัวกองทุน AI Technology Fund ผลตอบแทน YTD +24%",
    summary: "ธนาคารไทยพาณิชย์เปิดตัวกองทุนใหม่ SCB AI Technology Fund ที่ลงทุนในหุ้นเทคโนโลยี AI ชั้นนำ มีผลตอบแทนตั้งแต่ต้นปี +24% สูงกว่าดัชนี NASDAQ กองทุนเหมาะสำหรับนักลงทุนที่รับความเสี่ยงได้สูง",
    source: "Prachachat Business",
    time: "4 ชั่วโมงที่แล้ว",
    category: "Fund Launch",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 95,
    affectedProducts: ["Mutual Funds", "Tech Funds", "AI Investments"],
    url: "#",
  },
  {
    id: 4,
    headline: "ก.ล.ต. ปรับปรุงเกณฑ์การลงทุนในสินทรัพย์ดิจิทัล",
    summary: "สำนักงาน ก.ล.ต. ประกาศปรับปรุงหลักเกณฑ์การลงทุนในสินทรัพย์ดิจิทัลสำหรับกองทุนรวม โดยอนุญาตให้กองทุนรวมสามารถลงทุนใน Bitcoin ETF ที่จดทะเบียนในต่างประเทศได้ไม่เกิน 10% ของ NAV",
    source: "Bangkok Post Finance",
    time: "5 ชั่วโมงที่แล้ว",
    category: "Regulatory Update",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 78,
    affectedProducts: ["Digital Asset Funds", "Crypto Products"],
    url: "#",
  },
  {
    id: 5,
    headline: "สินเชื่อบ้านไตรมาส 2 คาดโต 8% หลังดอกเบี้ยมีแนวโน้มลด",
    summary: "สมาคมธนาคารไทยคาดการณ์ว่าสินเชื่อที่อยู่อาศัยในไตรมาส 2 จะเติบโต 8% จากปีก่อน หลังอัตราดอกเบี้ยมีแนวโน้มปรับลด ธนาคารหลายแห่งเริ่มออกโปรโมชั่นดอกเบี้ยพิเศษเพื่อแย่งชิงลูกค้า",
    source: "Thairath Business",
    time: "6 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 85,
    affectedProducts: ["Home Loans", "Refinance", "Property Insurance"],
    url: "#",
  },
  {
    id: 6,
    headline: "เงินบาทอ่อนค่าแตะ 34.50 บาท/ดอลลาร์",
    summary: "เงินบาทอ่อนค่าลงแตะระดับ 34.50 บาทต่อดอลลาร์สหรัฐ จากแรงกดดันค่าเงินดอลลาร์ที่แข็งค่าขึ้นหลัง Fed ส่งสัญญาณคงดอกเบี้ยสูงนานขึ้น นักวิเคราะห์คาดบาทจะเคลื่อนไหวในกรอบ 34.30-34.80 สัปดาห์นี้",
    source: "Reuters Thailand",
    time: "8 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "neutral",
    urgency: "time-sensitive",
    relevanceScore: 72,
    affectedProducts: ["FX Products", "Import/Export Financing", "Travel Cards"],
    url: "#",
  },
  {
    id: 7,
    headline: "ทองคำพุ่งแตะ 42,000 บาท/บาททอง สูงสุดรอบ 2 ปี",
    summary: "ราคาทองคำในประเทศปรับขึ้นแตะระดับ 42,000 บาทต่อบาททอง สูงสุดในรอบ 2 ปี จากความต้องการสินทรัพย์ปลอดภัยท่ามกลางความไม่แน่นอนทางเศรษฐกิจโลก นักลงทุนแนะนำถือทองคำเป็นส่วนหนึ่งของพอร์ต",
    source: "Gold Traders Association",
    time: "3 ชั่วโมงที่แล้ว",
    category: "Market Volatility",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 88,
    affectedProducts: ["Gold Investment", "Gold Savings", "Commodity Funds"],
    url: "#",
  },
  {
    id: 8,
    headline: "บัตรเครดิตยอดใช้จ่ายพุ่ง 15% ช่วงสงกรานต์",
    summary: "ยอดใช้จ่ายผ่านบัตรเครดิตในช่วงเทศกาลสงกรานต์เพิ่มขึ้น 15% เมื่อเทียบกับปีก่อน โดยหมวดท่องเที่ยวและโรงแรมเติบโตสูงสุด ธนาคารเร่งออกโปรโมชั่นแคชแบ็คและสะสมคะแนนพิเศษ",
    source: "Visa Thailand",
    time: "1 ชั่วโมงที่แล้ว",
    category: "Market Volatility",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 90,
    affectedProducts: ["Credit Cards", "Travel Cards", "Cashback Programs"],
    url: "#",
  },
  {
    id: 9,
    headline: "ยอดขายรถ EV เดือนมีนาคมโต 45% YoY",
    summary: "ยอดขายรถยนต์ไฟฟ้าในเดือนมีนาคมเติบโต 45% เมื่อเทียบกับปีก่อน โดยมียอดจดทะเบียนใหม่กว่า 8,500 คัน แบรนด์จีนครองส่วนแบ่งตลาด 70% ธนาคารแข่งขันออกสินเชื่อรถ EV ดอกเบี้ยพิเศษ",
    source: "Bangkok Post Automotive",
    time: "4 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 82,
    affectedProducts: ["Auto Loans", "EV Financing", "Insurance"],
    url: "#",
  },
  {
    id: 10,
    headline: "กองทุน SSF/RMF ยอดซื้อพุ่งก่อนสิ้นปีภาษี",
    summary: "ยอดซื้อกองทุน SSF และ RMF เพิ่มขึ้น 25% ในช่วงไตรมาสแรก นักลงทุนเร่งวางแผนภาษีก่อนกำหนด บลจ.หลายแห่งออกแคมเปญส่งเสริมการขายและลดค่าธรรมเนียม",
    source: "AIMC Thailand",
    time: "2 ชั่วโมงที่แล้ว",
    category: "Fund Launch",
    impact: "High",
    sentiment: "positive",
    urgency: "time-sensitive",
    relevanceScore: 94,
    affectedProducts: ["SSF Funds", "RMF Funds", "Tax Planning"],
    url: "#",
  },
  {
    id: 11,
    headline: "ธปท. เตือนหนี้ครัวเรือนสูง แนะธนาคารระวังสินเชื่อรายย่อย",
    summary: "ธนาคารแห่งประเทศไทยออกคำเตือนเกี่ยวกับระดับหนี้ครัวเรือนที่สูงถึง 91% ต่อ GDP แนะนำธนาคารพาณิชย์เข้มงวดในการพิจารณาสินเชื่อรายย่อย โดยเฉพาะสินเชื่อส่วนบุคคลและบัตรเครดิต",
    source: "Bank of Thailand",
    time: "5 ชั่วโมงที่แล้ว",
    category: "Regulatory Update",
    impact: "High",
    sentiment: "neutral",
    urgency: "evergreen",
    relevanceScore: 85,
    affectedProducts: ["Personal Loans", "Credit Cards", "Debt Consolidation"],
    url: "#",
  },
  {
    id: 12,
    headline: "ประกันชีวิตยอดเบี้ยโต 12% นักลงทุนหันหาความคุ้มครอง",
    summary: "ยอดเบี้ยประกันชีวิตรับปีแรกเติบโต 12% ในไตรมาสแรก โดยประกันแบบยูนิตลิงค์และประกันสะสมทรัพย์ได้รับความนิยมสูงสุด นักลงทุนมองหาผลิตภัณฑ์ที่ให้ทั้งความคุ้มครองและผลตอบแทน",
    source: "OIC Thailand",
    time: "6 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 76,
    affectedProducts: ["Life Insurance", "Unit-Linked Insurance", "Endowment Plans"],
    url: "#",
  },
  {
    id: 13,
    headline: "SME ไทยฟื้นตัว ยอดขอสินเชื่อเพิ่ม 18%",
    summary: "ยอดขอสินเชื่อ SME เพิ่มขึ้น 18% ในไตรมาสแรก สะท้อนความเชื่อมั่นของผู้ประกอบการที่ฟื้นตัวหลังโควิด ธนาคารออกผลิตภัณฑ์สินเชื่อดอกเบี้ยต่ำเพื่อสนับสนุน SME",
    source: "SME Bank",
    time: "7 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 80,
    affectedProducts: ["SME Loans", "Business Loans", "Working Capital"],
    url: "#",
  },
  {
    id: 14,
    headline: "ตลาดอสังหาฯ กทม. คึกคัก ยอดโอนคอนโดพุ่ง 20%",
    summary: "ตลาดอสังหาริมทรัพย์ในกรุงเทพฯ กลับมาคึกคัก ยอดโอนกรรมสิทธิ์คอนโดมิเนียมเพิ่มขึ้น 20% ในไตรมาสแรก ทำเลใกล้รถไฟฟ้ายังเป็นที่นิยม ธนาคารแข่งขันออกสินเชื่อบ้านดอกเบี้ยพิเศษ",
    source: "REIC Thailand",
    time: "8 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "High",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 88,
    affectedProducts: ["Home Loans", "Mortgage", "Property Insurance"],
    url: "#",
  },
  {
    id: 15,
    headline: "นักท่องเที่ยวต่างชาติทะลุเป้า 10 ล้านคน",
    summary: "จำนวนนักท่องเที่ยวต่างชาติในไตรมาสแรกทะลุเป้าหมาย 10 ล้านคน เพิ่มขึ้น 35% จากปีก่อน ส่งผลดีต่อธุรกิจท่องเที่ยว โรงแรม และค้าปลีก ธนาคารออกผลิตภัณฑ์ประกันการเดินทางและบัตรเครดิตสำหรับนักท่องเที่ยว",
    source: "TAT Thailand",
    time: "9 ชั่วโมงที่แล้ว",
    category: "Macroeconomic",
    impact: "Medium",
    sentiment: "positive",
    urgency: "evergreen",
    relevanceScore: 74,
    affectedProducts: ["Travel Insurance", "Travel Cards", "FX Services"],
    url: "#",
  },
]

// Category filter options
const categoryFilters = [
  { value: "all", label: "All Categories" },
  { value: "Rate Change", label: "Rate Change" },
  { value: "Fund Launch", label: "Fund Launch" },
  { value: "Market Volatility", label: "Market Volatility" },
  { value: "Regulatory Update", label: "Regulatory Update" },
  { value: "Macroeconomic", label: "Macroeconomic" },
]

export default function TrendFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNews, setSelectedNews] = useState(financialNews[0])

  const filteredNews = financialNews.filter((news) => {
    const matchesCategory = selectedCategory === "all" || news.category === selectedCategory
    const matchesSearch = news.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <DashboardLayout
      title="News Intelligence"
      subtitle="Automated financial news ingestion from trusted Thai and international sources"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Auto-sync every 30 mins</span>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Last sync: 2 mins ago
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                placeholder="Search news..."
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* News List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Newspaper className="h-5 w-5 text-muted-foreground" />
                Financial News ({filteredNews.length})
              </h2>
              <Link href="/recommendations">
                <Button>
                  View AI Campaign Recommendations
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {filteredNews.map((news) => (
                <Card 
                  key={news.id} 
                  className={`cursor-pointer transition-all ${
                    selectedNews.id === news.id
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedNews(news)}
                >
                  <CardContent className="p-4">
                    {/* Impact & Category Badges (FR-N02) */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge 
                        className={
                          news.impact === "High" 
                            ? "bg-red-100 text-red-700" 
                            : news.impact === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {news.impact} Impact
                      </Badge>
                      <Badge variant="outline">{news.category}</Badge>
                      {news.urgency === "time-sensitive" && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Time-Sensitive
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className="ml-auto"
                      >
                        Relevance: {news.relevanceScore}%
                      </Badge>
                    </div>

                    {/* Headline (FR-N03) */}
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {news.headline}
                    </h3>

                    {/* Summary (FR-N03) */}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {news.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{news.source}</span>
                      <div className="flex items-center gap-3">
                        <span>{news.time}</span>
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Original
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* News Detail Sidebar */}
          <div className="space-y-4">
            {/* Selected News Detail */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    className={
                      selectedNews.impact === "High" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {selectedNews.impact} Impact
                  </Badge>
                  <Badge variant="outline">{selectedNews.category}</Badge>
                </div>
                <CardTitle className="text-base leading-tight">
                  {selectedNews.headline}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Summary */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedNews.summary}
                  </p>
                </div>

                {/* Affected Products (FR-N03) */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Affected SCB Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.affectedProducts.map((product) => (
                      <Badge key={product} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Relevance Score */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">SCB Relevance Score</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-secondary">
                      <div 
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${selectedNews.relevanceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary">{selectedNews.relevanceScore}%</span>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                  <Badge 
                    className={
                      selectedNews.sentiment === "positive"
                        ? "bg-green-100 text-green-700"
                        : selectedNews.sentiment === "negative"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {selectedNews.sentiment.charAt(0).toUpperCase() + selectedNews.sentiment.slice(1)}
                  </Badge>
                </div>

                {/* Source Link */}
                <Button variant="outline" className="w-full" asChild>
                  <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Original Article
                  </a>
                </Button>
              </CardContent>
            </Card>

            </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
