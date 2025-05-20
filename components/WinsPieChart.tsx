"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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
