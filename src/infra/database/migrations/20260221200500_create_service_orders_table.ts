import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('service_orders', table => {
        table.increments('id').primary();
        table.integer('client_id').notNullable().references('id').inTable('clients');
        table.string('description').notNullable();
        table.integer('service_id').notNullable().references('id').inTable('services');
        table.integer('product_id').notNullable().references('id').inTable('products');
        table.boolean('status').defaultTo(true);
        table.enu('service_status', ['pendente', 'em_andamento', 'concluido', 'finalizado', 'cancelado']).notNullable().defaultTo('pendente');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("service_orders");
}
