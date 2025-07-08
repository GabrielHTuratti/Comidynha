"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { authenticate, registrar } from "@/services/v1"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"

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
      const response = await authenticate(loginEmail, loginSenha)
      if (response != 200) {
        throw new Error("Algo de errado não está certo")
      }
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

    try {
      await registrar(registerEmail, registerNome, registerSenha)
      router.push("/main")
    } catch (error) {
      setRegisterError(`Erro de registro: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Área do Cliente</h1>
            <p className="text-muted-foreground mt-2">Faça seu login ou crie uma conta para gerenciar suas refeições</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Entre com seu email e senha ou use o Google.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Botão do Google */}
                  <GoogleSignInButton />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
                    </div>
                  </div>

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
                  <CardDescription>Crie uma nova conta rapidamente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Botão do Google */}
                  <GoogleSignInButton />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Ou registre-se com email</span>
                    </div>
                  </div>

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
    </div>
  )
}
