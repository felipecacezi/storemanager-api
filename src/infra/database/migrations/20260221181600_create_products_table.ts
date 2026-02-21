import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.integer('cost_price').notNullable();
        table.integer('sell_price').notNullable();
        table.integer('inventory').defaultTo(0);
        table.boolean('status').defaultTo(true);
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("products");
}
