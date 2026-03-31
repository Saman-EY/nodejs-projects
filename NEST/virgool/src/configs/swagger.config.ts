import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle("Virgool")
    .setDescription("backend for virgool")
    .addBearerAuth(SwaggerAuthConfig, "Authorization")
    .setVersion("v1.0.0")
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocument);
}

const SwaggerAuthConfig: SecuritySchemeObject = {
  type: "http",
  bearerFormat: "JWT",
  in: "header",
  scheme: "bearer",
};
