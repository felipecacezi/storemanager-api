import fastify from "fastify";
import fastifyJwt from '@fastify/jwt';
import { userRoute } from "./infra/http/routes/user.route.js";
import knexPlugin from "./infra/database/plugins/knex-plugin.js";

const app = fastify({
    logger: true
});

app.register(fastifyJwt, {
    secret: 'sua-chave-secreta-super-segura'
});
app.register(knexPlugin);
app.register(userRoute);

export default app;
