"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DbscanChart } from "@/components/dashboard/dbscan-chart"

export default function ClusterMapPage() {
  return (
    <DashboardLayout
      title="Topic Cluster Map"
      subtitle="DBSCAN semantic clustering of news articles — each dot is an article, each color is a topic cluster"
    >
      <DbscanChart />
    </DashboardLayout>
  )
}
