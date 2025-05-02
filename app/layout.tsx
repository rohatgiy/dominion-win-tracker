import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { UserProvider } from "@/user/UserContext";
import { useUserSession } from "@/hooks/useUserSession";
import { UserSessionInitializer } from "@/components/UserSesssionInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dowinion",
  description: "Dominion win tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
		<UserProvider>
			<UserSessionInitializer />
			<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
				<Header />
				<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
					{children}
				</main>
				<Footer />
				<Toaster />
			</div>
		</UserProvider>
      </body>
    </html>
  );
}
