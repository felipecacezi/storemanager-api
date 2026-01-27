import fastify from "fastify";
import { userRoute } from "./infra/http/routes/user.route.js";
import knexPlugin from "./infra/database/plugins/knex-plugin.js";

const app = fastify({
    logger: true
});

app.register(knexPlugin);
app.register(userRoute);

export default app;
