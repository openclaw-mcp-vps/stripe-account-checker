"use client";

import { RiskAssessment } from "@/types/risk-assessment";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  data: RiskAssessment;
};

const levelColor: Record<RiskAssessment["level"], string> = {
  low: "#3fb950",
  moderate: "#d29922",
  high: "#f0883e",
  critical: "#f85149"
};

export default function RiskReport({ data }: Props) {
  const chartData = [
    { name: "Risk", value: data.score },
    { name: "Headroom", value: 100 - data.score }
  ];

  return (
    <section className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Risk Score: {data.score}/100</h3>
          <p className="mt-2 text-sm text-slate-300">{data.summary}</p>
          <p className="mt-3 text-xs uppercase tracking-wide" style={{ color: levelColor[data.level] }}>
            {data.level} risk
          </p>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={70} stroke="none">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.name === "Risk" ? levelColor[data.level] : "#30363d"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#161b22", border: "1px solid #30363d", color: "#e6edf3" }}
                formatter={(value: number) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Top Concerns</h4>
        <div className="space-y-3">
          {data.topConcerns.map((concern) => (
            <article key={concern.id} className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-100">{concern.title}</p>
                <span className="text-xs uppercase tracking-wide text-slate-400">{concern.impact}</span>
              </div>
              <p className="mb-2 text-sm text-slate-300">{concern.explanation}</p>
              <p className="text-sm text-blue-300">{concern.recommendation}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Strengths</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {data.strengths.length > 0 ? (
              data.strengths.map((item) => <li key={item}>- {item}</li>)
            ) : (
              <li>- No material strengths detected yet. Focus on action plan execution.</li>
            )}
          </ul>
        </article>

        <article className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Action Plan</h4>
          <ol className="space-y-2 text-sm text-slate-300">
            {data.actionPlan.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
