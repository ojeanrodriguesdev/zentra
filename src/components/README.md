# Zentra Components

Uma biblioteca robusta e escalável de componentes React para o projeto Zentra, construída com Tailwind CSS e seguindo as melhores práticas de design system.

## 📁 Estrutura de Pastas

```
src/components/
├── ui/                     # Componentes primitivos/básicos
│   ├── buttons/           # Botões e ações
│   ├── inputs/            # Campos de entrada
│   ├── cards/             # Cartões e containers
│   ├── typography/        # Tipografia
│   ├── icons/             # Ícones
│   ├── avatars/           # Avatares de usuário
│   ├── badges/            # Distintivos e tags
│   ├── dividers/          # Separadores
│   ├── progress/          # Barras de progresso
│   ├── sliders/           # Controles deslizantes
│   ├── switches/          # Interruptores
│   ├── tabs/              # Abas
│   ├── tooltips/          # Dicas contextuais
│   └── popover/           # Popovers
├── layout/                # Componentes de layout
│   ├── header/            # Cabeçalhos
│   ├── footer/            # Rodapés
│   ├── sidebar/           # Barras laterais
│   ├── navbar/            # Barras de navegação
│   ├── container/         # Containers responsivos
│   ├── grid/              # Sistemas de grid
│   └── section/           # Seções de página
├── forms/                 # Componentes de formulário
│   ├── fields/            # Campos de formulário
│   ├── validation/        # Validação
│   ├── steps/             # Formulários em etapas
│   └── upload/            # Upload de arquivos
├── router/                # Componentes de navegação
│   ├── breadcrumb/        # Migalhas de pão
│   ├── pagination/        # Paginação
│   ├── menu/              # Menus
│   ├── drawer/            # Gavetas laterais
│   └── dropdown/          # Menus dropdown
├── shared/                # Componentes reutilizáveis
│   ├── loading/           # Estados de carregamento
│   ├── error/             # Estados de erro
│   ├── empty-state/       # Estados vazios
│   ├── skeleton/          # Skeleton loading
│   └── infinite-scroll/   # Scroll infinito
├── features/              # Componentes específicos
│   ├── auth/              # Autenticação
│   ├── dashboard/         # Dashboard
│   ├── profile/           # Perfil de usuário
│   ├── settings/          # Configurações
│   ├── search/            # Busca
│   ├── filters/           # Filtros
│   ├── charts/            # Gráficos
│   ├── tables/            # Tabelas
│   ├── calendar/          # Calendário
│   ├── messaging/         # Mensagens
│   └── notifications/     # Notificações
├── providers/             # Context providers
│   ├── theme/             # Tema
│   ├── auth/              # Autenticação
│   ├── api/               # API
│   └── state/             # Gerenciamento de estado
├── dialogs/               # Componentes modais
│   ├── dialog/            # Diálogos
│   ├── confirmation/      # Confirmações
│   ├── drawer/            # Gavetas modais
│   └── sheet/             # Bottom sheets
├── notifications/         # Componentes de feedback
│   ├── toast/             # Notificações toast
│   ├── alert/             # Alertas
│   ├── snackbar/          # Snackbars
│   ├── banner/            # Banners
│   └── status/            # Indicadores de status
└── data-display/          # Exibição de dados
    ├── list/              # Listas
    ├── table/             # Tabelas
    ├── card/              # Cards de dados
    ├── timeline/          # Linha do tempo
    ├── carousel/          # Carrosséis
    ├── gallery/           # Galerias
    ├── stats/             # Estatísticas
    └── metrics/           # Métricas
```

## 🚀 Como Usar

### Importação Individual
```jsx
import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { Card, CardHeader, CardContent } from '@/components/ui/cards';
```

### Importação por Categoria
```jsx
import { Button, Input, Card } from '@/components/ui';
import { Header, Container } from '@/components/layout';
import { Loading } from '@/components/shared';
```

### Importação Geral
```jsx
import { Button, Input, Card, Header, Container, Loading } from '@/components';
```

## 📚 Componentes Disponíveis

### UI Components
- **Button**: Botões com múltiplas variantes (primary, secondary, outline, ghost, link)
- **Input**: Campos de entrada com suporte a labels, validação e estados de erro
- **Card**: Sistema de cards flexível com header, content e footer

### Layout Components
- **Header**: Cabeçalho responsivo com suporte a posicionamento fixo/sticky
- **Container**: Container responsivo com diferentes tamanhos

### Shared Components
- **Loading**: Componente de loading com diferentes variantes (spinner, dots)

### Router Components
- **Menu**: Sistema de menu dropdown com itens e separadores

## 🎨 Design System

Os componentes seguem um design system consistente baseado em:
- **Tailwind CSS** para estilização
- **Design tokens** para cores, espaçamentos e tipografia
- **Variantes** para diferentes estados e tipos
- **Responsividade** mobile-first
- **Acessibilidade** com suporte a screen readers

## 🔧 Desenvolvimento

### Padrões de Código
- Todos os componentes usam `forwardRef` para suporte a refs
- Props são tipadas com destructuring e valores padrão
- Classes CSS são compostas de forma modular
- Suporte a `className` para customização

### Barrel Exports
Cada pasta possui um arquivo `index.js` que exporta todos os componentes da categoria, permitindo importações limpas e organizadas.

### Extensibilidade
A estrutura foi projetada para ser facilmente extensível. Para adicionar novos componentes:

1. Crie a pasta específica dentro da categoria apropriada
2. Implemente o componente usando os padrões estabelecidos
3. Adicione o export no arquivo `index.js` da categoria
4. Teste e documente o componente

## 📱 Responsividade

Todos os componentes são responsivos e seguem uma abordagem mobile-first, utilizando os breakpoints padrão do Tailwind CSS:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
