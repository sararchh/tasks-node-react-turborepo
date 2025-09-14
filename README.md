# iGame Monorepo

Este é um monorepo para a aplicação iGame usando Turborepo com arquitetura de microserviços.

## 📁 Estrutura do Projeto

```
igame/
├── apps/
│   ├── web/                    # Frontend React
│   ├── api-gateway/            # Gateway HTTP/WebSocket
│   ├── auth-service/           # Microserviço de Autenticação (TCP)
│   ├── tasks-service/          # Microserviço de Tarefas (TCP + RabbitMQ)
│   └── notifications-service/  # Microserviço de Notificações (HTTP + TCP + WebSocket + RabbitMQ)
├── packages/
│   ├── types/                  # Tipos TypeScript compartilhados
│   ├── tsconfig/              # Configuração TypeScript compartilhada
│   └── eslint-config/         # Configuração ESLint compartilhada
├── docker-compose.yml         # Orquestração dos containers
└── README.md
```

## 🏗️ Arquitetura

### Visão Geral
A aplicação segue uma arquitetura de **microserviços** com os seguintes componentes:

- **API Gateway**: Ponto de entrada único que redireciona requisições para os microserviços apropriados
- **Auth Service**: Gerencia autenticação, registro de usuários e JWT tokens
- **Tasks Service**: Gerencia operações relacionadas a tarefas
- **Notifications Service**: Híbrido (HTTP + TCP + WebSocket + RabbitMQ) para notificações em tempo real
- **Frontend**: SPA React que consome a API através do Gateway

### Comunicação Entre Serviços
- **API Gateway ↔ Microserviços**: TCP (NestJS Microservices)
- **Microserviços ↔ Banco**: PostgreSQL via TypeORM
- **Eventos Assíncronos**: RabbitMQ para comunicação entre tasks e notifications
- **Tempo Real**: WebSocket para notificações push

### Tecnologias

**Frontend:**
- React.js + TypeScript
- TanStack Router (roteamento)
- shadcn/ui + Tailwind CSS (UI/UX)
- Vite (build tool)

**Backend:**
- NestJS (framework)
- TypeORM (ORM)
- PostgreSQL (banco de dados)
- RabbitMQ (message broker)
- JWT (autenticação)

**DevOps:**
- Docker & Docker Compose
- Turborepo (monorepo)

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose
- Git

### 🐳 Execução via Docker (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd igame
   ```

2. **Execute com Docker:**
   ```bash
   docker compose up --build
   ```

3. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:3001
   - API Docs (Swagger): http://localhost:3001/api/docs
   - RabbitMQ Management: http://localhost:15672 (admin/admin)

### 💻 Execução Local (Desenvolvimento)

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie arquivos `.env` em cada serviço ou use as variáveis padrão do Docker Compose.

3. **Inicie o banco de dados e RabbitMQ:**
   ```bash
   docker compose up db rabbitmq -d
   ```

4. **Execute as migrações:**
   ```bash
   # Auth Service
   cd apps/auth-service
   npm run migration:run
   
   # Tasks Service  
   cd ../tasks-service
   npm run migration:run
   
   # Notifications Service
   cd ../notifications-service
   npm run migration:run
   ```

5. **Inicie os serviços:**
   ```bash
   # Na raiz do projeto
   npm run dev
   
   # Ou individualmente:
   cd apps/auth-service && npm run dev &
   cd apps/tasks-service && npm run dev &
   cd apps/notifications-service && npm run dev &
   cd apps/api-gateway && npm run dev &
   cd apps/web && npm run dev &
   ```

## ⚙️ Variáveis de Ambiente

### Configurações Docker (Padrão)
As seguintes variáveis já estão configuradas no `docker-compose.yml` e **não precisam ser alteradas** para desenvolvimento:

```yaml
# Banco de Dados
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=challenge_db

# Autenticação
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=superrefreshsecret

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

# Portas dos Serviços
API_GATEWAY_PORT=3001
AUTH_SERVICE_PORT=3002
TASKS_SERVICE_PORT=3003
NOTIFICATIONS_SERVICE_HTTP_PORT=3004
NOTIFICATIONS_SERVICE_TCP_PORT=3014
```

### Configurações para Ambiente Local
Para execução local, crie arquivos `.env` nos serviços com as variáveis citadas acima:


## 📊 Migrações do Banco

### Via Docker
As migrações são executadas automaticamente na inicialização dos containers.

### Localmente
```bash
# Gerar nova migração
cd apps/auth-service
npm run migration:generate -- migrations/NewMigrationName

# Executar migrações
npm run migration:run

# Reverter migração
npm run migration:revert
```

## 🏛️ Decisões Técnicas e Trade-offs

### ✅ Decisões Tomadas

**1. Arquitetura de Microserviços**
- **Por quê**: Escalabilidade independente, separação de responsabilidades
- **Trade-off**: Maior complexidade vs. flexibilidade

**2. NestJS com TCP para Comunicação Interna**
- **Por quê**: Performance superior ao HTTP, type safety nativo
- **Trade-off**: Menos debugging vs. melhor performance

**3. API Gateway como Ponto Único de Entrada**
- **Por quê**: Centralização de autenticação, rate limiting, CORS
- **Trade-off**: Single point of failure vs. controle centralizado

**4. TypeORM com Migrações**
- **Por quê**: Type safety, controle de versão do schema
- **Trade-off**: Overhead de configuração vs. robustez

**5. RabbitMQ para Eventos Assíncronos**
- **Por quê**: Desacoplamento, reliability, retry automático
- **Trade-off**: Complexidade adicional vs. confiabilidade

**6. Notifications Service Híbrido**
- **Por quê**: Flexibilidade para diferentes tipos de integração
- **Trade-off**: Maior complexidade vs. versatilidade

### 🔄 Trade-offs Principais

| Decisão | Vantagem | Desvantagem |
|---------|----------|-------------|
| Microserviços | Escalabilidade, deploy independente | Complexidade de rede, debugging |
| TCP vs HTTP interno | Performance, type safety | Menos tooling, debugging complexo |
| Monorepo | Código compartilhado, deploy único | Builds podem ser pesados |
| Docker Compose | Setup fácil, ambiente consistente | Não é produção-ready |

## ⚠️ Problemas Conhecidos

### 1. **Configuração de Portas no Notifications Service**
- **Problema**: Conflito entre HTTP e TCP na mesma porta
- **Solução Atual**: Portas separadas (3004 para HTTP, 3014 para TCP)
- **Status**: ✅ Resolvido

### 2. **Ordem de Inicialização dos Containers**
- **Problema**: API Gateway pode tentar conectar antes dos microserviços estarem prontos
- **Solução Atual**: depends_on no docker-compose
- **Status**: ⚠️ Parcialmente resolvido (pode haver timeouts ocasionais)

### 3. **Inconsistência de Variáveis de Ambiente**
- **Problema**: Algumas variáveis tinham nomes diferentes entre serviços
- **Solução Atual**: Padronização para `DB_NAME`
- **Status**: ✅ Resolvido

### 4. **Ausência de Health Checks**
- **Problema**: Dificulta o diagnóstico de problemas de conectividade
- **Status**: 🔄 Pendente

## 🔮 Melhorias Futuras

### Curto Prazo
- [ ] **Health Checks**: Implementar health checks em todos os serviços
- [ ] **Retry Logic**: Adicionar retry automático na comunicação entre serviços
- [ ] **Testes E2E**: Adicionar testes end-to-end com Docker

### Médio Prazo
- [ ] **Service Discovery**: Implementar Consul ou similar
- [ ] **Monitoring**: Prometheus + Grafana para métricas

### Longo Prazo
- [ ] **Kubernetes**: Migrar de Docker Compose para Kubernetes
- [ ] **API Versioning**: Implementar versionamento de APIs

## 📝 Comandos Úteis

```bash
# Parar todos os containers
docker compose down

# Ver logs de um serviço específico
docker compose logs -f auth-service

# Rebuild apenas um serviço
docker compose up --build auth-service

# Executar comando dentro de um container
docker compose exec auth-service npm run migration:run

# Limpar volumes (CUIDADO: apaga dados do banco)
docker compose down -v
```

## 🤝 Contribuição

1. Crie uma branch feature: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
