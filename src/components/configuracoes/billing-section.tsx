"use client"

import { useState } from "react"
import { CreditCard, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function BillingSection() {
  const [loading, setLoading] = useState(false)

  const handleAddPaymentMethod = async () => {
    setLoading(true)
    try {
      // Aqui você faria a integração com o gateway de pagamento
      toast.success("Redirecionando para adicionar método de pagamento...")
    } catch (error) {
      toast.error("Erro ao adicionar método de pagamento: " + error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/billing/invoice/${invoiceId}/download`)
      if (!response.ok) throw new Error("Erro ao baixar fatura")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fatura-${invoiceId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Fatura baixada com sucesso!")
    } catch (error) {
      toast.error("Erro ao baixar fatura: " + error)
    }
  }

  return (
    <div className="space-y-6">
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
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleAddPaymentMethod}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Adicionar Novo Método"}
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
              { id: "inv_001", date: "15 Jan 2025", amount: "R$ 14,90", status: "Pago" },
              { id: "inv_002", date: "15 Dez 2024", amount: "R$ 14,90", status: "Pago" },
              { id: "inv_003", date: "15 Nov 2024", amount: "R$ 9,90", status: "Pago" },
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
