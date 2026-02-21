import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.integer('service_price').notNullable();
        table.boolean('status').defaultTo(true);
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("services");
}
