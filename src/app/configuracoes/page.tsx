"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, CreditCard, Bell, Shield, Download, Crown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProfile } from "@/services/v1"
import type { IUser } from "@/model/users"

// Importar os componentes modulares
import PersonalDataSection from "@/components/configuracoes/personal-data-section"
import SubscriptionSection from "@/components/configuracoes/subscription-section"
import BillingSection from "@/components/configuracoes/billing-section"
import NotificationsSection from "@/components/configuracoes/notification-section"
import PrivacySection from "@/components/configuracoes/privacy-section"
import DataSection from "@/components/configuracoes/data-section"

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await getProfile()
        setUser(profile)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/main" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Pessoal</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Plano</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Cobrança</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacidade</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Dados</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalDataSection user={user} />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionSection />
            </TabsContent>

            <TabsContent value="billing">
              <BillingSection />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsSection />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySection />
            </TabsContent>

            <TabsContent value="data">
              <DataSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
