"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/user/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { onAuthStateChanged } from "@/firebase/auth/auth";

export function useUserSession() {
    const userContext = useUser();
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                    userContext.setUser({
                        uid: docSnap.data().uid || user.uid,
                        displayName: docSnap.data().displayName,
                        dominionUsername: docSnap.data().dominionUsername,
                        email: docSnap.data().email || user.email || "",
                        wins: docSnap.data().wins,
                        ties: docSnap.data().ties,
                        gamesPlayed: docSnap.data().gamesPlayed,
                    });
                }
            } else {
                userContext.setUser(null);
            }
			setLoading(false);
        });

        return () => unsubscribe();
    }, []);

	return loading;
}