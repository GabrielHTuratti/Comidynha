import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "(D) Comidynha 🥗",
  description: "Gerencie suas refeições!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  )
}
