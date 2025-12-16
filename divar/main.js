const dotenv = require("dotenv");
const express = require("express");
const SwaggerConfig = require("./src/configs/swagger.config");
const mainRouter = require("./src/app.routes");
const NotFoundHandler = require("./src/common/exceptions/not-found.handler");
const AllExceptionHandler = require("./src/common/exceptions/all-exception.handler");
const cookieParser = require("cookie-parser");
const expressEjsLayouts = require("express-ejs-layouts");
dotenv.config();

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;
  require("./src/configs/mongoose.config");
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
  app.use(express.static("public"));
  app.use(expressEjsLayouts);
  app.set("view engine", "ejs");
  app.set("layout", "./layouts/panel/main.ejs");

  // swagger
  SwaggerConfig(app);

  // router
  app.use(mainRouter);

  // error handler
  NotFoundHandler(app);
  AllExceptionHandler(app);
  
  app.listen(3000, () => console.log(`server is running on http://localhost:${port}`));
}

main();
