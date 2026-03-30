import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./configs/swagger.config";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, COOKIE_SECRET } = process.env;
  app.use(cookieParser(COOKIE_SECRET));

  SwaggerConfigInit(app);
  await app.listen(PORT, () => {
    console.log(`swagger http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
