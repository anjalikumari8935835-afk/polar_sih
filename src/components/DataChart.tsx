"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";

const data = [
  {
    month: "Jan",
    temperature: -18,
    windSpeed: 18,
    humidity: 72,
  },
  {
    month: "Feb",
    temperature: -21,
    windSpeed: 22,
    humidity: 75,
  },
  {
    month: "Mar",
    temperature: -24,
    windSpeed: 25,
    humidity: 78,
  },
  {
    month: "Apr",
    temperature: -17,
    windSpeed: 19,
    humidity: 70,
  },
  {
    month: "May",
    temperature: -12,
    windSpeed: 16,
    humidity: 68,
  },
  {
    month: "Jun",
    temperature: -8,
    windSpeed: 14,
    humidity: 65,
  },
];

const variables = [
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
  },
  {
    key: "windSpeed",
    label: "Wind Speed",
    unit: "m/s",
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
  },
];

export default function DataChart() {
  const [selectedVariable, setSelectedVariable] =
    useState("temperature");

const [selectedPeriod, setSelectedPeriod] =
  useState("2025");
  const variable = variables.find(
    (item) => item.key === selectedVariable
  );

  return (
    <div className="w-full">
    <div className="mb-6 flex flex-col gap-4">
        {variables.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedVariable(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selectedVariable === item.key
                ? "bg-sky-600 text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
  <span className="mr-2 text-sm font-semibold text-slate-600">
    Time Period:
  </span>

  {["2023", "2024", "2025"].map((year) => (
    <button
      key={year}
      type="button"
      onClick={() => setSelectedPeriod(year)}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        selectedPeriod === year
          ? "bg-slate-900 text-white"
          : "border border-slate-300 bg-white text-slate-600 hover:border-slate-500"
      }`}
    >
      {year}
    </button>
  ))}
</div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `${value} ${variable?.unit}`,
                variable?.label,
              ]}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey={selectedVariable}
              name={variable?.label}
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-4 text-xs text-slate-400">
  Demonstration data shown for interface development. Production
  observations will be provided by the data management team.
</p>
      </div>
    </div>
  );
}