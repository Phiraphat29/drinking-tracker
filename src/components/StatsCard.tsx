"use client";

import { Log } from "@/types/database";
import confetti from "canvas-confetti";
import { Card, CardHeader, CardBody, Tabs, Tab, Progress } from "@heroui/react";
import { useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface StatsCardProps {
  logs: Log[];
  dailyGoal: number;
}

export default function StatsCard({ logs, dailyGoal }: StatsCardProps) {
  const now = new Date();

  const startOfDayMs = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const sumInRange = (start: number, end: number) =>
    logs.reduce((sum, log) => {
      const t = new Date(log.created_at).getTime();
      return t >= start && t < end ? sum + (log.amount_ml || 0) : sum;
    }, 0);

  // Daily series: 7 points starting from today, then yesterday, ... to 6 days ago
  const dailySeries = useMemo(() => {
    const series: { label: string; value: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = startOfDayMs(d);
      const dayEnd = startOfDayMs(
        new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
      );

      const label =
        i === 0
          ? "วันนี้"
          : i === 1
          ? "เมื่อวาน"
          : d.toLocaleDateString("th-TH", { weekday: "short" });

      series.push({
        label,
        value: sumInRange(dayStart, dayEnd),
      });
    }
    return series.reverse();
  }, [logs]);

  const todayTotal = dailySeries[6]?.value ?? 0;

  useEffect(() => {
    if (!dailyGoal || todayTotal < dailyGoal) return;

    const today = new Date();
    const key = `hydration-celebrated:${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (localStorage.getItem(key)) return;

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    localStorage.setItem(key, "1");
  }, [todayTotal, dailyGoal]);

  // Weekly series: 4 points (this week -> 3 weeks back), Monday-based week
  const weekly = useMemo(() => {
    const startOfWeek = (d: Date) => {
      const day = d.getDay();
      const diffToMon = (day + 6) % 7;
      const start = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - diffToMon
      );
      start.setHours(0, 0, 0, 0);
      return start;
    };
    const fmtDM = (d: Date) =>
      d.toLocaleDateString("th-TH", { day: "numeric", month: "numeric" });

    const points: { label: string; value: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const ref = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i * 7
      );
      const weekStart = startOfWeek(ref);
      const weekEnd = new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + 7
      );

      const value = sumInRange(weekStart.getTime(), weekEnd.getTime());
      const endInclusive = new Date(
        weekEnd.getFullYear(),
        weekEnd.getMonth(),
        weekEnd.getDate() - 1
      );
      const label = `${fmtDM(weekStart)}-${fmtDM(endInclusive)}`;

      points.push({ label, value });
    }
    return {
      series: points.reverse(),
      thisWeekTotal: points[points.length - 1]?.value ?? 0,
      weeklyGoal: (dailyGoal || 0) * 7,
    };
  }, [logs, dailyGoal]);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-center items-center">
        <h2 className="text-2xl font-bold">สถิติการดื่มน้ำ</h2>
      </CardHeader>
      <CardBody className="flex flex-col justify-center items-center overflow-hidden">
        <Tabs
          aria-label="Stats tabs"
          color="primary"
          variant="solid"
          radius="full"
        >
          <Tab key="daily" title="รายวัน (7 วันล่าสุด)" className="w-full px-4">
            <span className="text-sm text-gray-500">
              วันนี้คุณดื่มน้ำไปแล้ว {todayTotal} ml จาก {dailyGoal} ml
            </span>
            {todayTotal >= dailyGoal ? (
              <Progress
                aria-label="Daily progress"
                color="success"
                className="w-full mb-4"
                value={todayTotal}
                showValueLabel={true}
                maxValue={dailyGoal || 1}
              />
            ) : (
              <Progress
                aria-label="Daily progress"
                color="primary"
                className="w-full mb-4"
                value={todayTotal}
                showValueLabel={true}
                maxValue={dailyGoal || 1}
              />
            )}
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySeries}>
                  <defs>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    color="gray"
                    strokeWidth={0.5}
                  />
                  <XAxis dataKey="label" />
                  <YAxis width="auto" />
                  <Tooltip
                    formatter={(val: number) => [`${val} ml`, "ปริมาณ"]}
                    contentStyle={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorDaily)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tab>

          <Tab
            key="weekly"
            title="รายสัปดาห์ (4 สัปดาห์ล่าสุด)"
            className="w-full px-4"
          >
            <span className="text-sm text-gray-500">
              สัปดาห์นี้คุณดื่มน้ำไปแล้ว {weekly.thisWeekTotal} ml จาก{" "}
              {weekly.weeklyGoal} ml
            </span>
            <Progress
              aria-label="Weekly progress"
              color="secondary"
              className="w-full mb-4"
              showValueLabel={true}
              value={weekly.thisWeekTotal}
              maxValue={weekly.weeklyGoal}
            />
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" minWidth={0} height="100%">
                <AreaChart data={weekly.series}>
                  <defs>
                    <linearGradient
                      id="colorWeekly"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7828c8" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#7828c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip
                    formatter={(val: number) => [`${val} ml`, "ปริมาณ"]}
                    contentStyle={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7828c8"
                    fillOpacity={1}
                    fill="url(#colorWeekly)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
