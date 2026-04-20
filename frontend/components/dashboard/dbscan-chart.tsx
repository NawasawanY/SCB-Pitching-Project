"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2, Layers, CircleDot, Info } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface ClusterPoint {
  x: number
  y: number
  cluster: number
  cluster_name: string
  category: string
  headline: string
  source: string
}

interface ClusterMeta {
  id: number
  name: string
  name_th: string
  category: string
  summary: string
  size: number
}

interface ClusterMapData {
  points: ClusterPoint[]
  clusters: ClusterMeta[]
  article_count: number
  cluster_count: number
  noise_count: number
}

// ── Color palette ─────────────────────────────────────────────────────────────

const CLUSTER_COLORS = [
  "#7c3aed", // violet
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#84cc16", // lime
  "#8b5cf6", // purple
  "#06b6d4", // cyan
]

const NOISE_COLOR = "#94a3b8" // slate-400

const CATEGORY_ICON: Record<string, string> = {
  rate: "📈",
  equity: "📊",
  gold: "🥇",
  fx: "💱",
  property: "🏠",
  crypto: "₿",
  macro: "🌐",
  other: "📰",
}

function getClusterColor(clusterId: number, clusters: ClusterMeta[]): string {
  if (clusterId === -1) return NOISE_COLOR
  const idx = clusters.filter((c) => c.id !== -1).findIndex((c) => c.id === clusterId)
  return CLUSTER_COLORS[idx % CLUSTER_COLORS.length]
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const d: ClusterPoint = payload[0]?.payload
  if (!d) return null
  const isNoise = d.cluster === -1
  return (
    <div className="max-w-xs rounded-lg border border-border bg-card p-3 shadow-lg text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span>{CATEGORY_ICON[d.category] ?? "📰"}</span>
        <span className="font-medium text-foreground truncate">{d.cluster_name}</span>
        {isNoise && <Badge variant="secondary" className="text-xs">noise</Badge>}
      </div>
      <p className="text-muted-foreground line-clamp-3">{d.headline}</p>
      <p className="mt-1 text-xs text-muted-foreground/70">{d.source}</p>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DbscanChart() {
  const [data, setData] = useState<ClusterMapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("http://localhost:8000/api/cluster-map")
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? `HTTP ${res.status}`)
      }
      const json: ClusterMapData = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message ?? "Failed to load cluster map")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Group points by cluster for recharts (each cluster = one <Scatter>)
  const namedClusters = data?.clusters.filter((c) => c.id !== -1) ?? []
  const noiseClusters = data?.clusters.filter((c) => c.id === -1) ?? []

  const pointsByCluster: Record<number, ClusterPoint[]> = {}
  data?.points.forEach((p) => {
    if (!pointsByCluster[p.cluster]) pointsByCluster[p.cluster] = []
    pointsByCluster[p.cluster].push(p)
  })

  const visibleClusters = selectedCluster === null
    ? namedClusters
    : namedClusters.filter((c) => c.id === selectedCluster)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {data && (
            <>
              <Badge variant="outline" className="gap-1">
                <Layers className="h-3 w-3" />
                {data.cluster_count} clusters
              </Badge>
              <Badge variant="outline" className="gap-1">
                <CircleDot className="h-3 w-3" />
                {data.article_count} articles
              </Badge>
              <Badge variant="secondary" className="gap-1 text-muted-foreground">
                {data.noise_count} noise
              </Badge>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {loading ? "Computing…" : "Refresh"}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-secondary/20">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Embedding articles and running DBSCAN…</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.points.length === 0 && (
        <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-secondary/20">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Info className="h-8 w-8" />
            <p className="text-sm">No articles in database. Run <code>/api/sync-news</code> first.</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {data && data.points.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Scatter plot */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Topic Cluster Map
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (PCA 2D projection of news embeddings)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="PC1"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: "PC1", position: "insideBottom", offset: -4, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="PC2"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: "PC2", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />

                    {/* Noise points always shown (gray) */}
                    {pointsByCluster[-1] && (
                      <Scatter
                        name="Unclustered"
                        data={pointsByCluster[-1]}
                        fill={NOISE_COLOR}
                        opacity={0.35}
                        r={3}
                      />
                    )}

                    {/* One Scatter series per named cluster */}
                    {visibleClusters.map((cluster) => {
                      const color = getClusterColor(cluster.id, data.clusters)
                      const pts = pointsByCluster[cluster.id] ?? []
                      return (
                        <Scatter
                          key={cluster.id}
                          name={cluster.name}
                          data={pts}
                          fill={color}
                          opacity={0.85}
                          r={5}
                        />
                      )
                    })}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cluster legend panel */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Detected Topics</h3>

            {/* "All" filter */}
            <button
              onClick={() => setSelectedCluster(null)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedCluster === null
                  ? "border-primary bg-primary/5 font-medium text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              All clusters
            </button>

            {namedClusters.map((cluster) => {
              const color = getClusterColor(cluster.id, data.clusters)
              const isActive = selectedCluster === cluster.id
              return (
                <button
                  key={cluster.id}
                  onClick={() =>
                    setSelectedCluster(isActive ? null : cluster.id)
                  }
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-foreground truncate">
                      {CATEGORY_ICON[cluster.category] ?? "📰"} {cluster.name}
                    </span>
                    <Badge variant="secondary" className="ml-auto shrink-0 text-xs">
                      {cluster.size}
                    </Badge>
                  </div>
                  {cluster.name_th && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground pl-5">
                      {cluster.name_th}
                    </p>
                  )}
                  {cluster.summary && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground pl-5">
                      {cluster.summary}
                    </p>
                  )}
                </button>
              )
            })}

            {noiseClusters.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: NOISE_COLOR }}
                />
                <span>Unclustered</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {noiseClusters[0].size}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
