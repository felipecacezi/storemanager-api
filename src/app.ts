import fastify from "fastify";
import fastifyJwt from '@fastify/jwt';
import { userRoute } from "./infra/http/routes/user.route.js";
import { clientRoute } from "./infra/http/routes/clients.route.js";
import { vendorRoute } from "./infra/http/routes/vendor.route.js";
import { productRoute } from "./infra/http/routes/products.route.js";
import { serviceRoute } from "./infra/http/routes/services.route.js";
import { osRoute } from "./infra/http/routes/os.routes.js";
import { configurationsRoute } from "./infra/http/routes/configurations.route.js";
import knexPlugin from "./infra/database/plugins/knex-plugin.js";

const app = fastify({
    logger: true
});

app.register(fastifyJwt, {
    secret: 'sua-chave-secreta-super-segura'
});
app.register(knexPlugin);
app.register(userRoute);
app.register(clientRoute);
app.register(vendorRoute);
app.register(productRoute);
app.register(serviceRoute);
app.register(osRoute);
app.register(configurationsRoute);

export default app;
