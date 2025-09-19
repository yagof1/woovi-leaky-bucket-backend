import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    hello: String
  }

  type Mutation {
    queryPixKey(key: String!): Boolean
  }
`);

export const root = {
  hello: () => "Hello Woovi!",
  queryPixKey: ({ key }: { key: string }) => {
    return key.endsWith("a");
  },
};