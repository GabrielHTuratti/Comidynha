"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, Clock, Star, Zap, PhoneCall, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

// Interfaces para os tipos de dados
interface Eletricista {
  id: string
  nome: string
  especialidade: string
  avatar: string
  avaliacao: number
  cidade: string
  disponivel: boolean
}

interface Servico {
  id: string
  titulo: string
  descricao: string
  imagem: string
}

interface Pedido {
  id: string
  tipo: string
  descricao: string
  data: string
  status: "agendado" | "confirmado" | "concluido" | "cancelado"
  eletricista?: {
    nome: string
    avatar: string
  }
}

export default function ClienteDashboard() {
  // Dados de exemplo
  const eletricistasPopulares: Eletricista[] = [
    {
      id: "1",
      nome: "Carlos Santos",
      especialidade: "Instalações Residenciais",
      avatar: "/placeholder.svg?height=80&width=80",
      avaliacao: 4.8,
      cidade: "São Paulo, SP",
      disponivel: true
    },
    {
      id: "2",
      nome: "Ana Oliveira",
      especialidade: "Painéis Solares",
      avatar: "/placeholder.svg?height=80&width=80",
      avaliacao: 4.9,
      cidade: "Rio de Janeiro, RJ",
      disponivel: true
    },
    {
      id: "3",
      nome: "Roberto Lima",
      especialidade: "Automação Industrial",
      avatar: "/placeholder.svg?height=80&width=80",
      avaliacao: 4.7,
      cidade: "Belo Horizonte, MG",
      disponivel: false
    },
    {
      id: "4",
      nome: "Juliana Mendes",
      especialidade: "Redes Elétricas",
      avatar: "/placeholder.svg?height=80&width=80",
      avaliacao: 4.5,
      cidade: "Curitiba, PR",
      disponivel: true
    }
  ]

  const servicosPopulares: Servico[] = [
    {
      id: "1",
      titulo: "Instalação de Lâmpadas e Lustres",
      descricao: "Instalação profissional de luminárias em ambientes residenciais",
      imagem: "/placeholder.svg?height=200&width=300"
    },
    {
      id: "2",
      titulo: "Instalação de Ar-Condicionado",
      descricao: "Instalação completa com suporte elétrico para equipamentos de climatização",
      imagem: "/placeholder.svg?height=200&width=300"
    },
    {
      id: "3",
      titulo: "Manutenção de Quadros Elétricos",
      descricao: "Verificação, limpeza e reparo de quadros de distribuição elétrica",
      imagem: "/placeholder.svg?height=200&width=300"
    },
    {
      id: "4",
      titulo: "Projeto e Instalação de Painéis Solares",
      descricao: "Soluções completas para energia solar residencial e comercial",
      imagem: "/placeholder.svg?height=200&width=300"
    }
  ]

  const pedidosRecentes: Pedido[] = [
    {
      id: "1",
      tipo: "Reparo Elétrico",
      descricao: "Conserto de tomadas que não estão funcionando",
      data: "2023-12-15T10:00:00",
      status: "agendado",
      eletricista: {
        nome: "Carlos Santos",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    },
    {
      id: "2",
      tipo: "Instalação",
      descricao: "Instalação de novo ventilador de teto na sala",
      data: "2023-12-10T14:30:00",
      status: "concluido"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo(a), Maria</h1>
        <p className="text-muted-foreground">
          Encontre os melhores eletricistas e solicite serviços elétricos para sua residência, comércio ou indústria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buscar Eletricistas</CardTitle>
            <CardDescription>
              Encontre profissionais qualificados próximos a você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Tipo de serviço..." 
                    className="pl-8" 
                  />
                </div>
                <Select defaultValue="sao-paulo">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sao-paulo">São Paulo</SelectItem>
                    <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                    <SelectItem value="curitiba">Curitiba</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button asChild>
                <Link href="/cliente/encontrar">
                  Buscar eletricistas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Serviço</CardTitle>
            <CardDescription>
              Descreva seu problema e receba orçamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="automotivo">Automotivo</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href="/cliente/solicitar">
                  <Send className="mr-2 h-4 w-4" />
                  Solicitar agora
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pedidos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Populares</TabsTrigger>
          <TabsTrigger value="eletricistas">Eletricistas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pedidos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>
                Acompanhe seus pedidos e solicitações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedidosRecentes.length > 0 ? (
                <div className="space-y-4">
                  {pedidosRecentes.map((pedido) => (
                    <div key={pedido.id} className="flex items-center p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pedido.tipo}</h3>
                          <Badge 
                            variant={
                              pedido.status === "concluido" ? "default" : 
                              pedido.status === "agendado" ? "outline" : 
                              pedido.status === "confirmado" ? "secondary" : "destructive"
                            }
                          >
                            {
                              pedido.status === "agendado" ? "Agendado" : 
                              pedido.status === "confirmado" ? "Confirmado" : 
                              pedido.status === "concluido" ? "Concluído" : "Cancelado"
                            }
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{pedido.descricao}</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(pedido.data).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      {pedido.eletricista && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={pedido.eletricista.avatar} alt={pedido.eletricista.nome} />
                            <AvatarFallback>{pedido.eletricista.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{pedido.eletricista.nome}</span>
                          <Button size="icon" variant="ghost">
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button variant="outline" className="ml-4" asChild>
                        <Link href={`/cliente/pedidos/${pedido.id}`}>
                          Detalhes
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Você ainda não tem pedidos</p>
                  <Button className="mt-4" asChild>
                    <Link href="/cliente/solicitar">
                      Solicitar um serviço
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cliente/pedidos">
                  Ver todos os pedidos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="servicos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Solicitados</CardTitle>
              <CardDescription>
                Conheça os serviços elétricos mais populares em nossa plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselContent>
                  {servicosPopulares.map((servico) => (
                    <CarouselItem key={servico.id} className="md:basis-1/2 lg:basis-1/3">
                      <Card>
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <Image
                            src={servico.imagem || "/placeholder.svg"}
                            alt={servico.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{servico.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button asChild>
                            <Link href={`/cliente/solicitar?servico=${servico.id}`}>
                              Solicitar
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="eletricistas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Eletricistas Recomendados</CardTitle>
              <CardDescription>
                Profissionais com as melhores avaliações de nossa plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {eletricistasPopulares.map((eletricista) => (
                  <Card key={eletricista.id} className="overflow-hidden">
                    <div className="p-6 text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <Image
                          src={eletricista.avatar || "/placeholder.svg"}
                          alt={eletricista.nome}
                          fill
                          className="object-cover rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${eletricista.disponivel ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <h3 className="font-semibold truncate">{eletricista.nome}</h3>
                      <p className="text-sm text-muted-foreground truncate">{eletricista.especialidade}</p>
                      <div className="flex items-center justify-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{eletricista.avaliacao}</span>
                      </div>
                      <div className="flex items-center justify-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {eletricista.cidade}
                      </div>
                    </div>
                    <div className="flex border-t">
                      <Button variant="ghost" className="flex-1 rounded-none py-2 h-10">
                        <Zap className="h-4 w-4 mr-2" />
                        Contratar
                      </Button>
                      <div className="w-px bg-border"></div>
                      <Button variant="ghost" className="flex-1 rounded-none py-2 h-10">
                        Ver perfil
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cliente/encontrar">
                  Ver todos os eletricistas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
