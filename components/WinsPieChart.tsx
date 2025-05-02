"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Player } from "@/types/player"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

export type WinsPieChartData = {
	player: string
	wins: number
	fill?: string
}

export type WinsPieChartProps = {
	data?: WinsPieChartData[]
	chartConfig: ChartConfig
}

export function WinsPieChart({ data = [], chartConfig }: WinsPieChartProps) {
  return (
	<div className="w-full h-full">
		<ChartContainer
			config={chartConfig}
			className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
		>
			<PieChart>
			<ChartTooltip content={<ChartTooltipContent hideLabel />} />
			<Pie data={data} dataKey="wins" nameKey="player" />
			</PieChart>
		</ChartContainer>
	</div>
  )
}
