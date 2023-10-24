"use client"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import AppBar from "./AppBar";

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Fetch data json',
//   description: 'Fetch data json',
// }

interface IProps {
  children: ReactNode;
}
export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className={"  h-screen "}>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
