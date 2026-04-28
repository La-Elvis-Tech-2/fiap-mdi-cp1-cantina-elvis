# Cantina FIAP — Checkpoint 2

O **Cantina FIAP** é um app mobile desenvolvido em React Native + Expo para **otimizar a experiência da cantina da FIAP**. O app permite que alunos façam login, naveguem pelo cardápio, montem um carrinho e finalizem pedidos diretamente pelo celular, sem precisar enfrentar filas ou confusão na hora de pedir.

### Operação da FIAP escolhida
A operação escolhida foi a **cantina universitária** — um ponto de contato diário de todos os alunos com a instituição. O problema identificado é a falta de agilidade no processo de pedido: alunos não sabem o que está disponível, perdem tempo na fila e muitas vezes desistem. O app resolve isso centralizando cardápio, filtros, carrinho e histórico de pedidos em um único lugar.

### O que mudou/melhorou em relação ao CP1
O CP1 entregou um MVP visual com navegação, listagem de produtos e carrinho mockado. O CP2 transforma esse protótipo em um app funcional de verdade:
- Adicionou autenticação real com persistência de sessão
- O carrinho agora sobrevive ao fechamento do app
- Pedidos são salvos e contabilizados no perfil do usuário
- Todas as telas passaram por refinamento visual e de UX
- Formulários têm validação inline com feedback visual imediato

---

## Funcionalidades Implementadas

### CP1 (mantidas e funcionando)
- Listagem de produtos por seções ("Destaques" e "Abaixo de R$10")
- Busca de produtos em tempo real com filtro por categoria
- Carrinho de compras com controle de quantidade e resumo de valores
- Navegação entre telas via Expo Router
- Tab bar customizada com ícones

### CP2 (novas)
- Tela de **Cadastro** com validação de nome, e-mail, senha e confirmação de senha
- Tela de **Login** com validação de credenciais contra dados persistidos
- **Sessão persistida** — usuário logado não precisa fazer login ao reabrir o app
- **Logout** com limpeza de sessão e retorno à tela de login
- **Proteção de rotas** — telas autenticadas inacessíveis sem login
- **Carrinho persistido** no AsyncStorage — sobrevive ao fechamento do app
- **Finalização de pedido** com tela de sucesso animada (número do pedido, total, previsão)
- **Histórico de pedidos** salvo e exibido no perfil
- **Perfil do usuário** com stats em tempo real: itens no carrinho, pedidos realizados, total gasto
- **Filtro por categoria** na home — clica para filtrar, clica de novo para desmarcar
- **Modal de notificações** acessível pelo sininho
- **Saudação dinâmica** (Bom dia / Boa tarde / Boa noite) com nome do usuário logado

---

## Integrantes do Grupo

| RM | Nome completo |
|---|---|
| rm554512 | Murilo Justi |
| rm555137 | Vitor Eskes |
| rm554972 | Gustavo Morais |
| rm555460 | Leonardo Rocha |
| rm554807 | Leonardo Novaes |

---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Expo Go instalado no celular **ou** emulador Android/iOS configurado
- Expo SDK ~52

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

4. Rode o app (sempre com `--clear` para limpar cache):
   ```bash
   npx expo start --clear
   ```

5. Escaneie o QR Code com o **Expo Go** no celular ou pressione `a` para abrir no emulador Android.

---

## Demonstração Visual

> ⚠️ Prints e vídeo do CP2 serão adicionados após gravação final.

**Vídeo CP1:**
```
https://drive.google.com/file/d/1ZV21PdYRzNtT873EztZULRHIL_Edf_PY/view?usp=sharing
```

**Prints CP1:**

<img width="180" alt="Home" src="https://github.com/user-attachments/assets/7f2b0416-2e11-4184-b4f5-2053db33c2de" />
<img width="180" alt="Busca" src="https://github.com/user-attachments/assets/7314d2b4-45c2-4e66-9e56-14b58a73f674" />
<img width="180" alt="Carrinho" src="https://github.com/user-attachments/assets/39ab3673-69a1-4ce2-a604-3c5e263e370f" />

---

## Decisões Técnicas

### Como o projeto foi estruturado

```
cp-mobile/
├── app/
│   ├── _layout.js              ← Root layout — providers + RootGate (proteção de rotas)
│   ├── order-success.js        ← Tela de pedido confirmado (fora das tabs, tela cheia)
│   ├── (auth)/
│   │   ├── login.js            ← Login com validação inline + shake animation
│   │   └── register.js         ← Cadastro com indicador de força de senha
│   └── (tabs)/
│       ├── _layout.js          ← Tab bar customizada com badge do carrinho
│       ├── index.js            ← Home — categorias, produtos, filtros, notificações
│       ├── search.js           ← Busca em tempo real
│       ├── cart.js             ← Carrinho com resumo e finalização
│       └── profile.js          ← Perfil com histórico e logout
├── context/
│   ├── AuthContext.js          ← Autenticação + sessão (AsyncStorage)
│   ├── CartContext.js          ← Carrinho global (AsyncStorage)
│   └── OrdersContext.js        ← Histórico de pedidos (AsyncStorage)
└── assets/                     ← Imagens dos produtos
```

Cada pasta tem responsabilidade única: `context/` gerencia estado global, `app/(auth)/` cuida do fluxo de autenticação e `app/(tabs)/` contém as telas principais protegidas.

### Contexts criados e o que cada um gerencia

**`AuthContext`**
- Gerencia: usuário logado, estado de carregamento, funções `login`, `register`, `logout`
- Chaves AsyncStorage: `@fiap_users` (cadastros), `@fiap_session` (sessão ativa)
- Estado inicial `undefined` (carregando) → `null` (deslogado) → objeto do usuário (logado)

**`CartContext`**
- Gerencia: lista de itens do carrinho, funções `addToCart`, `increase`, `decrease`, `remove`, `clearCart`, totalizadores `totalItems` e `subtotal`
- Chave AsyncStorage: `@fiap_cart`
- Persiste automaticamente via `useEffect` a cada mudança no carrinho

**`OrdersContext`**
- Gerencia: histórico de pedidos, função `addOrder`, total gasto `totalSpent`
- Chave AsyncStorage: `@fiap_orders`
- Cada pedido salva: id, array de itens, total e timestamp

### Como a autenticação foi implementada

Usuários são salvos localmente no AsyncStorage como um array JSON na chave `@fiap_users`. A sessão ativa fica em `@fiap_session`. No login, as credenciais são validadas contra o array salvo. O logout remove apenas a sessão, preservando o cadastro.

O fluxo de proteção é controlado pelo `RootGate` no `app/_layout.js`:

```
App abre → RootGate lê AsyncStorage
  ├── Sessão encontrada  → redireciona para /(tabs)/index
  └── Sem sessão        → redireciona para /(auth)/login
        ├── Login OK    → /(tabs)/index
        └── Cadastro    → /(auth)/register → /(tabs)/index
                                  ↓
                     Perfil → Logout → /(auth)/login
```

### Como o AsyncStorage foi utilizado

| Chave | O que armazena | Quando é atualizado |
|---|---|---|
| `@fiap_users` | Array de usuários cadastrados (id, nome, e-mail, senha) | Ao cadastrar novo usuário |
| `@fiap_session` | Objeto do usuário logado (sem senha) | Ao fazer login / logout |
| `@fiap_cart` | Array de itens do carrinho com quantidades | A cada adição, remoção ou mudança de qty |
| `@fiap_orders` | Array de pedidos finalizados | Ao finalizar um pedido |

### Como a navegação protegida foi implementada

O `RootGate` é um componente dentro do `app/_layout.js` que consome o `AuthContext`. Enquanto `loading = true` (AsyncStorage sendo lido), exibe um `ActivityIndicator`. Após carregar, usa `useSegments` para detectar em qual grupo de rota o usuário está e redireciona com `useRouter` se necessário. Dessa forma, nenhuma tela protegida é montada antes da verificação de sessão ser concluída.

---

## Diferencial Implementado

### 1. Animações com Animated API

**O que foi escolhido:** Animação de *shake* nos formulários de login e cadastro ao submeter com erros, e animações de entrada (spring + fade + slide) na tela de sucesso do pedido.

**Justificativa:** O feedback visual imediato ao erro de formulário é um padrão consolidado em apps de alto uso (Gmail, apps bancários, iOS Keychain). O *shake* comunica o erro de forma intuitiva sem depender de `Alert`, que interrompe o fluxo do usuário. Na tela de sucesso, as animações de entrada criam um momento de celebração que reforça a conclusão da ação — aumentando a percepção de qualidade do app.

**Como foi implementado:**
- `useRef(new Animated.Value(0))` para criar os valores animados sem causar re-render
- `Animated.sequence` com múltiplos `Animated.timing` para o efeito de shake (translateX)
- `Animated.spring` para o ícone de confirmação (efeito elástico natural)
- `Animated.parallel` para fade + slide simultâneos no conteúdo da tela de sucesso
- Todos com `useNativeDriver: true` para rodar na thread nativa (melhor performance)

### 2. Busca e Filtragem em Tempo Real *(diferencial extra)*

**O que foi escolhido:** `FlatList` com campo de busca que filtra simultaneamente por texto e categoria, sem botão de confirmar.

**Justificativa:** Busca instantânea reduz o atrito do usuário — não precisar pressionar "buscar" é um padrão de UX consolidado por iFood, Rappi e outros super apps. A combinação de filtro por texto + categoria entrega uma experiência de busca completa que vai além do simples `TextInput`.

---

## Próximos Passos

- Integrar API real de produtos e cardápio dinâmico
- Implementar notificações push com **Expo Notifications** (pedido pronto, promoções)
- Adicionar upload de foto de perfil com **Expo ImagePicker**
- Criar tela de detalhes do produto com descrição e nutrição
- Implementar pagamento in-app (PIX ou crédito)
- Adicionar avaliação de pedidos concluídos

---

> Projeto acadêmico — FIAP · Checkpoint 2