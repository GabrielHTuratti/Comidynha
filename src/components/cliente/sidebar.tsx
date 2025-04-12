"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ClipboardList, Send, Home, Bell, Settings, HelpCircle, LogOut, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: number
}

export function SidebarCliente() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/cliente",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Encontrar Eletricistas",
      href: "/cliente/encontrar",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Meus Pedidos",
      href: "/cliente/pedidos",
      icon: <ClipboardList className="h-5 w-5" />,
      badge: 2
    },
    {
      title: "Solicitar Serviço",
      href: "/cliente/solicitar",
      icon: <Send className="h-5 w-5" />,
    },
    {
      title: "Notificações",
      href: "/cliente/notificacoes",
      icon: <Bell className="h-5 w-5" />,
      badge: 3
    },
    {
      title: "Configurações",
      href: "/cliente/configuracoes",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Ajuda",
      href: "/cliente/ajuda",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 font-semibold text-xl">
                <div className="bg-primary text-primary-foreground p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                ElectriConnect
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border-b">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Foto do perfil" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Maria Costa</p>
                <p className="text-xs text-muted-foreground">cliente@exemplo.com</p>
              </div>
            </div>
            
            <nav className="flex-1 overflow-auto py-6">
              <ul className="grid gap-2 px-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                        pathname === item.href
                          ? "bg-muted font-medium text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.icon}
                      {item.title}
                      {item.badge && (
                        <Badge className="ml-auto">{item.badge}</Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto border-t p-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col border-r w-64 bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="bg-primary text-primary-foreground p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            ElectriConnect
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 border-b">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Foto do perfil" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Maria Costa</p>
            <p className="text-xs text-muted-foreground">cliente@exemplo.com</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-auto py-6">
          <ul className="grid gap-2 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    pathname === item.href
                      ? "bg-muted font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                  {item.badge && (
                    <Badge className="ml-auto">{item.badge}</Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
