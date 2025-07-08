# 🍽️ Comidynha - Gestão Inteligente de Refeições

> **⚠️ VERSÃO DEMO** - Este é um projeto demonstrativo das funcionalidades do sistema Comidynha.

## 📋 Sobre o Projeto

Comidynha é uma aplicação web inteligente para gestão e análise nutricional de refeições, utilizando tecnologias de IA para reconhecimento de ingredientes através de imagens e fornecendo insights personalizados sobre hábitos alimentares.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login/Registro tradicional com email e senha
- Autenticação via Google OAuth
- Sistema de refresh tokens para sessões seguras
- Middleware de proteção de rotas

### 🍕 Gestão Inteligente de Refeições
- **Detecção por Câmera**: Capture fotos de refeições e obtenha análise automática
- **Upload de Imagens**: Envie fotos existentes para análise
- **CRUD Completo**: Criar, editar, visualizar e excluir refeições
- **Categorização Automática**: Classificação inteligente por tipo de refeição
- **Análise Nutricional**: Cálculo automático de calorias, proteínas, carboidratos e gorduras

### 🥬 Sistema de Ingredientes
- **Detecção Visual**: IA identifica ingredientes em imagens
- **Banco de Dados Nutricional**: Informações completas sobre valores nutricionais
- **Gestão de Estoque**: Controle de ingredientes disponíveis

### 🏪 Depósitos Inteligentes
- **Gestão de Estoque**: Organize ingredientes por local de armazenamento
- **Sugestões de IA**: Recomendações baseadas em ingredientes disponíveis
- **Controle de Validade**: Alertas para ingredientes próximos ao vencimento
- **Otimização de Compras**: Sugestões de compras baseadas no consumo

### 📊 Analytics e Relatórios
- **Dashboard Nutricional**: Visão geral do consumo diário/semanal/mensal
- **Gráficos Interativos**: Tendências de consumo e progresso de metas
- **Relatórios Personalizados**: Análises detalhadas por período
- **Metas Nutricionais**: Definição e acompanhamento de objetivos

### 📱 Experiência do Usuário
- **Design Responsivo**: Funciona perfeitamente em mobile e desktop
- **Interface Intuitiva**: UI/UX otimizada com Tailwind CSS e shadcn/ui
- **Modo Escuro**: Suporte completo a temas claro e escuro
- **Feedback em Tempo Real**: Notificações e loading states

### ⚙️ Configurações Avançadas
- **Perfil Personalizado**: Dados pessoais, preferências alimentares
- **Notificações**: Controle de alertas e lembretes
- **Privacidade**: Configurações de dados e exportação
- **Assinatura**: Sistema de planos e billing

### 📄 Exportação e Relatórios
- **Exportação PDF**: Relatórios nutricionais detalhados
- **Backup de Dados**: Exportação completa dos dados do usuário
- **Histórico Completo**: Acesso a todo histórico de refeições

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos

### Backend & Database
- **Next.js API Routes** - Backend serverless
- **MongoDB** - Banco de dados NoSQL
- **Firebase** - Autenticação e storage

### IA e Machine Learning
- **Google Gemini AI** - Análise de imagens e texto
- **Gemini Vision** - Reconhecimento de ingredientes
- **IA Generativa** - Sugestões personalizadas

### Autenticação & Segurança
- **JWT** - Tokens de autenticação
- **Google OAuth** - Login social
- **Middleware** - Proteção de rotas
- **Criptografia** - Dados sensíveis protegidos

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB
- Conta Google Cloud (para Gemini AI)
- Projeto Firebase

### Variáveis de Ambiente
```env
# JWT & Auth
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN=your_refresh_token
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSASING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Services
GEMINI_API_KEY=your_gemini_api_key
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/comidynha.git

# Instale as dependências
cd comidynha
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o projeto
npm run dev
```

## 📱 Como Usar

### 1. Cadastro e Login
- Acesse a aplicação e crie uma conta
- Ou faça login com sua conta Google

### 2. Primeira Refeição
- Clique em "Adicionar Refeição"
- Escolha entre tirar foto ou fazer upload
- A IA analisará automaticamente os ingredientes

### 3. Gestão de Depósitos
- Configure seus locais de armazenamento
- Adicione ingredientes disponíveis
- Receba sugestões personalizadas

### 4. Acompanhamento
- Visualize seus dados no dashboard
- Defina metas nutricionais
- Exporte relatórios em PDF

## 🎯 Funcionalidades em Destaque

### 🤖 IA Integrada
- **Reconhecimento Visual**: Identifica automaticamente ingredientes e porções
- **Análise Nutricional**: Cálculos precisos baseados em IA
- **Sugestões Personalizadas**: Recomendações baseadas em histórico e preferências

### 📊 Analytics Avançados
- **Tendências**: Visualize padrões alimentares ao longo do tempo
- **Metas**: Defina e acompanhe objetivos nutricionais
- **Insights**: Receba dicas personalizadas para melhorar a alimentação

### 🔄 Sincronização em Tempo Real
- **Multi-dispositivo**: Acesse seus dados em qualquer lugar
- **Backup Automático**: Dados sempre seguros na nuvem
- **Offline First**: Funciona mesmo sem conexão

## 🚧 Status do Projeto

**VERSÃO DEMO** - Funcionalidades implementadas:
- ✅ Sistema de autenticação completo
- ✅ Detecção de ingredientes por IA
- ✅ CRUD de refeições
- ✅ Sistema de depósitos
- ✅ Analytics básicos
- ✅ Exportação PDF
- ✅ Interface responsiva

**Próximas Funcionalidades:**
- 🔄 Sistema de notificações push
- 🔄 Integração com wearables
- 🔄 Modo offline completo
- 🔄 API pública
- 🔄 App mobile nativo

## 🤝 Contribuição

Este é um projeto demonstrativo. Para sugestões ou melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto é uma demonstração e está sob licença MIT.

## 📞 Contato

Para dúvidas sobre este projeto demo:
- Email: contato@comidynha.com
- Website: https://comidynha.vercel.app

---

**⚠️ Aviso**: Esta é uma versão demonstrativa do sistema Comidynha. Algumas funcionalidades podem estar limitadas ou em desenvolvimento.
