# 🚀 Zentra - Organize seu tempo, clientes e tarefas.

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cursor%20AI-Powered-purple?style=for-the-badge" alt="Cursor AI" />
</div>

<p align="center">
  <strong>Uma plataforma moderna de gerenciamento de projetos e tarefas, desenvolvida com Next.js 15 e Firebase.</strong>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-uso">Uso</a> •
  <a href="#-estrutura">Estrutura</a>
</p>

---

## 📋 Sobre

O **Zentra** é uma central completa para organização pessoal e profissional. Desenvolvido com foco na simplicidade e produtividade, oferece todas as ferramentas necessárias para gerenciar projetos, tarefas e equipes em um só lugar.

> 💡 **Desenvolvido com Cursor AI** - Este projeto foi criado utilizando o poder da IA do Cursor para acelerar o desenvolvimento e garantir código de qualidade.

## ✨ Funcionalidades

### 🔐 **Autenticação Completa**
- Login/Registro com email e senha
- Autenticação via Google
- Validação em tempo real de formulários
- Proteção de rotas automática

### 📊 **Dashboard Inteligente**
- Estatísticas em tempo real (projetos, tarefas, membros)
- Feed de atividades da equipe
- Ações rápidas para criação de projetos e tarefas
- Interface responsiva e moderna

### 🗂️ **Gerenciamento de Projetos**
- Criação de projetos com detalhes completos
- Sistema de filtros (Todos, Ativos, Concluídos)
- Visualização de estatísticas por projeto
- Integração automática com sistema de tarefas

### ✅ **Sistema de Tarefas**
- Tarefas vinculadas a projetos específicos
- Status e prioridades personalizáveis
- Edição e visualização de detalhes
- Contadores automáticos no dashboard

### 👥 **Colaboração**
- Sistema de membros por projeto
- Atividades da equipe em tempo real
- Atribuição de tarefas para usuários
- Histórico de ações dos membros

### 🎨 **Interface Moderna**
- Design system consistente
- Modo claro otimizado (white + purple)
- Componentes reutilizáveis
- Animações e transições suaves
- Layout responsivo (mobile-first)

## 🛠️ Tecnologias

### **Frontend**
- **Next.js 15** - Framework React com App Router
- **React 18** - Biblioteca para interfaces
- **Tailwind CSS 3.4** - Estilização utility-first
- **Lucide React** - Ícones modernos

### **Backend & Database**
- **Firebase Authentication** - Autenticação segura
- **Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Security Rules** - Proteção de dados

### **Desenvolvimento**
- **TypeScript** - Tipagem estática (configurado)
- **ESLint** - Linting de código
- **Turbopack** - Build tool ultrarrápido
- **Cursor AI** - Assistente de desenvolvimento

### **Arquitetura**
- **Component-Driven Development** - Componentes reutilizáveis
- **Barrel Exports** - Importações organizadas
- **Custom Hooks** - Lógica reutilizável
- **Context API** - Gerenciamento de estado global

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta no Firebase

### **1. Clone o repositório**
```bash
git clone https://github.com/ojeanrodriguesdev/zentra.git
cd zentra
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure o Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication (Email/Password e Google)
3. Crie um banco Firestore
4. Copie as credenciais do Firebase

### **4. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### **5. Configure as regras do Firestore**
No Firebase Console, vá em Firestore > Rules e adicione:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **6. Execute o projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 💻 Uso

### **1. Criar Conta**
- Acesse `/register` para criar uma nova conta
- Preencha os dados ou use login com Google
- Dados iniciais são criados automaticamente

### **2. Gerenciar Projetos**
- No dashboard, clique em "Novo Projeto"
- Preencha os detalhes do projeto
- Visualize e filtre projetos em `/projects`

### **3. Organizar Tarefas**
- Crie tarefas dentro de projetos específicos
- Defina prioridades e status
- Acompanhe o progresso no dashboard

### **4. Colaborar**
- Convide membros para projetos
- Acompanhe atividades da equipe
- Atribua tarefas para colaboradores

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── globals.css        # Estilos globais
│   ├── layout.jsx         # Layout principal
│   └── */page.jsx         # Páginas da aplicação
├── components/            # Componentes reutilizáveis
│   ├── features/          # Componentes específicos
│   ├── layout/            # Componentes de layout
│   ├── providers/         # Context providers
│   ├── sections/          # Seções de páginas
│   ├── shared/            # Componentes compartilhados
│   └── ui/                # Componentes de interface
├── lib/                   # Bibliotecas e utilitários
│   ├── firebase.js        # Configuração do Firebase
│   ├── firestore/         # Operações do Firestore
│   └── hooks/             # Custom hooks
├── views/                 # Componentes de página
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── home/              # Página inicial
│   └── projects/          # Gerenciamento de projetos
└── styles/                # Estilos adicionais
```

## 🎯 Funcionalidades Avançadas

### **🔄 Estado em Tempo Real**
- Sincronização automática com Firestore
- Atualizações instantâneas entre usuários
- Cache otimizado para performance

### **📱 Design Responsivo**
- Layout adaptável para todos os dispositivos
- Mobile-first approach
- Touch-friendly interfaces

### **🛡️ Segurança**
- Autenticação robusta com Firebase
- Validação de dados no frontend e backend
- Proteção de rotas sensíveis

### **⚡ Performance**
- Turbopack para builds ultrarrápidos
- Lazy loading de componentes
- Otimizações automáticas do Next.js 15

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Nenhuma licença listada.

## 👨‍💻 Desenvolvedor

**Jean Rodrigues** - *Full Stack Developer*

- GitHub: [@ojeanrodriguesdev](https://github.com/ojeanrodriguesdev)

---

<div align="center">
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
  <p>🤖 Desenvolvido com o poder da IA usando <strong>Cursor</strong></p>
</div>