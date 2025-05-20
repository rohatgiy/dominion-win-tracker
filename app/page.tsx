"use client";

import { AddGameForm } from '@/components/AddGameForm';
import { MyStatsDonut } from '@/components/MyStatsDonut';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog,DialogContent, DialogTrigger, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { signOut } from '@/firebase/auth/auth';
import { useUserSession } from '@/hooks/useUserSession';
import { useUser } from '@/user/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
	const router = useRouter();
	const userContext = useUser();
	const loading = useUserSession();
	const [isAddGameDialogOpen, setIsAddGameDialogOpen] = useState(false);

	if (loading) {
		return <Spinner />;
	}

	if (!userContext.user) {
		router.push("/signup");
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-center gap-16">
			<div className="flex flex-col gap-4">
				<Card className="flex flex-col px-4 max-h-[250px] h-full gap-3">
					<p className="font-bold">{userContext.user.displayName}</p>
					<p>wins: {userContext.user.wins}</p>
					<p>ties: {userContext.user.ties}</p>
					<p>losses: {userContext.user.gamesPlayed - userContext.user.wins - userContext.user.ties}</p>
					<p>games played: {userContext.user.gamesPlayed}</p>
					{/* <Button variant="link" onClick={() => router.push("/score")}></Button> */}
				</Card>
				<Dialog open={isAddGameDialogOpen} onOpenChange={setIsAddGameDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setIsAddGameDialogOpen(true)}>add game</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px] z-50'>
						<DialogHeader>
							<DialogTitle>add game</DialogTitle>
							<DialogDescription>record the result to a game</DialogDescription>
						</DialogHeader>
						<AddGameForm onClose={() => setIsAddGameDialogOpen(false)}/>
					</DialogContent>
				</Dialog>
				<Button onClick={() => signOut()}>logout</Button>
			</div>
	
			<MyStatsDonut />
	
		</div>
	);
}
