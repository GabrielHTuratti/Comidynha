"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const plans = {
    essencial: {
      name: "Essencial",
      price: 9.99,
      features: [
        "Refeições ilimitadas",
        "Planejamento semanal",
        "Relatórios nutricionais",
        "Lista de compras automática",
        "Backup na nuvem",
      ],
    },
    avancado: {
      name: "Avançado",
      price: 14.9,
      features: [
        "Tudo do Essencial",
        "Receitas sugeridas por IA",
        "Análise nutricional avançada",
        "Metas personalizadas",
        "Exportação PDF/Excel",
        "Suporte prioritário",
      ],
    },
    premium: {
      name: "Premium",
      price: 30,
      features: [
        "Tudo do Avançado",
        "Planejamento mensal",
        "Análise de tendências",
        "Integração wearables",
        "Consultoria nutricional",
        "API para integrações",
        "Suporte 24/7",
      ],
    },
  }

  useEffect(() => {
    if (planParam && plans[planParam as keyof typeof plans]) {
      setSelectedPlan(planParam)
    } else {
      setSelectedPlan("essencial")
    }
  }, [planParam])

  const currentPlan = plans[selectedPlan as keyof typeof plans]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica de pagamento
    alert("Redirecionando para processamento do pagamento...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para início
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
              <CardDescription>Confirme os detalhes da sua assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Plano Selecionado</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  {Object.entries(plans).map(([key, plan]) => (
                    <div key={key} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={key} id={key} />
                      <div className="flex-1">
                        <Label htmlFor={key} className="font-medium">
                          {plan.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">R$ {plan.price.toFixed(2)}/mês</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Recursos inclusos:</h4>
                <ul className="space-y-1">
                  {currentPlan?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-medium">
                <span>Total mensal:</span>
                <span className="text-lg">R$ {currentPlan?.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Pagamento
              </CardTitle>
              <CardDescription>Seus dados estão seguros conosco</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" placeholder="João" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" placeholder="Silva" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="joao@exemplo.com" required />
                </div>

                <div className="space-y-2">
                  <Label>Método de Pagamento</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Cartão de Crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix">PIX</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "credit-card" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Seus dados estão protegidos com criptografia SSL
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#F36280] hover:bg-[#F36280]/90" onClick={handleSubmit}>
                Finalizar Assinatura - R$ {currentPlan?.price.toFixed(2)}/mês
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
