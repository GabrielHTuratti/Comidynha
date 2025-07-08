"use client"

import { useState } from "react"
import { Shield, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function PrivacySection() {
  const [saving, setSaving] = useState(false)
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    shareData: false,
    analytics: true,
    marketing: false,
  })

  const handleSavePrivacy = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacy),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar configurações de privacidade")
      }

      toast.success("Configurações de privacidade salvas!")
    } catch (error) {
      toast.error("Erro ao salvar configurações de privacidade: " + error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configurações de Privacidade
        </CardTitle>
        <CardDescription>Controle como seus dados são utilizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="profile-public">Perfil Público</Label>
            <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
          </div>
          <Switch
            id="profile-public"
            checked={privacy.profilePublic}
            onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, profilePublic: checked }))}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="share-data">Compartilhar Dados</Label>
            <p className="text-sm text-muted-foreground">Permitir compartilhamento de dados para melhorar o serviço</p>
          </div>
          <Switch
            id="share-data"
            checked={privacy.shareData}
            onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, shareData: checked }))}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="analytics">Analytics</Label>
            <p className="text-sm text-muted-foreground">Permitir coleta de dados de uso para analytics</p>
          </div>
          <Switch
            id="analytics"
            checked={privacy.analytics}
            onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, analytics: checked }))}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing">Marketing</Label>
            <p className="text-sm text-muted-foreground">Receber comunicações de marketing</p>
          </div>
          <Switch
            id="marketing"
            checked={privacy.marketing}
            onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, marketing: checked }))}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSavePrivacy} disabled={saving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Privacidade"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
