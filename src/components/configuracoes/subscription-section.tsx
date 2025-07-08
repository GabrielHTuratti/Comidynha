"use client"

import { useEffect, useState } from "react"
import { Crown, Utensils, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { IUser } from "@/model/users"
import { getProfile } from "@/services/v1"

export default function SubscriptionSection() {
  const [loading, setLoading] = useState(false)
  const [usuario, setUsuario] = useState<IUser>();

  useEffect(() => {
    const loadUsuario = async () => {
      const user = await getProfile()
      setUsuario(user)
    }
    loadUsuario()
  })

  const plans = [
    {
      name: "Basico",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar seu planejamento alimentar",
      icon: <Utensils className="h-6 w-6" />,
      features: [
        "Cadastro de refeições básico",
        "Visualização cronológica",
        "Cálculo de calorias diárias",
        "Até 20 refeições por mês",
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false,
      planKey: "Basico",
    },
    {
      name: "Essencial",
      price: "R$ 9,90",
      period: "/mês",
      description: "Para quem quer mais controle sobre sua alimentação",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Tudo do plano Basico",
        "Refeições ilimitadas",
        "Planejamento semanal",
        "Relatórios nutricionais",
        "Lista de compras automática",
      ],
      buttonText: "Assinar Essencial",
      buttonVariant: "default" as const,
      popular: true,
      planKey: "Essencial",
    },
    {
      name: "Avançado",
      price: "R$ 14,90",
      period: "/mês",
      description: "Ideal para quem busca resultados profissionais",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Tudo do plano Essencial",
        "🤖 Receitas sugeridas por IA",
        "📊 Análise nutricional avançada",
        "🎯 Metas personalizadas",
        "📸 IA para identificação automática",
        "🔔 Notificações inteligentes",
        "⭐ Suporte prioritário",
      ],
      buttonText: "Assinar Avançado",
      buttonVariant: "default" as const,
      popular: false,
      highlight: true,
      planKey: "Avancado",
    },
  ]

  const getCurrentPlan = () => {
    const userPlan = usuario?.plan

    return userPlan
  }

  const currentPlan = getCurrentPlan()

  const handlePlanChange = async (planKey: string) => {
    if (planKey === currentPlan) return

    setLoading(true)
    try {
      if (planKey === "Basico") {
        // Downgrade para Basico
        const response = await fetch("/api/subscription/cancel", {
          method: "POST",
        })

        if (!response.ok) {
          throw new Error("Erro ao cancelar assinatura")
        }

        toast.success("Plano alterado para Basico")
      } else {
        // Upgrade ou mudança de plano pago
        const response = await fetch("/api/subscription/change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: planKey }),
        })

        if (!response.ok) {
          throw new Error("Erro ao alterar plano")
        }

        const data = await response.json()

        if (data.checkoutUrl) {
          // Redirecionar para checkout
          window.location.href = data.checkoutUrl
        } else {
          toast.success(`Plano alterado para ${planKey}`)
        }
      }
    } catch (error) {
      console.error("Erro ao alterar plano:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao alterar plano")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
              <p className="text-sm text-muted-foreground">
                {currentPlan === "Basico" ? "Basico" : currentPlan === "Essencial" ? "R$ 9,90/mês" : "R$ 14,90/mês"}
              </p>
            </div>
            <Badge className="bg-[#F36280] text-white">Ativo</Badge>
          </div>
          {currentPlan === "Basico" && (
            <p className="text-sm text-muted-foreground mt-4">Faça upgrade para desbloquear recursos premium</p>
          )}
          {currentPlan !== "Basico" && (
            <p className="text-sm text-muted-foreground mt-4">Próxima cobrança: 15 de março de 2025</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>Escolha o plano que melhor se adapta às suas necessidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan, index) => {
              const isCurrent = plan.planKey === currentPlan
              const isUpgrade = plans.findIndex((p) => p.planKey === currentPlan) < index
              const isDowngrade = plans.findIndex((p) => p.planKey === currentPlan) > index

              return (
                <div
                  key={index}
                  className={`relative p-4 border rounded-lg ${
                    isCurrent ? "border-[#F36280] bg-primary/5" : ""
                  } ${plan.highlight ? "border-2 border-[#F36280]" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#F36280] text-white">Mais Popular</Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {plan.icon}
                      <h4 className="font-medium">{plan.name}</h4>
                    </div>
                    {isCurrent && <Badge className="bg-[#F36280] text-white">Atual</Badge>}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-1 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {feature}
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      size="sm"
                      onClick={() => handlePlanChange(plan.planKey)}
                      disabled={loading}
                    >
                      {loading
                        ? "Processando..."
                        : isUpgrade
                          ? "Fazer Upgrade"
                          : isDowngrade
                            ? "Downgrade"
                            : plan.buttonText}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
