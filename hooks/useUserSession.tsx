import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { useUser } from "@/user/UserContext";

export function useUserSession() {
    const userContext = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);

                // Listen for real-time updates to the user's document
                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        userContext.setUser({
                            uid: user.uid,
                            displayName: docSnapshot.data().displayName,
							dominionUsername: docSnapshot.data().dominionUsername,
							wins: docSnapshot.data().wins,
							ties: docSnapshot.data().ties,
							gamesPlayed: docSnapshot.data().gamesPlayed,
							email: user.email || "",
                        });
                    } else {
                        console.error("User document does not exist.");
                        userContext.setUser(null);
                    }
                    setLoading(false);
                });

                // Cleanup the Firestore listener
                return () => unsubscribeSnapshot();
            } else {
                userContext.setUser(null);
                setLoading(false);
            }
        });

        // Cleanup the Auth listener
        return () => unsubscribeAuth();
    }, [userContext]);

    return loading;
}