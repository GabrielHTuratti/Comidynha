import Link from "next/link"
import {
  Badge,
  Check,
  Star,
  Utensils,
  Zap,
  Camera,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  ChefHat,
  Coffee,
  Salad,
  Cookie,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const plans = [
    {
      name: "Gratuito",
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
    },
    {
      name: "Essencial",
      price: "R$ 9,90",
      period: "/mês",
      description: "Para quem quer mais controle sobre sua alimentação",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Tudo do plano Gratuito",
        "Refeições ilimitadas",
        "Planejamento semanal",
        "Relatórios nutricionais",
        "Lista de compras automática",
      ],
      buttonText: "Assinar Essencial",
      buttonVariant: "default" as const,
      popular: true,
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
    },
  ]

  const mealExamples = [
    {
      name: "Salada Caesar com Frango",
      type: "Almoço",
      calories: 420,
      time: "12:30",
      confidence: 95,
      ingredients: ["Frango grelhado", "Alface romana", "Parmesão", "Croutons"],
      icon: <Salad className="h-5 w-5 text-emerald-600" />,
    },
    {
      name: "Aveia com Frutas Vermelhas",
      type: "Café da manhã",
      calories: 280,
      time: "07:15",
      confidence: 92,
      ingredients: ["Aveia", "Morangos", "Mirtilos", "Mel"],
      icon: <Coffee className="h-5 w-5 text-emerald-600" />,
    },
    {
      name: "Smoothie Proteico",
      type: "Lanche",
      calories: 180,
      time: "15:45",
      confidence: 88,
      ingredients: ["Whey protein", "Banana", "Leite de amêndoas"],
      icon: <Cookie className="h-5 w-5 text-emerald-600" />,
    },
  ]

  const aiSteps = [
    {
      step: "1",
      title: "Tire uma Foto",
      description: "Use a câmera do seu celular para fotografar sua refeição",
      icon: <Camera className="h-8 w-8 text-emerald-500" />,
    },
    {
      step: "2",
      title: "IA Analisa",
      description: "Nossa inteligência artificial identifica ingredientes e calcula valores nutricionais",
      icon: <Sparkles className="h-8 w-8 text-emerald-500" />,
    },
    {
      step: "3",
      title: "Confirme e Salve",
      description: "Revise as informações detectadas e salve sua refeição automaticamente",
      icon: <Check className="h-8 w-8 text-emerald-500" />,
    },
  ]

  const stats = [
    { number: "50K+", label: "Refeições Cadastradas", icon: <Utensils className="h-6 w-6" /> },
    { number: "2.5K+", label: "Usuários Ativos", icon: <Users className="h-6 w-6" /> },
    { number: "95%", label: "Precisão da IA", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "30s", label: "Tempo Médio de Cadastro", icon: <Clock className="h-6 w-6" /> },
  ]

  const faqs = [
    {
      question: "Como funciona o reconhecimento por IA?",
      answer:
        "Nossa IA analisa a foto da sua refeição, identifica ingredientes e calcula automaticamente valores nutricionais com 95% de precisão.",
    },
    {
      question: "Posso usar offline?",
      answer:
        "O cadastro manual funciona offline, mas o reconhecimento por IA requer conexão com internet para processar as imagens.",
    },
    {
      question: "Quantas refeições posso cadastrar?",
      answer: "No plano gratuito são 20 refeições/mês. Nos planos pagos, refeições ilimitadas.",
    },
    {
      question: "A IA funciona com qualquer tipo de comida?",
      answer: "Sim! Nossa IA reconhece pratos brasileiros, internacionais, lanches, sobremesas e muito mais.",
    },
  ]

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-emerald-50 to-blue-50 min-h-screen">
      <main className="flex-1 justify-between min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-2 md:px-4 grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 w-fit">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by AI
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Revolucione seu Planejamento Alimentar com IA
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                  Cadastre refeições em segundos apenas tirando uma foto! Nossa IA identifica ingredientes, calcula
                  calorias e cria relatórios nutricionais completos.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8" asChild>
                  <Link href="/auth/customer">
                    <Camera className="mr-2 h-5 w-5" />
                    Começar Grátis
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Grátis para começar
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  IA com 95% de precisão
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Sem cartão de crédito
                </div>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative">
              <div className="relative">
                <img
                  alt="App Preview"
                  className="mx-auto overflow-hidden rounded-2x1 object-cover "
                  height="500"
                  src="meal.svg"
                  width="400"
                />
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-emerald-500">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meal Examples Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Veja Como Suas Refeições Ficam</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nossa IA detecta automaticamente ingredientes e valores nutricionais, criando cards detalhados das suas
                refeições
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {mealExamples.map((meal, index) => (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA {meal.confidence}%
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {meal.icon}
                      <div>
                        <CardTitle className="text-base">{meal.name}</CardTitle>
                        <Badge className="w-fit mt-1">
                          {meal.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-1 mb-2">
                      <ChefHat className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">Ingredientes:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.slice(0, 2).map((ingredient, i) => (
                        <Badge key={i} className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {meal.ingredients.length > 2 && (
                        <Badge className="text-xs">
                          +{meal.ingredients.length - 2} mais
                        </Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">Hoje às {meal.time}</div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">{meal.calories} kcal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Process Section */}
        <section className="w-full py-16 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge className="bg-white/20 text-white mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Exclusivo Planos Avançado & Premium
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Cadastro Inteligente em 3 Passos</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Nossa IA revolucionária torna o cadastro de refeições 10x mais rápido e preciso
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {aiSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
                <Link href="/checkout?plan=avançado">Assinar plano</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Como funciona?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma te ajuda a planejar suas refeições e a montar uma dieta balanceada especialmente para
                  você
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#F9C900"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16 10-4 4-2-2" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">1. Cadastro de Refeições</h3>
                  <p className="text-muted-foreground">
                    Adicione cada refeição informando: nome, descrição, calorias, data/hora e tipo (café da manhã,
                    almoço, lanche ou janta)
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#F36280"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">2. Visualização Organizada</h3>
                  <p className="text-muted-foreground">
                    Dashboard com listagem cronológica de refeições, filtros por tipo de refeição e período,
                    visualização do total de calorias consumidas no dia
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#C971C2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">3. Gestão Completa</h3>
                  <p className="text-muted-foreground">
                    Edição ou exclusão de refeições com um clique, possibilidade de conversão em PDF para praticidades!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">O que nossos usuários dizem</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Milhares de pessoas já transformaram sua alimentação com o comidynha
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Escolha seu plano</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Encontre o plano perfeito para suas necessidades nutricionais
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? "border-[#F36280] shadow-lg scale-105" : ""} ${plan.highlight ? "border-emerald-500 shadow-xl" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#F36280] text-white">
                      Mais Popular
                    </Badge>
                  )}
                  {plan.highlight && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Com IA
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline justify-center gap-1 mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${plan.highlight ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link
                        href={plan.name === "Gratuito" ? "/auth/customer" : `/checkout?plan=${plan.name.toLowerCase()}`}
                      >
                        {plan.buttonText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Perguntas Frequentes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Tire suas dúvidas sobre o comidynha</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full mb-12 rounded-xl py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Pronto para Revolucionar sua Alimentação?
              </h2>
              <p className="text-xl text-white/90">
                Junte-se a milhares de usuários que já transformaram seus hábitos alimentares com nossa IA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8" asChild>
                  <Link href="/auth/customer">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Começar Gratuitamente
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                >
                  Falar com Especialista
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-white/80 mt-8">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sem compromisso
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Cancele quando quiser
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Suporte 24/7
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
