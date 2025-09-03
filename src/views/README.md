# Views

Esta pasta contém todos os componentes de página/view da aplicação Zentra, organizadas por funcionalidade.

**Importante**: Esta pasta é diferente de `src/app/` que contém as rotas do Next.js App Router. Aqui ficam os componentes reutilizáveis de página.

## 📁 Estrutura

```
src/views/
├── auth/              # Páginas de autenticação
│   └── LoginPage.jsx  # Página de login
├── home/              # Páginas iniciais
│   └── HomePage.jsx   # Página principal
├── dashboard/         # Páginas do dashboard
├── profile/           # Páginas de perfil
├── settings/          # Páginas de configurações
├── about/             # Páginas sobre
├── contact/           # Páginas de contato
└── index.js          # Barrel exports
```

## 🎯 Propósito

As views são diferentes dos componentes simples:
- **Views**: Representações completas de telas/páginas
- **Componentes**: Peças reutilizáveis de interface
- **App Router**: Rotas do Next.js em `src/app/`

## 🚀 Como Usar

### Importação
```jsx
import { HomePage, LoginPage } from '@/views';
```

### Roteamento com Next.js App Router
As views podem ser utilizadas dentro das rotas do App Router:

```jsx
// app/login/page.jsx
import { LoginPage } from '@/views';

export default function Login() {
  return <LoginPage />;
}
```

## 📝 Convenções

1. **Nomenclatura**: Sempre termine com "Page" (ex: `HomePage.jsx`)
2. **Exportação**: Use export default para cada view
3. **Barrel exports**: Adicione no `index.js` para facilitar importações
4. **Organização**: Agrupe por funcionalidade/domínio
5. **Diferenciação**: Views vs App Router - use views para componentes reutilizáveis

## 🔧 Exemplo de View

```jsx
import { Container, Header } from '@/components/layout';
import { Button, Card } from '@/components/ui';

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header>
        <h1>Título da View</h1>
      </Header>
      
      <Container>
        <Card>
          <h2>Conteúdo da view</h2>
        </Card>
      </Container>
    </div>
  );
}
```

## 🗂️ Estrutura do Projeto

```
src/
├── app/           # Next.js App Router (rotas)
├── components/    # Componentes reutilizáveis  
└── views/         # Views/Páginas reutilizáveis
```
```
