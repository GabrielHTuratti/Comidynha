"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Utensils } from "lucide-react"
import { authenticate, registrar } from "@/services/v1"

export default function CustomerAuthPage() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginSenha, setLoginSenha] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const [registerNome, setRegisterNome] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerSenha, setRegisterSenha] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isRegisterLoading, setRegisterLoading] = useState(false)

  const router = useRouter()

  const loginHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoginLoading(true)
    try {
      await authenticate(loginEmail, loginSenha);
      router.push("/main")
    } catch (error) {
      setLoginError(`Erro de autenticação: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoginLoading(false)
    }
  }

  const registerHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setRegisterLoading(true)

    const registrationData = {
      email: registerEmail,
      name: registerNome,
      password: registerSenha
    }

    try {
      await registrar(registrationData);
      router.push("/main")
    } catch (error) {
      setRegisterError(`Erro de registro: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-[#F36280] text-white">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Utensils className="h-6 w-6 text-emerald-500" />
            <span>Comidynha</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Como Funciona
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Área do Cliente</h1>
            <p className="text-muted-foreground mt-2">Faça seu login ou crie uma conta para gerenciar suas refeições</p>
          </div>

          <Tabs defaultValue="login" className="w-full ">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger  value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Entre seu email e senha.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginHandleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-senha">Senha</Label>
                      <Input
                        id="login-senha"
                        type="password"
                        placeholder="Sua senha"
                        value={loginSenha}
                        onChange={(e) => setLoginSenha(e.target.value)}
                        required
                      />
                    </div>

                    {loginError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-[#007f5f]" disabled={isLoginLoading}>
                      {isLoginLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Registrar</CardTitle>
                  <CardDescription>Crie uma nova conta.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerHandleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-nome">Nome</Label>
                      <Input
                        id="register-nome"
                        type="text"
                        placeholder="Seu nome"
                        value={registerNome}
                        onChange={(e) => setRegisterNome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-senha">Senha</Label>
                      <Input
                        id="register-senha"
                        type="password"
                        placeholder="Sua senha"
                        value={registerSenha}
                        onChange={(e) => setRegisterSenha(e.target.value)}
                        required
                      />
                    </div>

                    {registerError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-[#007f5f]" disabled={isRegisterLoading}>
                      {isRegisterLoading ? "Registrando..." : "Registrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t mt-auto bg-[#b4436c] text-white">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex pl-4 items-center gap-2">
            <Utensils className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-semibold">Comydinha</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              © 2025 Comydinha. Todos os direitos reservados.
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

