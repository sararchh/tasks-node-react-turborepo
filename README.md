# iGame Monorepo

This is a monorepo for the iGame application using Turborepo.

## Structure

- `apps/web`: React front-end with TanStack Router, shadcn/ui, Tailwind CSS
- `apps/api-gateway`: Nest.js API Gateway with HTTP and WebSocket
- `apps/auth-service`: Nest.js authentication microservice
- `apps/tasks-service`: Nest.js tasks microservice with RabbitMQ
- `apps/notifications-service`: Nest.js notifications microservice with RabbitMQ and WebSocket
- `packages/types`: Shared TypeScript types
- `packages/utils`: Shared utilities
- `packages/eslint-config`: Shared ESLint configuration
- `packages/tsconfig`: Shared TypeScript configuration

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development environment:
   ```bash
   yarn dev
   ```

3. Or start with Docker:
   ```bash
   docker-compose up --build
   ```

## Technologies

- Front-end: React.js + TanStack Router + shadcn/ui + Tailwind CSS
- Back-end: Nest.js + TypeORM + RabbitMQ (microservices)
- Infra/DevX: Docker & docker-compose + Turborepo
