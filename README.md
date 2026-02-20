# 📱 Fila[e] - Gerenciamento de Filas Virtuais

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Sobre o Projeto

**Fila[e]** é um aplicativo móvel de gerenciamento de filas virtuais que permite aos usuários:
- 🔍 Visualizar estabelecimentos disponíveis
- 📱 Entrar em filas virtuais remotamente
- ⏱️ Acompanhar posição em tempo real
- ⭐ Favoritar estabelecimentos
- 📊 Visualizar histórico de filas

Este projeto foi desenvolvido como parte da Fase 2 da disciplina de **Desenvolvimento Cross-Platform** utilizando **React Native** e **TypeScript**.

---

## 🚀 Funcionalidades Implementadas

### ✅ Funcionalidades Core
- [x] **Autenticação**: Login e logout com JWT
- [x] **Home**: Listagem de estabelecimentos com busca e filtros
- [x] **Detalhes**: Visualização de informações do estabelecimento
- [x] **CRUD Completo de Filas**:
  - ✅ **Create**: Tela dedicada para criar/entrar na fila (CreateQueueScreen)
  - ✅ **Read**: Visualizar minhas filas ativas/histórico (MyQueuesScreen) e detalhes (QueueDetailsScreen)
  - ✅ **Update**: Editar informações da fila - tamanho do grupo e observações (EditQueueScreen)
  - ✅ **Delete**: Cancelar fila com confirmação (integrado em QueueDetailsScreen)
- [x] **Favoritos**: Sistema de favoritos para estabelecimentos
- [x] **Perfil**: Visualização e gerenciamento de perfil de usuário

### 🎯 Destaques
- **Interface Moderna**: Design baseado em protótipo Figma
- **Componentização**: Arquitetura com componentes reutilizáveis
- **Type Safety**: TypeScript em 100% do código
- **API Integration**: Integração completa com backend REST
- **Real-time Updates**: Atualização automática de posição na fila
- **Error Handling**: Tratamento robusto de erros
- **Loading States**: Feedback visual em todas operações

---

## 🛠️ Tecnologias

### Frontend
- **React Native 0.74** - Framework cross-platform
- **TypeScript 5.0** - Superset tipado do JavaScript
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local

### Backend (API Externa)
- **Spring Boot** (Java)
- **PostgreSQL**
- **JWT Authentication**
- **RESTful API**

---

## 📁 Estrutura do Projeto

```
filae/
├── src/
│   ├── api/                # Cliente HTTP e configuração
│   ├── assets/             # Imagens e recursos estáticos
│   ├── components/         # Componentes reutilizáveis
│   │   ├── common/         # Componentes gerais
│   │   ├── establishment/  # Componentes de estabelecimento
│   │   └── queue/          # Componentes de fila
│   ├── config/             # Configurações da aplicação
│   ├── contexts/           # React Contexts
│   ├── hooks/              # Custom Hooks
│   ├── locales/            # Internacionalização
│   ├── navigation/         # Configuração de navegação
│   ├── screens/            # Telas da aplicação
│   ├── services/           # Serviços de API
│   ├── theme/              # Tema e estilos globais
│   ├── types/              # Definições TypeScript
│   └── utils/              # Utilitários
└── docs/                   # Documentação
```

---

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Android Studio (para Android)
- JDK 11+
- Backend API rodando em `http://localhost:8080`

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ViniciusItoi/filae-mobile.git
cd filae-mobile
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o backend**
   - Certifique-se de que o backend está rodando em `http://localhost:8080`
   - Se estiver usando um dispositivo físico, atualize o IP em `src/config/env.config.ts`

### Executando no Android

1. **Inicie o Metro Bundler**
```bash
npm start
```

2. **Em outro terminal, execute no Android**
```bash
npm run android
```

---

## 👤 Credenciais de Teste

Para testar o aplicativo, use:

**Usuário Cliente:**
- Email: `alice@example.com`
- Senha: `SecurePass123!`

---

## 📱 Telas Implementadas

1. **Login** - Autenticação com email/senha
2. **Home** - Listagem de estabelecimentos com busca e filtros
3. **Detalhes do Estabelecimento** - Informações completas e botão para entrar na fila
4. **Criar Fila** (CREATE) - Tela dedicada para entrar na fila com validações completas
5. **Minhas Filas** (READ) - Gerenciamento de filas ativas e histórico com tabs
6. **Detalhes da Fila** (READ) - Visualização detalhada com auto-refresh a cada 5s
7. **Editar Fila** (UPDATE) - Atualizar tamanho do grupo e observações
8. **Perfil** - Informações do usuário e logout

**Total: 8 telas com CRUD completo de filas implementado**

---

## 🏗️ Arquitetura

### Padrões Utilizados

- **Component-Based Architecture**: Componentização para reutilização
- **Context API**: Gerenciamento de estado global (Auth)
- **Service Layer**: Camada de serviços para API
- **Custom Hooks**: Lógica reutilizável
- **Type Safety**: TypeScript para segurança de tipos

### Navegação

```
RootNavigator
├── AuthStack (não autenticado)
│   └── LoginScreen
└── MainNavigator (autenticado)
    ├── HomeStack
    ├── QueuesStack
    └── ProfileStack
```

---

## 📊 Backlog e Sprint Planning

Para ver o backlog completo, histórias de usuário e planejamento de sprints:

📄 **[BACKLOG.md](./docs/BACKLOG.md)**

### Resumo
- **Sprint 1**: Autenticação e listagem (24 pontos) ✅
- **Sprint 2**: Gerenciamento de filas (39 pontos) ✅
- **Total**: 13 User Stories implementadas
- **Cobertura**: 100% das funcionalidades core

---

## 🔄 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login

### Estabelecimentos
- `GET /api/establishments` - Listar
- `GET /api/establishments/:id` - Detalhes

### Filas
- `GET /api/queues/my-queues` - Minhas filas
- `GET /api/queues/:id` - Detalhes da fila
- `POST /api/queues/join` - Entrar na fila (CREATE)
- `PUT /api/queues/:id` - Atualizar fila (UPDATE)
- `PUT /api/queues/:id/cancel` - Cancelar fila (DELETE)

### Favoritos
- `GET /api/favorites` - Listar
- `POST /api/favorites` - Adicionar
- `DELETE /api/favorites/:id` - Remover

---

## 🚀 Próximas Funcionalidades

### Planejadas
- [ ] Sistema de notificações push
- [ ] Edição de perfil
- [ ] Registro de usuários
- [ ] Dashboard para comerciantes

---

## 👨‍💻 Autor

**Vinicius Itoi**
- GitHub: [@ViniciusItoi](https://github.com/ViniciusItoi)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📚 Documentação Adicional

- [Product Backlog e Sprint Planning](./docs/BACKLOG.md)
- [Postman Collection](./Filae_API_Postman_Collection_Complete.json)

---

<div align="center">
  <p>Desenvolvido com ❤️ usando React Native + TypeScript</p>
  <p>Fase 2 - Desenvolvimento Cross-Platform - 2026</p>
</div>
