import { ChartConfig } from "@/components/ui/chart";
import { Player } from "@/types/player";

export function useChartConfig({
  players,
  colours,
}: {
  players: Player[];
  colours: string[];
}) {
  const chartConfig: ChartConfig = {};
  players.forEach((player, index) => {
    chartConfig[player.id] = { label: player.name, color: colours[index] };
  });

  return chartConfig;
}
