"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Utensils, User, Settings, CreditCard, LogOut, Crown, TrendingUp, Bell } from "lucide-react"
import { logout } from "@/services/v1"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const { user, isLoading, clearUser } = useAuth()

  const handleLogout = async () => {
    try {
      clearUser() // Limpa o estado imediatamente para UX
      await logout()
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "avançado":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "essencial":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-500"
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "avançado":
        return <Crown className="h-3 w-3" />
      case "essencial":
        return <TrendingUp className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  return (
    <header className="border-b bg-gradient-to-r from-[#F36280] to-[#ff7ba7] text-white sticky top-0 z-50 shadow-lg">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-center py-3 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm font-medium">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="relative">
              <Bell className="h-4 w-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <span className="font-semibold">VERSÃO BETA</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="text-center">
            <strong>Aviso:</strong> Este é um teste gratuito demonstrativo - todos os dados serão perdidos no lançamento
            oficial
          </span>
        </div>
      </div>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-bold hover:opacity-90 transition-all duration-200 hover:scale-105"
        >
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Utensils className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="hidden sm:block">comidynha</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            // Enhanced loading state
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
              <div className="hidden sm:block w-20 h-4 bg-white/20 rounded animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Button size="icon" variant="ghost" className="relative text-white hover:bg-white/20 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-all duration-200 hover:scale-105">
                    <Avatar className="h-10 w-10 ring-2 ring-white/30 hover:ring-white/50 transition-all">
                      <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-cyan-400 text-white font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-white/90 max-w-32 truncate">{user.name}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs text-white border-0 ${getPlanColor(user.plan || "basico")} px-2 py-0.5`}
                      >
                        <span className="flex items-center gap-1">
                          {getPlanIcon(user.plan || "basico")}
                          {user.plan || "Básico"}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-72 p-0 shadow-xl border-0 bg-white/95 backdrop-blur-md"
                  align="end"
                  forceMount
                >
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-r from-[#F36280] to-[#ff7ba7] text-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-white/50">
                        <AvatarImage
                          src={user.photoURL || "/placeholder.svg"}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-white/20 text-white font-semibold text-lg">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{user.name}</h3>
                        <p className="text-sm text-white/80 truncate">{user.email}</p>
                        <Badge
                          variant="secondary"
                          className={`mt-1 text-xs text-white border-0 ${getPlanColor(user.plan || "basico")}`}
                        >
                          <span className="flex items-center gap-1">
                            {getPlanIcon(user.plan || "basico")}
                            Plano {user.plan || "Básico"}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownMenuLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2">
                      Navegação
                    </DropdownMenuLabel>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-md hover:bg-gray-50 transition-colors">
                      <Link href="/main" className="flex items-center gap-3 px-3 py-2">
                        <div className="p-1.5 bg-blue-100 rounded-md">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium">Meu Perfil</span>
                          <p className="text-xs text-gray-500">Visualizar dashboard</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer rounded-md hover:bg-gray-50 transition-colors">
                      <Link href="/subscription" className="flex items-center gap-3 px-3 py-2">
                        <div className="p-1.5 bg-purple-100 rounded-md">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium">Assinatura</span>
                          <p className="text-xs text-gray-500">Gerenciar plano</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer rounded-md hover:bg-gray-50 transition-colors">
                      <Link href="/configuracoes" className="flex items-center gap-3 px-3 py-2 w-full">
                        <div className="bg-gray-100 rounded-md">
                          <Settings className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-medium">Configurações</span>
                          <p className="text-xs text-gray-500">Preferências da conta</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem className="p-0 rounded-md overflow-hidden">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <div className="p-1.5 bg-red-100 rounded-md">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium">Sair da conta</span>
                          <p className="text-xs text-red-500">Fazer logout</p>
                        </div>
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-white text-[#F36280] hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Link href="/auth/customer">Começar Agora</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
