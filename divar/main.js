const dotenv = require("dotenv");
const express = require("express");
const SwaggerConfig = require("./src/configs/swagger.config");
dotenv.config();

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;
  require("./src/configs/mongoose.config");
  SwaggerConfig(app);
  app.listen(3000, () => console.log(`server is running on http://localhost:${port}`));
}

main();
