import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Trash } from "lucide-react"; // Import a trash icon from lucide-react or any other icon library
import { Button } from "./ui/button";
import { collection, doc, getDocs, increment, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { toast } from "sonner";
import { useUser } from "@/user/UserContext";
import { useState } from "react";
import { Spinner } from "./Spinner";


const gameSchema = z.object({
    players: z.array(
        z.object({
            dominionUsername: z.string().min(1, "you must enter a username"),
            won: z.boolean(),
        })
    ),
});

type GameSchema = z.infer<typeof gameSchema>;

export function AddGameForm({ onClose }: { onClose?: () => void }) {
	const userContext = useUser();
	const user = userContext.user;
    const form = useForm<GameSchema>({
        resolver: zodResolver(gameSchema),
        defaultValues: {
            players: [
                { dominionUsername: user?.dominionUsername || "", won: false },
                { dominionUsername: "", won: false },
            ],
        },
    });

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async () => {
		setIsLoading(true);
		const players = form.getValues("players");
		const winners = players.filter((player) => player.won);

		const batch = writeBatch(db); // Initialize a Firestore batch

		for (const player of players) {
			try {
				// Query Firestore to find the document with the matching dominionUsername
				const q = query(collection(db, "users"), where("dominionUsername", "==", player.dominionUsername));
				const querySnapshot = await getDocs(q);

				if (querySnapshot.empty) {
					console.error(`No document found for dominionUsername: ${player.dominionUsername}`);
					toast.error(`No user found with username: ${player.dominionUsername}`);
					continue;
				}

				// Get the document ID
				const docId = querySnapshot.docs[0].id;
				const docRef = doc(db, "users", docId);

				// Add update operations to the batch
				if (winners.some((winner) => winner.dominionUsername === player.dominionUsername)) {
					if (winners.length > 1) {
						batch.update(docRef, {
							ties: increment(1),
							gamesPlayed: increment(1),
						});
					} else {
						batch.update(docRef, {
							wins: increment(1),
							gamesPlayed: increment(1),
						});
					}
				} else {
					batch.update(docRef, {
						gamesPlayed: increment(1),
					});
				}
			} catch (error) {
				console.error(`Error preparing update for ${player.dominionUsername}:`, error);
				toast.error(`Error preparing game update for player ${player.dominionUsername}.`);
			}
		}

		try {
			// Commit the batch
			await batch.commit();
			console.log("Batch updates committed successfully!");
			toast.success("Game results saved successfully!");
		} catch (error) {
			console.error("Error committing batch updates:", error);
			toast.error("Error saving game results.");
		}
		

		onClose?.();
		setIsLoading(false);
	};

    return (
        <div className="flex flex-col gap-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">dominion username</th>
                                <th className="px-4 py-2 text-left">winner?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.watch("players").map((_, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        <FormField
                                            control={form.control}
                                            name={`players.${index}.dominionUsername`}
                                            render={({ field }) => (
                                                <FormControl>
													<div>
														<Input
															{...field}
															value={field.value}
															onChange={(e) => field.onChange(e.target.value)}
															type="text"
															placeholder={`player ${index + 1} Username`}
															className="input"
														/>
														<FormMessage />
													</div>
                                                </FormControl>
                                            )}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <FormField
                                            control={form.control}
                                            name={`players.${index}.won`}
                                            render={({ field: winnerField }) => (
                                                <FormControl>
													<div>
														<Checkbox
															checked={winnerField.value}
															onCheckedChange={(checked) =>
																winnerField.onChange(checked)
															}
															className="h-5 w-5"
														/>
														<FormMessage />
													</div>
                                                </FormControl>
                                            )}
                                        />
                                    </td>
									<td className="px-4 py-2">
                                        <Button
                                            variant="ghost"
											disabled={form.watch("players").length <= 2 || isLoading}
                                            onClick={() => {
                                                const updatedPlayers = form
                                                    .getValues("players")
                                                    .filter((_, i) => i !== index);
                                                form.setValue("players", updatedPlayers);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={() =>
                                form.setValue("players", [
                                    ...form.getValues("players"),
                                    { dominionUsername: "", won: false },
                                ])
                            }
                            className="btn"
							disabled={isLoading}
                        >
                            + Add Player
                        </Button>
						<Button type="submit" disabled={isLoading} className="flex items-center gap-2">
							{isLoading ? <Spinner colour='white' size='small' /> : 'Submit'}
						</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}