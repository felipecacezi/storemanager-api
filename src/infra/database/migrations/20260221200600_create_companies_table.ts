import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('companies', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('document').notNullable();
        table.string('phone').notNullable();
        table.boolean('is_whatsapp').defaultTo(false);
        table.string('zipcode').nullable();
        table.string('address').nullable();
        table.string('number').nullable();
        table.string('complement').nullable();
        table.string('neighborhood').nullable();
        table.string('city').nullable();
        table.string('state').nullable();
        table.string('country').nullable();
        table.boolean('status').defaultTo(true);
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("companies");
}
