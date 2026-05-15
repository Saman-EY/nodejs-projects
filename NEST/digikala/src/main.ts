import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { SwaggerConfigInit } from './config/swagger.config';

configDotenv();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000
  SwaggerConfigInit(app)
  await app.listen(port, () => {
    console.log(`server run on : http://localhost:${port}/swagger`)
  });
}
bootstrap();
