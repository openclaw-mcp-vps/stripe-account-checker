"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskReportData } from "@/lib/risk-calculator";

type RiskReportProps = {
  report: RiskReportData;
  businessName: string;
};

const categoryLabels: Record<string, string> = {
  business_model: "Business model",
  compliance: "Compliance",
  transactions: "Transactions",
  operations: "Operations",
  history: "History"
};

const bandStyles: Record<RiskReportData["band"], { badge: "success" | "warning" | "danger" }> = {
  Low: {
    badge: "success"
  },
  Moderate: {
    badge: "warning"
  },
  High: {
    badge: "danger"
  },
  Critical: {
    badge: "danger"
  }
};

function scoreColor(score: number) {
  if (score < 25) return "#34d399";
  if (score < 50) return "#fbbf24";
  if (score < 75) return "#fb7185";
  return "#ef4444";
}

export function RiskReport({ report, businessName }: RiskReportProps) {
  const chartData = [{ name: "risk", value: report.score, fill: scoreColor(report.score) }];
  const breakdownData = report.categoryScores.map((entry) => ({
    name: categoryLabels[entry.category] ?? entry.category,
    score: entry.score
  }));

  return (
    <div className="grid gap-6">
      <Card className="border-cyan-500/30 bg-slate-900/90">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="font-heading text-3xl text-slate-50">{businessName} Risk Report</CardTitle>
              <CardDescription className="mt-2 text-slate-300">{report.summary}</CardDescription>
            </div>
            <Badge variant={bandStyles[report.band].badge} className="text-sm">
              {report.band} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="mb-3 text-sm text-slate-400">Suspension score</p>
            <div className="h-52 w-full">
              <ResponsiveContainer>
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  barSize={24}
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={12} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-12 text-center">
              <p className="font-heading text-5xl text-slate-50">{report.score}</p>
              <p className="mt-1 text-xs text-slate-400">out of 100</p>
            </div>
            <p className="mt-4 text-sm text-slate-300">{report.suspensionLikelihood}</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="mb-3 text-sm text-slate-400">Risk breakdown by area</p>
              <div className="h-56 w-full">
                <ResponsiveContainer>
                  <BarChart data={breakdownData} layout="vertical" margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" domain={[0, 40]} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} />
                    <Tooltip
                      cursor={{ fill: "rgba(15,23,42,0.6)" }}
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", color: "#e2e8f0" }}
                    />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                      {breakdownData.map((entry) => (
                        <Cell key={entry.name} fill={scoreColor(entry.score * 2.5)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-200">Top recommendations</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {report.recommendations.map((recommendation) => (
                  <li key={recommendation} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-xl text-slate-50">Triggered risk signals</CardTitle>
          <CardDescription className="text-slate-300">
            These conditions most directly contribute to your Stripe enforcement exposure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.triggeredRules.length === 0 ? (
            <p className="text-sm text-emerald-300">No critical triggers detected from your submitted profile.</p>
          ) : (
            <div className="grid gap-3">
              {report.triggeredRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-100">{rule.title}</p>
                    <Badge variant="slate">+{rule.weight} pts</Badge>
                    <Badge variant="slate">{categoryLabels[rule.category] ?? rule.category}</Badge>
                  </div>
                  <p className="text-slate-300">{rule.reason}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
