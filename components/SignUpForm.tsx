"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app, db } from '../firebase/firebase-config';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
// import { useUser } from '@/user/UserContext';

const userSchema = z.object({
  dominionUsername: z.string().min(1, 'required'),
  displayName: z.string().optional(),
  wins: z.number().nonnegative(),
  ties: z.number().nonnegative(),
  gamesPlayed: z.number().nonnegative(),
});

export type UserSchema = z.infer<typeof userSchema>;

export function SignUpForm() {
	const form = useForm<UserSchema>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			dominionUsername: '',
			displayName: '',
			wins: 0,
			ties: 0,
			gamesPlayed: 0,
		},
	});
	const router = useRouter();
	// const userContext = useUser();

	const onLogin = async () => {
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			await getDoc(doc(db, "users", user.uid)).then((docSnap) => {
				if (docSnap.exists()) {
					console.log("Document data:", docSnap.data());
					router.push("/");
				} else {
					// doc.data() will be undefined in this case
					toast.error("User not found. Please sign up.");
				}
			});
			
		} catch (error) {
			toast.error("Error during Google login. Please try again.");
			console.error("Error during Google login:", error);
		}
	}

	const onSignUpSubmit = async () => {
		console.log('submit button clicked');
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const userObj = {
				uid: user.uid,
				displayName: form.getValues("displayName") || user.displayName || "",
				dominionUsername: form.getValues("dominionUsername"),
				email: user.email || "",
				wins: 0,
				ties: 0,
				gamesPlayed: 0
			}
			await setDoc(doc(db, "users", user.uid), userObj);

			router.push("/");
		} catch (error) {
			console.error("Error during Google login:", error);
			toast.error("Error during Google login. Please try again.");
		}
	};

	return (
		<div className="flex flex-col gap-y-4">
		<Button className="align-left" variant="link" onClick={onLogin}>already have an account? login</Button>
		<Form {...form}>
		  <form onSubmit={form.handleSubmit(onSignUpSubmit)} className="space-y-8">
		  <FormField
			  control={form.control}
			  name="displayName"
			  render={({ field }) => (
				<FormItem>
				  <FormLabel>name</FormLabel>
				  <FormControl>
					<Input placeholder="yash" {...field} />
				  </FormControl>
				  <FormMessage />
				</FormItem>
			  )}
			/>
			<FormField
			  control={form.control}
			  name="dominionUsername"
			  render={({ field }) => (
				<FormItem>
				  <FormLabel>dominion.games username*</FormLabel>
				  <FormControl>
					<Input placeholder="rohatgiy" {...field} />
				  </FormControl>
				  <FormMessage />
				</FormItem>
			  )}
			/>
			<Button type="submit">submit</Button>
		  </form>
		</Form>
		</div>
	  )


}

