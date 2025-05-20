import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase-config";
import { Player } from "@/types/player";
import { collection, getDocs, query, where } from "@firebase/firestore";

export function usePlayers(players: string[]): { data: Player[] | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<Player[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (players.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users"), where("dominionUsername", "in", players));
        const querySnapshot = await getDocs(q);

        const playersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().dominionUsername,
		  winCount: doc.data().wins,
        })) as Player[];

        setData(playersData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [players]);

  return { data, loading, error };
}