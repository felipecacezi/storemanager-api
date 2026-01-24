import fastify from "fastify";
import { testRoute } from "./infra/http/routes/test.route.js";
import knexPlugin from "./infra/database/plugins/knex-plugin.js";

const app = fastify({
    logger: true
});

app.register(knexPlugin);
app.register(testRoute);

export default app;
