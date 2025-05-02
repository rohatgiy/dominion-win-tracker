"use client";

import { useUserSession } from "@/hooks/useUserSession";

export function UserSessionInitializer() {
    useUserSession();
    return null;
}