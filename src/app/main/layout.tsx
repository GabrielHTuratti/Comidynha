import type React from "react"
import { Utensils } from "lucide-react"
import Link from "next/link"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-[#b4436c] text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/main" className="flex items-center gap-2">
              <Utensils className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">Comidynha</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
