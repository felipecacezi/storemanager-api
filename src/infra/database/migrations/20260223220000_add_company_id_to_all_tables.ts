import type { Knex } from "knex";

const tables = ["users", "clients", "vendors", "products", "services", "service_orders"];

export async function up(knex: Knex): Promise<void> {
    for (const table of tables) {
        const hasColumn = await knex.schema.hasColumn(table, "company_id");
        if (!hasColumn) {
            await knex.schema.alterTable(table, (t) => {
                t.integer("company_id")
                    .unsigned()
                    .notNullable()
                    .defaultTo(0)
                    .references("id")
                    .inTable("companies");
            });
        }
    }
}

export async function down(knex: Knex): Promise<void> {
    for (const table of tables) {
        const hasColumn = await knex.schema.hasColumn(table, "company_id");
        if (hasColumn) {
            await knex.schema.alterTable(table, (t) => {
                t.dropColumn("company_id");
            });
        }
    }
}
