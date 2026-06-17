import type { Metadata } from "next";
import { Architects_Daughter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const user = {
  name: "Mohit Singh",
  initials: "MS",
};

// for session provider
import { auth } from "../auth";
import SessionProvider from "@/components/sessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const architectsDaughter = Architects_Daughter({
  variable: "--font-architects-daughter",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Scout - Portfolio uptime monitoring",
  description:
    "A unified uptime dashboard for portfolio projects spread across Vercel, Render, Railway, and Neon.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${architectsDaughter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div>
          <SessionProvider session={session}>
            <Navbar user={user} />
            {children}
          </SessionProvider>
        </div>

      </body>
    </html>
  );
}
