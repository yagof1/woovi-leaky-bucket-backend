# Woovi Leaky Bucket Backend

## Visão Geral

Este projeto implementa uma estratégia de **Leaky Bucket** inspirada nas diretrizes do BACEN para limitação de requisições no Pix. Desenvolvido com Node.js, Koa.js, TypeScript e GraphQL, o sistema oferece controle de rate limiting multi-tenant baseado em tokens.

## Tecnologias

- **Node.js** + **TypeScript**
- **Koa.js** - Framework web minimalista
- **GraphQL** - API type-safe
- **JWT** - Autenticação stateless
- **Jest** - Testes unitários

## Estrutura do Projeto

```
woovi-leaky-bucket-backend/
├── src/
│   ├── index.ts        # Servidor Koa + GraphQL
│   ├── auth.ts         # Middleware JWT
│   ├── bucket.ts       # Lógica Leaky Bucket
│   ├── resolvers.ts    # Resolvers GraphQL
│   ├── schema.ts       # Schema GraphQL (typeDefs)
│   └── types.ts        # Definições de tipos
├── tests/              # Testes Jest
├── postman_collection.json  # Collection Postman
├── package.json
├── tsconfig.json
└── README.md
```

## Funcionalidades

### Autenticação
- Autenticação via **Bearer Token (JWT)**
- Middleware de validação automática
- Sistema multi-tenant por usuário

### Leaky Bucket
- **10 tokens iniciais** por usuário
- **1 token por requisição**
- Token devolvido em **sucesso**
- Token perdido em **falha**
- **+1 token/hora** (máximo 10)

### Mutation Pix
- Simula consulta de chave Pix (`queryPixKey`)
- Validação automática de tokens disponíveis
- Retorno de erro quando limite atingido

## Como executar

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose
- Yarn

### Instalação
```bash
git clone https://github.com/yagof1/woovi-leaky-bucket-backend.git
cd woovi-leaky-bucket-backend
yarn install
```

### Executar o projeto

#### Com Docker (recomendado)
```bash
docker-compose up
docker-compose up -d  # Background
```

#### Local
```bash
yarn dev
yarn build && yarn start  # Produção
```

### Acessar a aplicação
- **API:** `http://localhost:8080`
- **GraphQL Endpoint:** `http://localhost:8080/graphql`

## Testes

```bash
yarn test
yarn test --watch
```

### Cobertura de testes:
- Consumo correto de tokens
- Devolução de token em sucesso
- Redução de token em falha
- Reabastecimento por hora

## API GraphQL

### Queries e Mutations
```graphql
query {
  hello
}

mutation {
  queryPixKey(key: "user@email.com")
}
```

### Headers necessários
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Postman Collection
Importe o arquivo `postman_collection.json` no Postman para testar todas as queries e mutations disponíveis.

## Decisões de Arquitetura

### **Koa.js + TypeScript**
- Framework leve e moderno
- Suporte nativo para async/await
- Type safety garantida pelo TypeScript

### **GraphQL**
- API type-safe e auto-documentada
- Melhor experiência de desenvolvimento

### **JWT para autenticação**
- Stateless e escalável
- Padrão da indústria
- Facilita implementação multi-tenant

### **Leaky Bucket como middleware**
- Aplicado antes dos resolvers
- Garante rate limiting em todas as requisições
- Isolamento por usuário

## Próximos Passos

- [ ] Implementar persistência com MongoDB
- [ ] Adicionar métricas e logs
- [ ] Frontend React + Relay
- [ ] Leaky Bucket completo do BACEN Dict

## Licença

MIT License

---

**Desenvolvido por:** [Yago Costa](mailto:yagof_costa@hotmail.com)

