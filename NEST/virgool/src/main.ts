import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./configs/swagger.config";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { PORT, COOKIE_SECRET } = process.env;
  app.use(cookieParser(COOKIE_SECRET));
  app.useStaticAssets("public");
  app.useGlobalPipes(new ValidationPipe())
  SwaggerConfigInit(app);
  await app.listen(PORT, () => {
    console.log(`swagger http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
