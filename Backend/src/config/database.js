const { Pool } = require("pg");

const { DATABASE_URL } = process.env;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Base de Dados Conectado!");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
