/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("movies", table => {
      table.increments("movie_id").primary();
      table.string("title");
      table.integer("runtime_in_minutes");
      table.string("rating");
      table.text("description");
      table.string("image_url");
      table.timestamps(true, true);
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("movies");
  };
