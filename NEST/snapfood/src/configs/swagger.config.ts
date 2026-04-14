import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function SwaggerConfigInit(app: INestApplication) {
  const document = new DocumentBuilder()
    .setTitle("SnapFood")
    .setDescription("SnapFood Backend With Nestjs!")
    .setVersion("v0.0.1")
    .addBearerAuth(SwaggerAuthConfig, "Authorization")
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
