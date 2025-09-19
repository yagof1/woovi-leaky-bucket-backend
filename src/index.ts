import Koa from "koa";
import Router from "koa-router";
import { createHandler } from "graphql-http/lib/use/koa";
import { schema, root } from "./schema";

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 8080;

router.all("/graphql", createHandler({ 
  schema, 
  rootValue: root 
}));

router.get("/", (ctx) => {
  ctx.body = {
    message: "Woovi Leaky Bucket API",
    endpoints: {
      graphql: "/graphql"
    }
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});