"use client";

import { MyStatsDonut } from '@/components/MyStatsDonut';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signOut } from '@/firebase/auth/auth';
import { useUserSession } from '@/hooks/useUserSession';
import { useUser } from '@/user/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	const userContext = useUser();
	const loading = useUserSession();

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
				<Button>add game</Button>
				<Button onClick={() => signOut()}>logout</Button>
			</div>
	
			<MyStatsDonut />
	
		</div>
	);
}
