"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Sector } from "../../types/portfolio.types";
import { formatCurrency } from "../../utils/formatters";

interface SectorPieChartProps {
  sectors: Sector[];
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#eab308",
  "#ef4444",
];

export default function SectorPieChart({
  sectors,
}: SectorPieChartProps) {
  const data = sectors.map((sector) => ({
    name: sector.sector,
    value: sector.sectorInvestment,
  }));

  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">
          Sector Allocation
        </h2>

        <p className="text-sm text-slate-400">
          Investment distribution across portfolio sectors.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              innerRadius={55}
              paddingAngle={3}
              label={({ name, percent }) => {
                const percentage = Number(percent ?? 0) * 100;

                return `${String(name ?? "")}: ${percentage.toFixed(1)}%`;
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#ffffff",
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}