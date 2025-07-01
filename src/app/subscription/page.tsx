"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Bell, Download, Trash2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SubscriptionPage() {
  const [currentPlan] = useState("Avançado")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true,
  })

  const plans = [
    { name: "Gratuito", price: 0, current: false },
    { name: "Essencial", price: 19.9, current: false },
    { name: "Avançado", price: 39.9, current: true },
    { name: "Premium", price: 69.9, current: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para início
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações da Assinatura</h1>
            <p className="text-muted-foreground">Gerencie sua assinatura e preferências</p>
          </div>

          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
              <TabsTrigger value="billing">Cobrança</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-[#F36280]" />
                    Plano Atual
                  </CardTitle>
                  <CardDescription>Você está no plano {currentPlan}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                    <div>
                      <h3 className="font-medium">{currentPlan}</h3>
                      <p className="text-sm text-muted-foreground">R$ 39,90/mês</p>
                    </div>
                    <Badge className="bg-[#F36280] text-white">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Próxima cobrança: 15 de fevereiro de 2025</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alterar Plano</CardTitle>
                  <CardDescription>Faça upgrade ou downgrade do seu plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {plans.map((plan, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${plan.current ? "border-[#F36280] bg-primary/5" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          {plan.current && <Badge className="bg-[#F36280] text-white">Atual</Badge>}
                        </div>
                        <p className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">/mês</p>
                        {!plan.current && (
                          <Button className="w-full mt-3" variant={plan.price > 39.9 ? "default" : "outline"} size="sm">
                            {plan.price > 39.9 ? "Fazer Upgrade" : plan.price === 0 ? "Downgrade" : "Alterar"}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pagamento
                  </CardTitle>
                  <CardDescription>Gerencie suas formas de pagamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">**** **** **** 1234</p>
                        <p className="text-sm text-muted-foreground">Visa • Expira 12/26</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Adicionar Novo Método
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Cobrança</CardTitle>
                  <CardDescription>Suas últimas faturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "15 Jan 2025", amount: "R$ 39,90", status: "Pago" },
                      { date: "15 Dez 2024", amount: "R$ 39,90", status: "Pago" },
                      { date: "15 Nov 2024", amount: "R$ 39,90", status: "Pago" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{invoice.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferências de Notificação
                  </CardTitle>
                  <CardDescription>Configure como você quer receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Receba lembretes no seu dispositivo</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">Resumo semanal das suas refeições</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notifications.weekly}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weekly: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthly-insights">Insights Mensais</Label>
                      <p className="text-sm text-muted-foreground">Análises detalhadas do seu progresso</p>
                    </div>
                    <Switch
                      id="monthly-insights"
                      checked={notifications.monthly}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, monthly: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exportar Dados</CardTitle>
                  <CardDescription>Baixe uma cópia dos seus dados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Exportar Refeições (CSV)
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Exportar Relatórios (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                  <CardDescription>Ações irreversíveis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Cancelar sua assinatura resultará na perda de acesso aos recursos premium. Seus dados serão
                      mantidos por 30 dias.
                    </AlertDescription>
                  </Alert>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Cancelar Assinatura
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
