# 🔥 Configuração Firebase - Zentra

## 🚀 Passo a Passo para Configurar Firebase Auth

### 1️⃣ **Criar Projeto Firebase**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Criar um projeto"**
3. Digite o nome: `zentra` (ou outro de sua escolha)
4. Ative Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2️⃣ **Configurar Autenticação**

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**
3. Vá na aba **"Sign-in method"**
4. Ative o **"Google"** como provedor
5. Configure email de suporte do projeto
6. Salve as configurações

### 3️⃣ **Configurar Firestore Database**

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"** (ou produção se preferir)
4. Selecione uma localização (ex: us-central1)

### 4️⃣ **Obter Configurações do App**

1. Vá em **"Configurações do projeto"** (ícone de engrenagem)
2. Role até **"Seus apps"**
3. Clique em **"Adicionar app"** → **"Web"** (ícone `</>`
4. Digite um nome para o app: `zentra-web`
5. **NÃO** marque "Configurar Firebase Hosting"
6. Clique em **"Registrar app"**
7. Copie o objeto `firebaseConfig`

### 5️⃣ **Configurar Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zentra-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zentra-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zentra-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**⚠️ Substitua pelos valores reais do seu projeto!**

### 6️⃣ **Configurar Domínios Autorizados**

1. No Firebase Console → **Authentication** → **Settings**
2. Role até **"Authorized domains"**
3. Adicione seus domínios:
   - `localhost` (para desenvolvimento)
   - `seu-dominio.com` (para produção)

## ✅ **Testar Funcionamento**

1. Reinicie o servidor Next.js:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/login`
3. Clique em **"Entrar com Google"**
4. Deve abrir popup do Google para autenticação
5. Após login, deve redirecionar para home com perfil do usuário

## 🔧 **Troubleshooting**

### ❌ **Erro: "Firebase configuration object is not valid"**
- Verifique se todas as variáveis em `.env.local` estão corretas
- Confirme se o arquivo está na raiz do projeto
- Reinicie o servidor após alterar `.env.local`

### ❌ **Erro: "auth/unauthorized-domain"**  
- Adicione `localhost` nos domínios autorizados do Firebase
- Verifique se está acessando via `localhost` e não `127.0.0.1`

### ❌ **Erro: "Cannot read properties of undefined"**
- Confirme se o AuthProvider está envolvendo toda a aplicação
- Verifique se está usando `useAuth()` dentro de um componente filho

## 📱 **Próximos Passos**

Após configurar o Firebase:

1. ✅ **Teste login Google** - deve funcionar perfeitamente
2. 🚧 **Implementar Firestore** - banco de dados
3. 🚧 **Criar perfil de usuário** - salvar dados no Firestore
4. 🚧 **Implementar roles** - admin, user, etc.
5. 🚧 **Configurar segurança** - regras do Firestore

## 💡 **Dica de Segurança**

- Nunca commite o arquivo `.env.local`
- Use regras de segurança do Firestore em produção
- Configure domínios autorizados corretamente
- Monitore uso no Firebase Console
