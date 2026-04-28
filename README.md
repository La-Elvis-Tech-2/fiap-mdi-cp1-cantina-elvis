# Cantina FIAP — Checkpoint 2

O **Cantina FIAP** é um app mobile (React Native + Expo) focado em **otimizar a experiência da cantina da FIAP**, permitindo que alunos façam login, naveguem pelo cardápio, montem um carrinho e finalizem pedidos diretamente pelo celular.

---

## Funcionalidades implementadas

### CP1 (mantidas e funcionando)
- Listagem de produtos por seções ("Destaques" e "Abaixo de R$10")
- Busca de produtos em tempo real com filtro por categoria
- Carrinho de compras com controle de quantidade
- Navegação entre telas via Expo Router
- Tab bar customizada

### CP2 (novas)
- **Autenticação completa** — cadastro e login com validação inline de todos os campos (e-mail, senha, confirmação)
- **Sessão persistida** — ao reabrir o app, o usuário logado não precisa fazer login novamente
- **Logout** com limpeza de sessão
- **Carrinho persistido** — sobrevive ao fechamento do app via AsyncStorage
- **Finalização de pedido** — tela de sucesso animada com número, total e previsão de retirada
- **Histórico de pedidos** — pedidos realizados ficam salvos e exibidos no perfil
- **Perfil do usuário** — exibe nome, e-mail, stats em tempo real (itens no carrinho, pedidos realizados, total gasto)
- **Filtro por categoria** na home — clica na categoria para filtrar, clica de novo para desmarcar
- **Modal de notificações** acessível pelo sininho
- **Saudação dinâmica** (Bom dia / Boa tarde / Boa noite) com nome do usuário logado
- **Proteção de rotas** — telas autenticadas não acessíveis sem login

---

## Diferenciais técnicos (CP2)

### 1. Animações com Animated API
Implementado nos formulários de login e cadastro: ao submeter com erros, o card executa uma animação de *shake* (`translateX`) via `Animated.sequence`. Na tela de sucesso do pedido, o ícone de confirmação usa `Animated.spring` e o conteúdo faz *fade + slide* de entrada.

**Justificativa:** Feedback visual imediato sem ser invasivo — padrão amplamente usado em apps de autenticação (Gmail, bancários). Melhora a percepção de erro sem depender de `Alert`.

### 2. Busca e filtragem em tempo real
A tela de busca combina filtro por texto (case-insensitive) e filtro por categoria simultaneamente, sem botão de confirmar. Inclui histórico de buscas recentes clicáveis e estado vazio com mensagem.

**Justificativa:** Aproxima a UX de apps reais como iFood e Rappi, entregando uma experiência de busca completa além do simples `TextInput`.

---

## Stack / Tecnologias

| Tecnologia | Uso |
|---|---|
| **JavaScript** | Linguagem principal |
| **React Native** | Framework mobile |
| **Expo** (~52) | Plataforma de build e desenvolvimento |
| **expo-router** (~4) | Navegação baseada em arquivos |
| **AsyncStorage** | Persistência local (usuários, sessão, carrinho, pedidos) |
| **Context API** | Estado global (Auth, Cart, Orders) |
| **Animated API** | Animações nativas (shake, spring, fade) |

---

## Integrantes do Grupo

| RM | Nome |
|---|---|
| rm554512 | Murilo Justi |
| rm555137 | Vitor Eskes |
| rm554972 | Gustavo Morais |
| rm555460 | Leonardo Rocha |
| rm554807 | Leonardo Novaes |

---

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- Expo Go no celular (para testar via QR Code)

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/VitorEskes/cp-mobile.git
   cd cp-mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Instale o AsyncStorage (se necessário):
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

4. Rode o app:
   ```bash
   npx expo start --clear
   ```

---

## Estrutura do projeto

```
cp-mobile/
├── app/
│   ├── _layout.js              ← Root layout — providers (Auth, Cart, Orders) + RootGate
│   ├── order-success.js        ← Tela de pedido confirmado (fora das tabs)
│   ├── (auth)/
│   │   ├── _layout.js
│   │   ├── login.js            ← Login com validação inline + shake animation
│   │   └── register.js         ← Cadastro com indicador de força de senha
│   └── (tabs)/
│       ├── _layout.js          ← Tab bar customizada com badge do carrinho
│       ├── index.js            ← Home — categorias, produtos, notificações
│       ├── search.js           ← Busca em tempo real com filtro por categoria
│       ├── cart.js             ← Carrinho com resumo e finalização
│       └── profile.js          ← Perfil com stats, histórico e logout
├── context/
│   ├── AuthContext.js          ← Autenticação + sessão persistida
│   ├── CartContext.js          ← Carrinho global + AsyncStorage
│   └── OrdersContext.js        ← Histórico de pedidos + AsyncStorage
└── assets/                     ← Imagens dos produtos
```

---

## Decisões Técnicas

### Gerenciamento de estado global (Context API)

Foram criados três contextos independentes para separar responsabilidades:

- **`AuthContext`** — estado do usuário (`undefined` = carregando, `null` = deslogado, objeto = logado), funções `login`, `register` e `logout`. A sessão é lida do AsyncStorage na inicialização via `useEffect`.
- **`CartContext`** — lista de itens, funções `addToCart`, `increase`, `decrease`, `remove`, `clearCart`, totalizadores `totalItems` e `subtotal`. Persiste automaticamente no AsyncStorage a cada mudança.
- **`OrdersContext`** — histórico de pedidos com `addOrder` e `totalSpent`. Cada pedido salva os itens, total e timestamp.

### Proteção de rotas

O `RootGate` no `app/_layout.js` monitora `user` e `loading` do `AuthContext`. Enquanto `loading = true` (AsyncStorage sendo lido), exibe um spinner. Após carregar, redireciona automaticamente: usuário sem sessão vai para `/(auth)/login`, usuário logado que tenta acessar `/(auth)` é mandado para `/(tabs)`.

### Autenticação local com AsyncStorage

Usuários são salvos em `@fiap_users` como array JSON. A sessão ativa fica em `@fiap_session`. O `login` valida e-mail + senha contra o array salvo; o `logout` remove apenas a sessão, mantendo o cadastro.

### Hooks utilizados

| Hook | Onde | Para quê |
|---|---|---|
| `useState` | Todas as telas | Estado de UI (categoria ativa, loading, erros de formulário) |
| `useEffect` | Contextos | Leitura e escrita no AsyncStorage |
| `useRef` + `Animated` | Login, Register, OrderSuccess | Animações sem re-render (useNativeDriver) |
| `useContext` | Todas as telas | Consumo dos contextos globais |
| `useRouter` | Login, Register, Cart, Home | Navegação programática |
| `useLocalSearchParams` | OrderSuccess | Receber parâmetros da navegação |
| `useSegments` | RootGate | Detectar grupo de rota atual para redirect |

### Fluxo de autenticação

```
App abre
  └── RootGate lê AsyncStorage (~100ms)
        ├── Sessão salva → /(tabs)/index (Home)
        └── Sem sessão  → /(auth)/login
                              ├── Login válido   → /(tabs)/index
                              └── Criar conta    → /(auth)/register → /(tabs)/index
                                                         ↓
                                              /(tabs)/profile → Logout → /(auth)/login
```

---

## Demonstrações (CP1)

<img width="180" height="861" alt="image" src="https://github.com/user-attachments/assets/7f2b0416-2e11-4184-b4f5-2053db33c2de" />
<img width="180" height="860" alt="image" src="https://github.com/user-attachments/assets/7314d2b4-45c2-4e66-9e56-14b58a73f674" />
<img width="180" height="861" alt="image" src="https://github.com/user-attachments/assets/39ab3673-69a1-4ce2-a604-3c5e263e370f" />

**Vídeo CP1:**
```
https://drive.google.com/file/d/1ZV21PdYRzNtT873EztZULRHIL_Edf_PY/view?usp=sharing
```

---

> Projeto acadêmico — FIAP · Checkpoint 2
