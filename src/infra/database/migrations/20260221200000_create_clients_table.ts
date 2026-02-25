import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('clients', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('document').notNullable();
        table.string('phone').notNullable();
        table.boolean('is_whatsapp').defaultTo(false);
        table.string('country').nullable();
        table.string('address').nullable();
        table.string('number').nullable();
        table.string('city').nullable();
        table.string('neighborhood').nullable();
        table.string('state').nullable();
        table.string('zipcode').nullable();
        table.string('complement').nullable();
        table.boolean('status').defaultTo(true);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("clients");
}
