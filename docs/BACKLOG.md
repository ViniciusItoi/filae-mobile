# Fila[e] - Product Backlog e Planejamento de Sprints

## 📋 Visão Geral do Produto
**Fila[e]** é um aplicativo de gerenciamento de filas virtuais que permite aos usuários:
- Visualizar estabelecimentos disponíveis
- Entrar em filas virtuais remotamente
- Acompanhar sua posição em tempo real
- Receber notificações quando sua vez chegar
- Gerenciar filas (para estabelecimentos)

## 🎯 Objetivo do MVP
Implementar as funcionalidades essenciais para que usuários possam:
1. Fazer login no aplicativo
2. Visualizar estabelecimentos disponíveis
3. Entrar em filas virtuais
4. Acompanhar suas filas ativas
5. Cancelar entrada em filas

---

## 📝 Product Backlog Completo

### 🔴 Prioridade Alta (Must Have)
| ID | História de Usuário | Pontos | Status |
|----|---------------------|--------|--------|
| US-01 | Como usuário, quero fazer login com email e senha para acessar o app | 5 | ✅ Concluído |
| US-02 | Como usuário, quero visualizar uma lista de estabelecimentos disponíveis | 8 | ✅ Concluído |
| US-03 | Como usuário, quero ver detalhes de um estabelecimento (fila atual, tempo de espera) | 5 | ✅ Concluído |
| US-04 | Como usuário, quero entrar na fila de um estabelecimento | 8 | ✅ Concluído |
| US-05 | Como usuário, quero visualizar minhas filas ativas | 8 | ✅ Concluído |
| US-06 | Como usuário, quero cancelar minha entrada em uma fila | 5 | ✅ Concluído |
| US-07 | Como usuário, quero fazer logout do aplicativo | 3 | ✅ Concluído |
| US-08 | Como usuário, quero ver meu perfil com minhas informações | 3 | ✅ Concluído |

**Total de Pontos: 45** | **Status: 45/45 (100%)**

### 🟡 Prioridade Média (Should Have)
| ID | História de Usuário | Pontos | Status |
|----|---------------------|--------|--------|
| US-09 | Como usuário, quero buscar estabelecimentos por nome ou categoria | 5 | ✅ Concluído |
| US-10 | Como usuário, quero favoritar estabelecimentos | 5 | ✅ Concluído |
| US-11 | Como usuário, quero ver meu histórico de filas | 5 | ✅ Concluído |
| US-12 | Como usuário, quero ver detalhes de uma fila específica | 3 | ✅ Concluído |
| US-13 | Como usuário, quero atualizar minhas informações de perfil | 5 | ⏳ Pendente |
| US-14 | Como usuário, quero ver notificações do sistema | 8 | ⏳ Pendente |

**Total de Pontos: 31** | **Status: 18/31 (58%)**

### 🟢 Prioridade Baixa (Could Have)
| ID | História de Usuário | Pontos | Status |
|----|---------------------|--------|--------|
| US-15 | Como usuário, quero me registrar no app | 8 | ⏳ Pendente |
| US-16 | Como usuário, quero recuperar minha senha | 5 | ⏳ Pendente |
| US-17 | Como usuário, quero adicionar foto de perfil | 5 | ⏳ Pendente |
| US-18 | Como usuário, quero compartilhar minha posição na fila | 3 | ⏳ Pendente |
| US-19 | Como comerciante, quero gerenciar a fila do meu estabelecimento | 13 | ⏳ Pendente |
| US-20 | Como comerciante, quero chamar o próximo cliente | 8 | ⏳ Pendente |
| US-21 | Como comerciante, quero ver estatísticas da minha fila | 8 | ⏳ Pendente |

**Total de Pontos: 50** | **Status: 0/50 (0%)**

---

## 🏃 Sprint Planning

### Sprint 1 (2 semanas) - Fundação e Autenticação
**Objetivo:** Estabelecer a base do app com autenticação e visualização de estabelecimentos

**User Stories Selecionadas:**
- [x] US-01: Login (5 pts)
- [x] US-02: Listar estabelecimentos (8 pts)
- [x] US-03: Detalhes do estabelecimento (5 pts)
- [x] US-07: Logout (3 pts)
- [x] US-08: Ver perfil (3 pts)

**Velocity Estimada:** 24 pontos  
**Velocity Real:** 24 pontos ✅

**Entregáveis:**
- ✅ Tela de Login funcional com integração à API
- ✅ Tela Home com listagem de estabelecimentos
- ✅ Tela de Detalhes do Estabelecimento
- ✅ Tela de Perfil com logout
- ✅ Serviço de autenticação completo
- ✅ Serviço de estabelecimentos completo
- ✅ Navegação entre telas implementada

**Retrospectiva Sprint 1:**
- ✅ **O que funcionou bem:** 
  - Integração com API bem-sucedida
  - Componentização efetiva dos elementos de UI
  - Estrutura de navegação clara
  
- ⚠️ **Desafios:**
  - Ajustes de layout para corresponder ao protótipo
  - Configuração inicial do ambiente React Native
  
- 💡 **Melhorias para próxima sprint:**
  - Implementar testes unitários
  - Adicionar validações mais robustas

---

### Sprint 2 (2 semanas) - Funcionalidades de Fila
**Objetivo:** Implementar funcionalidades principais de gerenciamento de filas

**User Stories Selecionadas:**
- [x] US-04: Entrar na fila (8 pts)
- [x] US-05: Visualizar filas ativas (8 pts)
- [x] US-06: Cancelar fila (5 pts)
- [x] US-09: Buscar estabelecimentos (5 pts)
- [x] US-10: Favoritar (5 pts)
- [x] US-11: Histórico de filas (5 pts)
- [x] US-12: Detalhes da fila (3 pts)

**Velocity Estimada:** 39 pontos  
**Velocity Real:** 39 pontos ✅

**Entregáveis:**
- ✅ Tela de Minhas Filas com tabs (Ativas/Histórico)
- ✅ Funcionalidade de entrar na fila
- ✅ Funcionalidade de cancelar fila
- ✅ Componente QueueTicket reutilizável
- ✅ Sistema de busca e filtros
- ✅ Sistema de favoritos
- ✅ Polling para atualizar posição na fila
- ✅ EmptyStates para melhor UX

**Retrospectiva Sprint 2:**
- ✅ **O que funcionou bem:**
  - Reutilização de componentes
  - Integração fluida entre telas
  - Sistema de polling funcionando bem
  
- ✅ **Conquistas:**
  - Todas as funcionalidades principais implementadas
  - App totalmente funcional e integrado com backend
  - Navegação intuitiva e responsiva
  
- 🎯 **Próximos passos:**
  - Sistema de notificações push
  - Testes automatizados
  - Funcionalidades para comerciantes

---

## 📊 Métricas do Projeto

### Progresso Geral
- **Total de User Stories:** 21
- **Concluídas:** 13 (62%)
- **Em Progresso:** 0
- **Pendentes:** 8 (38%)

### Velocity
- **Sprint 1:** 24 pontos (100% concluído)
- **Sprint 2:** 39 pontos (100% concluído)
- **Velocity Média:** 31.5 pontos/sprint

### Cobertura Funcional
- **Funcionalidades Core (Must Have):** 100% ✅
- **Funcionalidades Importantes (Should Have):** 58% 🟡
- **Funcionalidades Desejáveis (Could Have):** 0% ⏳

---

## 🎯 Critérios de Sucesso do MVP

### Critérios Técnicos ✅
- [x] App compila e roda sem erros
- [x] Integração com API funcionando
- [x] Navegação entre telas fluida
- [x] Tratamento de erros implementado
- [x] Loading states implementados
- [x] Código organizado e componentizado

### Critérios Funcionais ✅
- [x] Usuário consegue fazer login
- [x] Usuário consegue visualizar estabelecimentos
- [x] Usuário consegue entrar em filas
- [x] Usuário consegue ver suas filas ativas
- [x] Usuário consegue cancelar filas
- [x] Usuário consegue fazer logout

### Critérios de UX ✅
- [x] Interface intuitiva e fácil de usar
- [x] Feedback visual para ações do usuário
- [x] Estados vazios bem apresentados
- [x] Loading states durante operações
- [x] Mensagens de erro claras

---

## 🚀 Próximas Funcionalidades (Backlog Futuro)

### Sprint 3 (Hipotética) - Notificações e Melhorias
- US-14: Sistema de notificações (8 pts)
- US-13: Editar perfil (5 pts)
- Implementar testes unitários (8 pts)
- Melhorias de performance (5 pts)

### Sprint 4 (Hipotética) - Registro e Comerciantes
- US-15: Registro de usuários (8 pts)
- US-16: Recuperação de senha (5 pts)
- US-19: Dashboard para comerciantes (13 pts)
- US-20: Chamar próximo cliente (8 pts)

---

## 📈 Definição de Pronto (DoD)

Uma história de usuário é considerada "pronta" quando:
- [ ] Código implementado e testado
- [ ] Interface corresponde ao protótipo
- [ ] Integração com API funciona corretamente
- [ ] Tratamento de erros implementado
- [ ] Loading states implementados
- [ ] Testado em dispositivo Android
- [ ] Código revisado
- [ ] Documentação atualizada

---

## 🎓 Metodologia Ágil Aplicada

### Framework: Scrum Adaptado
- **Sprints:** 2 semanas
- **Daily Standups:** Simulados através de commits frequentes
- **Sprint Planning:** Documentado neste backlog
- **Sprint Review:** Retrospectivas documentadas
- **Sprint Retrospective:** Lições aprendidas registradas

### Priorização: MoSCoW
- **Must Have:** Funcionalidades essenciais para o MVP
- **Should Have:** Importantes mas não críticas
- **Could Have:** Desejáveis se houver tempo
- **Won't Have:** Fora do escopo atual

### Estimativa: Planning Poker
- 1-3 pontos: Pequeno (poucas horas)
- 5 pontos: Médio (1-2 dias)
- 8 pontos: Grande (3-5 dias)
- 13 pontos: Muito grande (1 semana+)

---

## 📱 Tecnologias Utilizadas

### Frontend
- **React Native** - Framework principal
- **TypeScript** - Type safety
- **React Navigation** - Navegação
- **Axios** - HTTP client
- **AsyncStorage** - Persistência local

### Backend (API Externa)
- **Spring Boot** (Java)
- **PostgreSQL**
- **RESTful API**

### Ferramentas
- **Git/GitHub** - Controle de versão
- **Android Studio** - Desenvolvimento Android
- **VS Code** - Editor de código

---

## ✅ Status da Entrega

### Requisitos Atendidos
- [x] **Mínimo 3 telas implementadas:** 
  - Login, Home, Profile, EstablishmentDetails, MyQueues, QueueDetails (6 telas)
- [x] **Login implementado:** Autenticação completa com JWT
- [x] **Consumo de serviço externo:** API REST integrada
- [x] **Alteração de dados na interface:** Dados dinâmicos da API
- [x] **Backlog documentado:** Este arquivo
- [x] **Sprints planejadas:** 2 sprints documentadas
- [x] **Metodologia ágil aplicada:** Scrum com MoSCoW
- [x] **Código no GitHub:** Repositório completo

### Diferenciais Implementados
- ✅ Componentização avançada
- ✅ Sistema de tipos TypeScript completo
- ✅ Tratamento robusto de erros
- ✅ Loading states em todas operações
- ✅ Empty states para melhor UX
- ✅ Sistema de favoritos
- ✅ Busca e filtros
- ✅ Atualização em tempo real (polling)
- ✅ Navegação intuitiva
- ✅ Design baseado em protótipo Figma

---

## 🏆 Conclusão

O MVP do **Fila[e]** foi completado com sucesso, implementando todas as funcionalidades essenciais para gerenciamento de filas virtuais. O app permite que usuários visualizem estabelecimentos, entrem em filas, acompanhem suas posições e gerenciem suas entradas de forma simples e intuitiva.

**Métricas de Sucesso:**
- ✅ 100% das funcionalidades core implementadas
- ✅ 13 User Stories completadas
- ✅ 63 pontos de velocity em 2 sprints
- ✅ App totalmente funcional e integrado
- ✅ Código limpo e bem organizado
- ✅ Todos os requisitos da entrega atendidos

**Próximos Passos:**
O backlog futuro inclui notificações push, funcionalidades para comerciantes, e melhorias adicionais de UX. O app está pronto para ser expandido com novas funcionalidades seguindo a mesma estrutura e metodologia ágil.

