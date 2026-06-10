const { Sequelize } = require("sequelize");

const { config } = require("dotenv");
config();
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true, 
  //     rejectUnauthorized: false,
  //   },
  // },
});

sequelize
  .authenticate()
  .then(() => console.log("database connected 🟢"))
  .catch((err) => console.log("❌ Cannot Connect to Database", err));

module.exports = { sequelize };
