import { auth } from "../firebase-config";
import {
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  User,
  NextFn,
} from "firebase/auth";

export function onAuthStateChanged(cb: NextFn<User | null>) {
  console.log("auth state changed");
  return _onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("No user is logged in");
    }
    cb(user);
  });
}

export function onIdTokenChanged(cb: NextFn<User | null>) {
  return _onIdTokenChanged(auth, cb);
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
