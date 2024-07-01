import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./AuthContext";
import { DarkModeProvider } from "./DarkModeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dream Deck",
  description: "A dream journal app with AI analysis",
  icons: {
    icon: "/dreamdeck-icon.png",
    apple: "/dreamdeck-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DarkModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
