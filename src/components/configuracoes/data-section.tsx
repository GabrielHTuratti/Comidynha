"use client"

import { useState } from "react"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function DataSection() {
  const [loading, setLoading] = useState(false)

  const handleExportData = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/export?type=${type}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro ao exportar dados")
      }

      const data = await response.json()

      if (data.downloadUrl) {
        // Download direto
        window.open(data.downloadUrl, "_blank")
        toast.success("Download iniciado!")
      } else {
        // Envio por email
        toast.success("Exportação iniciada! Você receberá um email quando estiver pronta.")
      }
    } catch (error) {
      toast.error("Erro ao exportar dados: " + error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt('Para confirmar a exclusão da sua conta, digite "EXCLUIR" (em maiúsculas):')

    if (confirmation !== "EXCLUIR") {
      toast.error("Confirmação incorreta. Conta não foi excluída.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir conta")
      }

      toast.success("Conta excluída com sucesso")
      // Redirecionar para página de login após um delay
      setTimeout(() => {
        window.location.href = "/auth/customer"
      }, 2000)
    } catch (error) {
      toast.error("Erro ao excluir conta: " + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
          <CardDescription>Baixe uma cópia dos seus dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExportData("meals")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Exportar Refeições (CSV)
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExportData("reports")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Exportar Relatórios (PDF)
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExportData("all")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Exportar Todos os Dados (JSON)
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => handleExportData("settings")}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Exportar Configurações
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
              Excluir sua conta resultará na perda permanente de todos os seus dados. Esta ação não pode ser desfeita.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
            {loading ? "Excluindo..." : "Excluir Conta Permanentemente"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
