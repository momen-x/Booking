import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useStaticAssets(join(__dirname, "..", "images"), {
    prefix: "/images",
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const swagger = new DocumentBuilder()
    .setTitle("learn nest js")
    .setDescription("this is a description of the project")
    .addServer("http://localhost:5000")
    .addBearerAuth()
    .setVersion("1.0")
    .setTermsOfService("https://www.google.com/") //here add your terms and privacy policy
    .setLicense("MIT License", "https://www.google.com/") //هنا الرخصة
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  //http://localhost:5000/api
  SwaggerModule.setup("api", app, document);
  app.use("/webhook", express.raw({ type: "application/json" }));
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
