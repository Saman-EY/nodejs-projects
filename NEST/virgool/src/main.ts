import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigInit } from "./configs/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = process.env;

  SwaggerConfigInit(app);
  await app.listen(PORT, () => {
    console.log(`swagger http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
