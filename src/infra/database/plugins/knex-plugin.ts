import fp from "fastify-plugin";
import knex, { type Knex } from "knex";
import type { FastifyPluginAsync } from "fastify";

// Estendendo o tipo do Fastify para reconhecer o Knex
declare module 'fastify' {
    interface FastifyInstance {
        knex: Knex;
    }
}

const knexPlugin: FastifyPluginAsync = async (fastify, opts) => {
    const connection = knex({
        client: 'sqlite3',
        connection: {
            filename: './src/infra/database/dev.sqlite3'
        },
        useNullAsDefault: true
    });

    fastify.addHook('onClose', async (instance) => {
        await instance.knex.destroy();
    });

    fastify.decorate('knex', connection);
};

export default fp(knexPlugin);
