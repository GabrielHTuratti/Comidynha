"use client"

import { useState } from "react"
import { Bell, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function NotificationsSection() {
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true,
    mealReminders: true,
  })

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar configurações de notificação")
      }

      toast.success("Configurações de notificação salvas!")
    } catch (error) {
      toast.error("Erro ao salvar configurações de notificação: " + error)
    } finally {
      setSaving(false)
    }
  }

  return (
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
            <Label htmlFor="meal-reminders">Lembretes de Refeição</Label>
            <p className="text-sm text-muted-foreground">Receba lembretes para registrar suas refeições</p>
          </div>
          <Switch
            id="meal-reminders"
            checked={notifications.mealReminders}
            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mealReminders: checked }))}
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

        <div className="flex justify-end">
          <Button onClick={handleSaveNotifications} disabled={saving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Notificações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
