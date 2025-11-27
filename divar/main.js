const dotenv = require("dotenv");
const express = require("express");
const SwaggerConfig = require("./src/configs/swagger.config");
const mainRouter = require("./src/app.routes");
const NotFoundHandler = require("./src/common/exceptions/not-found.handler");
const AllExceptionHandler = require("./src/common/exceptions/all-exception.handler");
dotenv.config();

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;
  require("./src/configs/mongoose.config");
  app.use(express.json());
  app.use(express.urlencoded());
  
  app.use(mainRouter);
  NotFoundHandler(app);
  AllExceptionHandler(app);
  SwaggerConfig(app);
  app.listen(3000, () => console.log(`server is running on http://localhost:${port}`));
}

main();
