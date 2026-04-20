"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  RefreshCw,
  Newspaper,
  Zap,
  Target,
  TrendingUp,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Radio,
  MessageSquare,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Types matching the backend models
interface TrendItem {
  trend_name: string
  trend_name_en: string
  summary: string
  confidence: number
  scb_products: string[]
  category: string
  cluster_size: number
  growth_ratio: number
  emerging: boolean
  headlines: string[]
}

interface SegmentMatch {
  segment_name: string
  match_score: number
  predicted_ctr: number
  predicted_cvs: number
  reasoning: string
}

interface LineMessage {
  title: string
  body: string
  cta_text: string
  cta_url: string
}

interface SourceTrend {
  name: string
  confidence: number
  category: string
  cluster_size: number
  emerging: boolean
}

interface TrendCampaign {
  campaign_name: string
  campaign_name_en: string
  objective: string
  target_segments: SegmentMatch[]
  line_message: LineMessage | null
  recommended_products: string[]
  urgency: string
  estimated_reach: number
  source_trend: SourceTrend | null
}

interface SignalNode {
  id: string
  type: string
  count: number
}

interface SignalLink {
  source: string
  target: string
  weight: number
}

export default function PocPage() {
  // Sync news state
  const [syncResult, setSyncResult] = useState<{ fetched: number; added: number } | null>(null)
  const [syncLoading, setSyncLoading] = useState(false)

  // Trend radar state
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [trendMeta, setTrendMeta] = useState<{ article_count: number; cluster_count: number } | null>(null)
  const [trendLoading, setTrendLoading] = useState(false)

  // Auto campaigns state
  const [campaigns, setCampaigns] = useState<TrendCampaign[]>([])
  const [campaignLoading, setCampaignLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<TrendCampaign | null>(null)

  // Signal map state
  const [signalNodes, setSignalNodes] = useState<SignalNode[]>([])
  const [signalLinks, setSignalLinks] = useState<SignalLink[]>([])
  const [signalLoading, setSignalLoading] = useState(false)
  const [signalMeta, setSignalMeta] = useState<{ article_count: number; entity_count: number; edge_count: number } | null>(null)

  // Error state
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // 1. Sync News
  const handleSyncNews = async () => {
    setSyncLoading(true)
    clearError()
    try {
      const res = await fetch(`${API_BASE}/api/sync-news`)
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`)
      const data = await res.json()
      setSyncResult({ fetched: data.fetched, added: data.added })
    } catch (e: any) {
      setError(`News sync error: ${e.message}`)
    } finally {
      setSyncLoading(false)
    }
  }

  // 2. Trend Radar
  const handleTrendRadar = async () => {
    setTrendLoading(true)
    clearError()
    try {
      const res = await fetch(`${API_BASE}/api/trend-radar?window_days=7`)
      if (!res.ok) throw new Error(`Trend radar failed: ${res.status}`)
      const data = await res.json()
      setTrends(data.trends || [])
      setTrendMeta({ article_count: data.article_count, cluster_count: data.cluster_count || 0 })
    } catch (e: any) {
      setError(`Trend radar error: ${e.message}`)
    } finally {
      setTrendLoading(false)
    }
  }

  // 3. Auto Campaigns
  const handleAutoCampaigns = async () => {
    setCampaignLoading(true)
    clearError()
    try {
      const res = await fetch(`${API_BASE}/api/auto-campaigns?top_n=3&window_days=7`)
      if (!res.ok) throw new Error(`Auto campaigns failed: ${res.status}`)
      const data = await res.json()
      const campaignList = data.campaigns || []
      setCampaigns(campaignList)
      if (campaignList.length > 0) setSelectedCampaign(campaignList[0])
    } catch (e: any) {
      setError(`Auto campaigns error: ${e.message}`)
    } finally {
      setCampaignLoading(false)
    }
  }

  // 4. Signal Map
  const handleSignalMap = async () => {
    setSignalLoading(true)
    clearError()
    try {
      const res = await fetch(`${API_BASE}/api/signal-map?use_llm=false&min_weight=1`)
      if (!res.ok) throw new Error(`Signal map failed: ${res.status}`)
      const data = await res.json()
      setSignalNodes(data.nodes || [])
      setSignalLinks(data.links || [])
      setSignalMeta({ article_count: data.article_count, entity_count: data.entity_count, edge_count: data.edge_count })
    } catch (e: any) {
      setError(`Signal map error: ${e.message}`)
    } finally {
      setSignalLoading(false)
    }
  }

  // Run full pipeline
  const handleFullPipeline = async () => {
    await handleSyncNews()
    await handleTrendRadar()
    await handleAutoCampaigns()
    await handleSignalMap()
  }

  return (
    <DashboardLayout
      title="PoC Live Demo"
      subtitle="End-to-end pipeline querying the real backend"
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-700 flex-1">{error}</p>
                <Button variant="ghost" size="sm" onClick={clearError}>Dismiss</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pipeline Controls */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Backend Pipeline Controls
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Each button calls the real Python backend at <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{API_BASE}</code>
                </p>
              </div>
              <Button
                onClick={handleFullPipeline}
                disabled={syncLoading || trendLoading || campaignLoading || signalLoading}
              >
                {(syncLoading || trendLoading || campaignLoading || signalLoading) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Run Full Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1: Sync News */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">Step 1</Badge>
                {syncResult && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <h4 className="font-medium text-foreground">Sync News</h4>
              <p className="text-xs text-muted-foreground mt-1">Fetch 50 articles from NewsAPI</p>
              {syncResult && (
                <div className="mt-2 text-sm">
                  <span className="text-green-600 font-medium">{syncResult.fetched}</span> fetched,{" "}
                  <span className="text-primary font-medium">{syncResult.added}</span> new
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleSyncNews}
                disabled={syncLoading}
              >
                {syncLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Newspaper className="mr-2 h-3 w-3" />}
                {syncLoading ? "Syncing..." : "Sync"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Trend Radar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">Step 2</Badge>
                {trends.length > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <h4 className="font-medium text-foreground">Trend Radar</h4>
              <p className="text-xs text-muted-foreground mt-1">DBSCAN clustering + LLM naming</p>
              {trendMeta && (
                <div className="mt-2 text-sm">
                  <span className="text-primary font-medium">{trends.length}</span> trends from{" "}
                  <span className="font-medium">{trendMeta.article_count}</span> articles
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleTrendRadar}
                disabled={trendLoading}
              >
                {trendLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <TrendingUp className="mr-2 h-3 w-3" />}
                {trendLoading ? "Detecting..." : "Detect Trends"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Auto Campaigns */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">Step 3</Badge>
                {campaigns.length > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <h4 className="font-medium text-foreground">Auto Campaigns</h4>
              <p className="text-xs text-muted-foreground mt-1">Trend → Campaign generation</p>
              {campaigns.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-primary font-medium">{campaigns.length}</span> campaigns generated
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleAutoCampaigns}
                disabled={campaignLoading}
              >
                {campaignLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Send className="mr-2 h-3 w-3" />}
                {campaignLoading ? "Generating..." : "Generate"}
              </Button>
            </CardContent>
          </Card>

          {/* Step 4: Signal Map */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">Step 4</Badge>
                {signalNodes.length > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <h4 className="font-medium text-foreground">Signal Map</h4>
              <p className="text-xs text-muted-foreground mt-1">Entity co-occurrence graph</p>
              {signalMeta && (
                <div className="mt-2 text-sm">
                  <span className="text-primary font-medium">{signalMeta.entity_count}</span> entities,{" "}
                  <span className="font-medium">{signalMeta.edge_count}</span> edges
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleSignalMap}
                disabled={signalLoading}
              >
                {signalLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Radio className="mr-2 h-3 w-3" />}
                {signalLoading ? "Building..." : "Build Map"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends" disabled={trends.length === 0}>
              Trend Radar ({trends.length})
            </TabsTrigger>
            <TabsTrigger value="campaigns" disabled={campaigns.length === 0}>
              Campaigns ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="signal" disabled={signalNodes.length === 0}>
              Signal Map ({signalNodes.length})
            </TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            {trends.map((trend, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{trend.trend_name || trend.trend_name_en}</h4>
                      {trend.trend_name_en && trend.trend_name && (
                        <p className="text-sm text-muted-foreground">{trend.trend_name_en}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {trend.emerging && (
                        <Badge className="bg-orange-100 text-orange-700">Emerging</Badge>
                      )}
                      <Badge variant="outline">{trend.category}</Badge>
                      <Badge variant="secondary">
                        Confidence: {(trend.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{trend.summary}</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-xl font-bold text-foreground">{trend.cluster_size}</p>
                      <p className="text-xs text-muted-foreground">Articles in Cluster</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-xl font-bold text-foreground">{trend.growth_ratio.toFixed(1)}x</p>
                      <p className="text-xs text-muted-foreground">Growth Ratio</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-xl font-bold text-foreground">{trend.scb_products.length}</p>
                      <p className="text-xs text-muted-foreground">SCB Products</p>
                    </div>
                  </div>

                  {trend.scb_products.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trend.scb_products.map((p, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  )}

                  {trend.headlines.length > 0 && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Sample Headlines:</p>
                      <ul className="space-y-1">
                        {trend.headlines.slice(0, 3).map((h, j) => (
                          <li key={j} className="text-xs text-muted-foreground truncate">- {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {trends.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No trends detected yet. Click "Detect Trends" above to analyze stored news.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Campaign list */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Generated Campaigns</h3>
                {campaigns.map((c, i) => (
                  <Card
                    key={i}
                    className={`cursor-pointer transition-all ${
                      selectedCampaign === c
                        ? "border-primary ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedCampaign(c)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-foreground line-clamp-2">
                            {c.campaign_name || c.campaign_name_en}
                          </h4>
                          {c.source_trend && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              From: {c.source_trend.name}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={
                            c.urgency === "time-sensitive"
                              ? "bg-red-100 text-red-700 shrink-0"
                              : "bg-green-100 text-green-700 shrink-0"
                          }
                        >
                          {c.urgency}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" />
                        <span>{c.target_segments.length} segments</span>
                        <span className="ml-auto font-medium text-primary">
                          {c.estimated_reach > 0 ? `${(c.estimated_reach / 1000).toFixed(0)}K reach` : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Campaign detail */}
              {selectedCampaign && (
                <Card className="lg:col-span-2">
                  <CardHeader className="border-b pb-4">
                    {/* Source Trend */}
                    {selectedCampaign.source_trend && (
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>Derived from trend</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedCampaign.source_trend.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedCampaign.source_trend.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Confidence: {(selectedCampaign.source_trend.confidence * 100).toFixed(0)}%
                          </Badge>
                          {selectedCampaign.source_trend.emerging && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">Emerging</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <CardTitle className="text-xl">
                      {selectedCampaign.campaign_name || selectedCampaign.campaign_name_en}
                    </CardTitle>
                    {selectedCampaign.campaign_name_en && selectedCampaign.campaign_name && (
                      <p className="text-sm text-muted-foreground">{selectedCampaign.campaign_name_en}</p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-4 space-y-5">
                    {/* Objective */}
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Objective</h5>
                      <p className="text-sm text-muted-foreground">{selectedCampaign.objective}</p>
                    </div>

                    {/* LINE Message Preview */}
                    {selectedCampaign.line_message && (
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          LINE Message Draft
                        </h5>
                        <div className="rounded-lg border bg-green-50 p-4 max-w-sm">
                          <p className="font-semibold text-foreground text-sm">
                            {selectedCampaign.line_message.title}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                            {selectedCampaign.line_message.body}
                          </p>
                          {selectedCampaign.line_message.cta_text && (
                            <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">
                              {selectedCampaign.line_message.cta_text}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Target Segments */}
                    {selectedCampaign.target_segments.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2">Target Segment Ranking</h5>
                        <div className="space-y-2">
                          {selectedCampaign.target_segments.map((seg, i) => (
                            <div key={i} className="rounded-lg border p-3 flex items-center justify-between">
                              <div>
                                <span className="font-medium text-foreground">{seg.segment_name}</span>
                                {seg.reasoning && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{seg.reasoning}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm shrink-0">
                                <div className="text-center">
                                  <p className="font-bold text-primary">{seg.match_score}%</p>
                                  <p className="text-[10px] text-muted-foreground">Match</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold text-foreground">{seg.predicted_ctr}%</p>
                                  <p className="text-[10px] text-muted-foreground">CTR</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold text-foreground">{seg.predicted_cvs}%</p>
                                  <p className="text-[10px] text-muted-foreground">CVS</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Products */}
                    {selectedCampaign.recommended_products.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-foreground mb-2">Recommended Products</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedCampaign.recommended_products.map((p, i) => (
                            <Badge key={i} variant="secondary">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            {campaigns.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No campaigns generated yet. Click "Generate" or "Run Full Pipeline" above.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Signal Map Tab */}
          <TabsContent value="signal" className="space-y-4">
            {signalMeta && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-foreground">{signalMeta.article_count}</p>
                    <p className="text-xs text-muted-foreground">Articles Analyzed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-primary">{signalMeta.entity_count}</p>
                    <p className="text-xs text-muted-foreground">Entities Extracted</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-foreground">{signalMeta.edge_count}</p>
                    <p className="text-xs text-muted-foreground">Co-occurrence Edges</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Entity Table */}
            {signalNodes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Entities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-3 text-left font-medium text-muted-foreground">Entity</th>
                          <th className="pb-3 text-left font-medium text-muted-foreground">Type</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">Mentions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signalNodes
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 20)
                          .map((node, i) => (
                            <tr key={i} className="border-b border-border/50">
                              <td className="py-2 font-medium text-foreground">{node.id}</td>
                              <td className="py-2">
                                <Badge variant="outline" className="text-xs">{node.type}</Badge>
                              </td>
                              <td className="py-2 text-right text-foreground">{node.count}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Links */}
            {signalLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Co-occurrences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-3 text-left font-medium text-muted-foreground">Source</th>
                          <th className="pb-3 text-left font-medium text-muted-foreground">Target</th>
                          <th className="pb-3 text-right font-medium text-muted-foreground">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signalLinks
                          .sort((a, b) => b.weight - a.weight)
                          .slice(0, 15)
                          .map((link, i) => (
                            <tr key={i} className="border-b border-border/50">
                              <td className="py-2 text-foreground">{link.source}</td>
                              <td className="py-2 text-foreground">{link.target}</td>
                              <td className="py-2 text-right font-medium text-primary">{link.weight.toFixed(1)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {signalNodes.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No signal map data yet. Click "Build Map" above to extract entities from news.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
