import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "../context/SessionContext";
import RouteGuard from "../components/RouteGuard";
import GlobalLogout from "../components/GlobalLogout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Game Genesis Challenge",
  description: "Escape the Oblivion Protocol",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <GlobalLogout />
          <RouteGuard>{children}</RouteGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
