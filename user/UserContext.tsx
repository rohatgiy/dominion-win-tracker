"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
	uid: string;
	displayName: string;
	dominionUsername: string;
	email: string;
	wins: number;
	ties: number;
	gamesPlayed: number;
}

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};