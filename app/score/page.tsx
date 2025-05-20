"use client";

import { Button } from "@/components/ui/button";
import { WinsPieChart } from "@/components/WinsPieChart";
import { useChartConfig } from "@/hooks/useChartConfig";
import { useColours } from "@/hooks/useColours";
import { usePlayers } from "@/hooks/usePlayers";
import { useSearchParams } from "next/navigation";

export default function Score() {
	const searchParams = useSearchParams();
	const playersData = usePlayers(searchParams.getAll("player"));
	const players = playersData.data ?? [];
	const colours = useColours(players.length ?? 0)
	const chartConfig = useChartConfig({ players, colours });

	return (
		<div>
			<WinsPieChart chartConfig={chartConfig} data={players.map((p, i) => ({player: p.name, wins: p.winCount, fill: colours[i]}))} />
			<div className="flex flex-row items-center justify-items-between gap-[32px]">
				{players.map((player, index) => (
					<Button style={{ backgroundColor: colours[index] }} className="player-button" key={player.id}>{player.name}</Button>
				))}
			</div>
		</div>
	);
}
