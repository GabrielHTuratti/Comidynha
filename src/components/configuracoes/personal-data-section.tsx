"use client"

import { useState } from "react"
import { User, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { IUser } from "@/model/users"

interface PersonalDataSectionProps {
  user: IUser | null
}

export default function PersonalDataSection({ user }: PersonalDataSectionProps) {
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
  })

  const handleSavePersonalData = async () => {
    setSaving(true)
    try {
      // Validações
      if (!personalData.name.trim()) {
        toast.error("Nome é obrigatório")
        return
      }

      if (!personalData.email.trim()) {
        toast.error("Email é obrigatório")
        return
      }

      if (personalData.newPassword && personalData.newPassword !== personalData.confirmPassword) {
        toast.error("Senhas não coincidem")
        return
      }

      if (personalData.newPassword && personalData.newPassword.length < 6) {
        toast.error("Nova senha deve ter pelo menos 6 caracteres")
        return
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: personalData.name,
          email: personalData.email,
          currentPassword: personalData.currentPassword || undefined,
          newPassword: personalData.newPassword || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao atualizar dados")
      }

      toast.success("Dados pessoais atualizados com sucesso!")

      // Limpar campos de senha
      setPersonalData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao salvar dados pessoais")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar preferências")
      }

      toast.success("Preferências salvas!")
    } catch (error) {
      toast.error("Erro ao salvar preferências: " + error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>Atualize suas informações básicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={personalData.name}
                onChange={(e) => setPersonalData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalData.email}
                onChange={(e) => setPersonalData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Alterar Senha</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={personalData.currentPassword}
                    onChange={(e) => setPersonalData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={personalData.newPassword}
                    onChange={(e) => setPersonalData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={personalData.confirmPassword}
                  onChange={(e) => setPersonalData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirmar nova senha"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePersonalData} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Configure suas preferências de uso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePreferences} disabled={saving} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Preferências"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
